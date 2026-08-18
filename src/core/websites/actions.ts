'use server';

import { prisma } from '@/shared/lib/prisma';
import { auth } from '@/core/auth/auth';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { createWebsiteSchema, updateWebsiteSchema } from './schemas';
import { Prisma } from '@prisma/client';
import { templateDataSchema } from '@/core/templates/schemas';
import { deepCloneAndRemapIds, remapNavigationItems } from '@/core/templates/utils';
import { toBuilderDocument } from '@/core/builder/tree-normalizer';
import {
  assertWebsiteQuotaAvailable,
  getRemainingQuota,
  getWebsiteQuotaUsage,
  hasTemplateAccess,
} from '@/core/billing/entitlements';
import { dispatchNotification } from '@/core/notifications/dispatcher';
import { NotificationTypes } from '@/core/notifications/types';

import { requireActiveWorkspace, requireActiveWorkspaceAction, getActiveWorkspace, hasWorkspacePermission, canPerformDestructiveAction } from '@/core/workspaces/server-context';
function hasWritePermission(role: string) {
  return hasWorkspacePermission(role, 'EDITOR');
}

function hasDestructivePermission(role: string, canCreateDelete: boolean) {
  return canPerformDestructiveAction(role, canCreateDelete);
}

function generateBaseSlug(name: string) {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'website'
  );
}

async function getUniqueSlug(baseSlug: string) {
  let uniqueSlug = baseSlug;
  let counter = 1;
  while (await prisma.website.findUnique({ where: { slug: uniqueSlug } })) {
    uniqueSlug = `${baseSlug}-${counter}`;
    counter++;
  }
  return uniqueSlug;
}

export type GetWebsitesOptions = {
  status?: 'active' | 'archived';
  search?: string;
  sort?: string;
  filter?: string;
  page?: number;
  limit?: number;
};

export async function getUserWebsites(options: GetWebsitesOptions = {}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error('Unauthorized');

  const active = await getActiveWorkspace();
  if (!active) {
    return { websites: [], total: 0, pages: 0 };
  }
  const { workspace } = active;

  const {
    status = 'active',
    search,
    sort = 'createdAt_desc',
    filter, // could be used for industry or status, but skipping for now
    page = 1,
    limit = 20,
  } = options;

  const where: Prisma.WebsiteWhereInput = {
    workspaceId: workspace.id,
    deletedAt: status === 'active' ? null : { not: null },
  };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { domain: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  let orderBy: Prisma.WebsiteOrderByWithRelationInput = { createdAt: 'desc' };
  if (sort === 'name_asc') orderBy = { name: 'asc' };
  else if (sort === 'name_desc') orderBy = { name: 'desc' };
  else if (sort === 'createdAt_asc') orderBy = { createdAt: 'asc' };
  else if (sort === 'createdAt_desc') orderBy = { createdAt: 'desc' };

  const skip = (page - 1) * limit;

  const [websites, total] = await Promise.all([
    prisma.website.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    }),
    prisma.website.count({ where }),
  ]);

  return { websites, total, pages: Math.ceil(total / limit) };
}

export async function getWebsiteById(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error('Unauthorized');

  const active = await requireActiveWorkspaceAction();
  if (!active.success) throw new Error(active.error);
  const { workspace } = active;

  const website = await prisma.website.findFirst({
    where: {
      id,
      workspaceId: workspace.id,
      deletedAt: null, // typically shouldn't fetch soft deleted sites directly here unless specified
    },
  });

  if (!website) {
    throw new Error('Website not found or unauthorized');
  }

  return website;
}

export async function createWebsite(data: {
  name: string;
  domain?: string;
  slug?: string;
  description?: string;
  templateId?: string;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { success: false, error: 'Unauthorized' };

  const parsed = createWebsiteSchema.parse(data);
  const active = await requireActiveWorkspaceAction();
  if (!active.success) return { success: false, error: active.error };
  const { workspace, role, canCreateDelete } = active;

  if (!hasDestructivePermission(role, canCreateDelete)) {
    return { success: false, error: 'Insufficient permissions' };
  }

  await assertWebsiteQuotaAvailable(workspace.id, 1);

  const baseSlug = parsed.slug ? generateBaseSlug(parsed.slug) : generateBaseSlug(parsed.name);
  const uniqueSlug = await getUniqueSlug(baseSlug);

  const website = await prisma.$transaction(async (tx) => {
    const newSite = await tx.website.create({
      data: {
        name: parsed.name,
        slug: uniqueSlug,
        domain: parsed.domain || null,
        description: parsed.description || null,
        workspaceId: workspace.id,
      },
    });

    if (parsed.templateId) {
      const template = await tx.template.findUnique({
        where: { id: parsed.templateId },
      });

      if (!template) throw new Error('Template not found');

      const hasAccess = await hasTemplateAccess(workspace.id, (template as any).requiredTier);
      if (!hasAccess) {
        throw new Error(
          `This template requires the ${(template as any).requiredTier} plan or higher.`,
        );
      }

      // Validate the template payload matches our expected blueprint format
      const templateData = templateDataSchema.parse(template.defaultTree || {});
      const idMap: Record<string, string> = {};

      if (templateData.pages) {
        for (const tp of templateData.pages) {
          const newPage = await tx.page.create({
            data: {
              websiteId: newSite.id,
              slug: tp.slug,
              title: tp.title,
              order: tp.order,
              isPublished: false,
            },
          });

          idMap[tp.id] = newPage.id;

          // Clone/remap then normalize to a valid builder document.
          const remappedTree = deepCloneAndRemapIds(tp.nodeTree, idMap);
          const newTree = toBuilderDocument(remappedTree);

          await tx.pageVersion.create({
            data: {
              pageId: newPage.id,
              versionNumber: 1,
              nodeTree: newTree,
            },
          });
        }
      }

      // Add Theme
      if (templateData.theme) {
        await tx.theme.create({
          data: {
            websiteId: newSite.id,
            variables: templateData.theme,
          },
        });
      }

      // Add Navigation
      if (templateData.navigation) {
        const remappedNav = {
          navbar: remapNavigationItems(templateData.navigation.navbar, idMap),
          footer: remapNavigationItems(templateData.navigation.footer, idMap),
        };
        await tx.website.update({
          where: { id: newSite.id },
          data: {
            settings: {
              navigation: remappedNav,
            },
          },
        });
      }

      // Add CMS
      if (templateData.cms) {
        const cmsIdMap: Record<string, string> = {};

        if (templateData.cms.models) {
          for (const model of templateData.cms.models) {
            const newModel = await tx.cmsModel.create({
              data: {
                websiteId: newSite.id,
                name: model.name,
                schema: model.schema ?? {},
              },
            });
            cmsIdMap[model.id] = newModel.id;
          }
        }

        if (templateData.cms.entries) {
          for (const entry of templateData.cms.entries) {
            const mappedModelId = cmsIdMap[entry.modelId];
            if (mappedModelId) {
              await tx.cmsEntry.create({
                data: {
                  modelId: mappedModelId,
                  status: entry.status as any,
                  data: entry.data ?? {},
                },
              });
            }
          }
        }
      }
    }

    return newSite;
  });

  // Dispatch Notification
  await dispatchNotification({
    userId: session.user.id,
    workspaceId: workspace.id,
    type: NotificationTypes.WEBSITE_CREATED,
    title: 'Website Created',
    message: `Your website "${website.name}" has been created successfully.`,
    actionUrl: `/dashboard/websites/${website.id}/pages`,
    actionText: 'Manage Pages',
  });

  revalidatePath('/dashboard/websites');
  return website;
}

export async function updateWebsite(
  id: string,
  data: { name: string; domain?: string; slug?: string; description?: string },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { success: false, error: 'Unauthorized' };

  const parsed = updateWebsiteSchema.parse(data);
  const active = await requireActiveWorkspaceAction();
  if (!active.success) return { success: false, error: active.error };
  const { workspace, role } = active;

  if (!hasWritePermission(role)) {
    return { success: false, error: 'Insufficient permissions' };
  }

  const website = await prisma.website.findFirst({
    where: { id, workspaceId: workspace.id },
  });
  if (!website) return { success: false, error: 'Website not found' };

  let newSlug = website.slug;
  if (parsed.slug && parsed.slug !== website.slug) {
    newSlug = await getUniqueSlug(generateBaseSlug(parsed.slug));
  }

  const updated = await prisma.website.update({
    where: { id },
    data: {
      name: parsed.name,
      slug: newSlug,
      domain: parsed.domain || null,
      description: parsed.description || null,
    },
  });

  revalidatePath('/dashboard/websites');
  return updated;
}

export async function archiveWebsite(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { success: false, error: 'Unauthorized' };

  const active = await requireActiveWorkspaceAction();
  if (!active.success) return { success: false, error: active.error };
  const { workspace, role, canCreateDelete } = active;
  if (!hasDestructivePermission(role, canCreateDelete)) {
    return { success: false, error: 'Insufficient permissions' };
  }

  const website = await prisma.website.findFirst({
    where: { id, workspaceId: workspace.id },
  });
  if (!website) return { success: false, error: 'Website not found' };

  const archived = await prisma.website.update({
    where: { id },
    data: { deletedAt: new Date() }, // Soft delete / archive
  });

  revalidatePath('/dashboard/websites');
  return archived;
}

export async function applyTemplateToWebsite(websiteId: string, templateId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { success: false, error: 'Unauthorized' };

  const active = await requireActiveWorkspaceAction();
  if (!active.success) return { success: false, error: active.error };
  const { workspace, role } = active;
  if (!hasWritePermission(role)) {
    return { success: false, error: 'Insufficient permissions' };
  }

  const website = await prisma.website.findFirst({
    where: { id: websiteId, workspaceId: workspace.id },
  });
  if (!website) return { success: false, error: 'Website not found' };

  const template = await prisma.template.findUnique({
    where: { id: templateId },
  });
  if (!template) return { success: false, error: 'Template not found' };

  const hasAccess = await hasTemplateAccess(workspace.id, (template as any).requiredTier);
  if (!hasAccess) {
    return { success: false, error: `This template requires the ${(template as any).requiredTier} plan or higher.` };
  }

  const templateData = templateDataSchema.parse(template.defaultTree || {});

  await prisma.$transaction(async (tx) => {
    const idMap: Record<string, string> = {};

    if (templateData.pages) {
      for (const tp of templateData.pages) {
        // Append unique suffix to slug if it already exists
        let uniqueSlug = tp.slug;
        const existingPage = await tx.page.findFirst({
          where: { websiteId, slug: tp.slug },
        });
        if (existingPage) {
          uniqueSlug = `${tp.slug}-${Math.random().toString(36).substring(7)}`;
        }

        const newPage = await tx.page.create({
          data: {
            websiteId,
            slug: uniqueSlug,
            title: tp.title,
            order: tp.order,
            isPublished: false,
          },
        });

        idMap[tp.id] = newPage.id;

        const remappedTree = deepCloneAndRemapIds(tp.nodeTree, idMap);
        const newTree = toBuilderDocument(remappedTree);

        await tx.pageVersion.create({
          data: {
            pageId: newPage.id,
            versionNumber: 1,
            nodeTree: newTree,
          },
        });
      }
    }

    if (templateData.theme) {
      // Upsert theme
      const existingTheme = await tx.theme.findFirst({ where: { websiteId } });
      if (existingTheme) {
        await tx.theme.update({
          where: { id: existingTheme.id },
          data: { variables: templateData.theme },
        });
      } else {
        await tx.theme.create({
          data: { websiteId, variables: templateData.theme },
        });
      }
    }

    if (templateData.navigation) {
      const remappedNav = {
        navbar: remapNavigationItems(templateData.navigation.navbar, idMap),
        footer: remapNavigationItems(templateData.navigation.footer, idMap),
      };

      const currentSite = await tx.website.findUnique({ where: { id: websiteId } });
      const existingSettings = (currentSite?.settings as any) || {};

      await tx.website.update({
        where: { id: websiteId },
        data: {
          settings: {
            ...existingSettings,
            navigation: remappedNav,
          },
        },
      });
    }

    if (templateData.cms) {
      const cmsIdMap: Record<string, string> = {};

      if (templateData.cms.models) {
        for (const model of templateData.cms.models) {
          const newModel = await tx.cmsModel.create({
            data: {
              websiteId,
              name: model.name,
              schema: model.schema ?? {},
            },
          });
          cmsIdMap[model.id] = newModel.id;
        }
      }

      if (templateData.cms.entries) {
        for (const entry of templateData.cms.entries) {
          const mappedModelId = cmsIdMap[entry.modelId];
          if (mappedModelId) {
            await tx.cmsEntry.create({
              data: {
                modelId: mappedModelId,
                status: entry.status as any,
                data: entry.data ?? {},
              },
            });
          }
        }
      }
    }
  });

  revalidatePath(`/dashboard/websites/${websiteId}/pages`);
  revalidatePath(`/dashboard/websites/${websiteId}/theme`);
  revalidatePath(`/dashboard/websites/${websiteId}/navigation`);
  return website;
}

export async function deleteWebsite(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { success: false, error: 'Unauthorized' };

  const active = await requireActiveWorkspaceAction();
  if (!active.success) return { success: false, error: active.error };
  const { workspace, role, canCreateDelete } = active;
  if (!hasDestructivePermission(role, canCreateDelete)) {
    return { success: false, error: 'Insufficient permissions' };
  }

  const website = await prisma.website.findFirst({
    where: { id, workspaceId: workspace.id },
  });
  if (!website) return { success: false, error: 'Website not found' };

  await prisma.website.delete({
    where: { id },
  });

  revalidatePath('/dashboard/websites');
  return { success: true };
}

export async function duplicateWebsite(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { success: false, error: 'Unauthorized' };

  const active = await requireActiveWorkspaceAction();
  if (!active.success) return { success: false, error: active.error };
  const { workspace, role, canCreateDelete } = active;
  if (!hasDestructivePermission(role, canCreateDelete)) {
    return { success: false, error: 'Insufficient permissions' };
  }

  const website = await prisma.website.findFirst({
    where: { id, workspaceId: workspace.id },
  });
  if (!website) return { success: false, error: 'Website not found' };

  await assertWebsiteQuotaAvailable(workspace.id, 1);

  const baseSlug = generateBaseSlug(`${website.name} Copy`);
  const uniqueSlug = await getUniqueSlug(baseSlug);

  const duplicated = await prisma.website.create({
    data: {
      name: `${website.name} (Copy)`,
      slug: uniqueSlug,
      domain: null, // Don't duplicate custom domain as it must be unique typically
      description: website.description,
      settings: website.settings ?? Prisma.JsonNull,
      workspaceId: workspace.id,
    },
  });

  revalidatePath('/dashboard/websites');
  return duplicated;
}

export async function restoreWebsite(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { success: false, error: 'Unauthorized' };

  const active = await requireActiveWorkspaceAction();
  if (!active.success) return { success: false, error: active.error };
  const { workspace, role, canCreateDelete } = active;
  if (!hasDestructivePermission(role, canCreateDelete)) {
    return { success: false, error: 'Insufficient permissions' };
  }

  const website = await prisma.website.findFirst({
    where: { id, workspaceId: workspace.id },
  });
  if (!website) return { success: false, error: 'Website not found' };

  const quota = await getWebsiteQuotaUsage(workspace.id);
  if (quota.used >= quota.limit) {
    return { success: false, error: 'Website limit reached. Archived websites still count toward your plan limit.' };
  }

  const restored = await prisma.website.update({
    where: { id },
    data: { deletedAt: null },
  });

  revalidatePath('/dashboard/websites');
  return restored;
}

export async function updateWebsiteSettings(id: string, data: any) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { success: false, error: 'Unauthorized' };

  const active = await requireActiveWorkspaceAction();
  if (!active.success) return { success: false, error: active.error };
  const { workspace, role } = active;
  if (!hasWritePermission(role)) {
    return { success: false, error: 'Insufficient permissions' };
  }

  const website = await prisma.website.findFirst({
    where: { id, workspaceId: workspace.id },
  });
  if (!website) return { success: false, error: 'Website not found' };

  const updated = await prisma.website.update({
    where: { id },
    data: {
      settings: data ?? Prisma.JsonNull,
    },
  });

  revalidatePath(`/dashboard/websites/${id}/settings`);
  revalidatePath('/dashboard/websites');
  return updated;
}

export async function exportWebsiteToTemplate(websiteId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { success: false, error: 'Unauthorized' };

  const active = await requireActiveWorkspaceAction();
  if (!active.success) return { success: false, error: active.error };
  const { workspace, role } = active;
  if (!hasWritePermission(role)) {
    return { success: false, error: 'Insufficient permissions' };
  }

  const website = await prisma.website.findFirst({
    where: { id: websiteId, workspaceId: workspace.id },
    include: {
      pages: {
        include: {
          versions: {
            orderBy: { versionNumber: 'desc' },
            take: 1,
          },
        },
      },
      theme: true,
      cmsModels: {
        include: {
          entries: true,
        },
      },
    },
  });

  if (!website) return { success: false, error: 'Website not found' };

  const settings: any = website.settings || {};

  const templateData = {
    metadata: {
      version: '1.0',
      status: 'published',
      thumbnail: '',
      description: website.description || '',
    },
    pages: website.pages.map((page) => ({
      id: page.id,
      slug: page.slug,
      title: page.title,
      order: page.order,
      nodeTree: page.versions[0]?.nodeTree || {},
    })),
    theme: website.theme?.variables,
    navigation: settings.navigation || { navbar: [], footer: [] },
    cms: {
      models: website.cmsModels.map((model) => ({
        id: model.id,
        name: model.name,
        schema: model.schema,
      })),
      entries: website.cmsModels.flatMap((model) =>
        model.entries.map((entry) => ({
          modelId: model.id,
          status: entry.status,
          data: entry.data,
        })),
      ),
    },
  };

  return JSON.stringify(
    {
      name: `${website.name} Template`,
      defaultTree: templateData,
    },
    null,
    2,
  );
}
