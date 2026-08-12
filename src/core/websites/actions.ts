"use server";

import { prisma } from "@/shared/lib/prisma";
import { auth } from "@/core/auth/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { createWebsiteSchema, updateWebsiteSchema } from "./schemas";
import { Prisma } from "@prisma/client";
import { templateDataSchema } from "@/core/templates/schemas";
import { deepCloneAndRemapIds, remapNavigationItems } from "@/core/templates/utils";
import { getRemainingQuota } from "@/core/billing/entitlements";
import { dispatchNotification } from "@/core/notifications/dispatcher";
import { NotificationTypes } from "@/core/notifications/types";

import { requireActiveWorkspace, getActiveWorkspace } from "@/core/workspaces/server-context";
function checkWritePermission(role: string) {
  if (role !== "OWNER" && role !== "ADMIN" && role !== "EDITOR") {
    throw new Error("Insufficient permissions to modify websites.");
  }
}

function generateBaseSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'website';
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
  if (!session) throw new Error("Unauthorized");

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

  let orderBy: Prisma.WebsiteOrderByWithRelationInput = { createdAt: "desc" };
  if (sort === "name_asc") orderBy = { name: "asc" };
  else if (sort === "name_desc") orderBy = { name: "desc" };
  else if (sort === "createdAt_asc") orderBy = { createdAt: "asc" };
  else if (sort === "createdAt_desc") orderBy = { createdAt: "desc" };

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
  if (!session) throw new Error("Unauthorized");

  const { workspace } = await requireActiveWorkspace();

  const website = await prisma.website.findFirst({
    where: { 
      id, 
      workspaceId: workspace.id,
      deletedAt: null // typically shouldn't fetch soft deleted sites directly here unless specified
    },
  });

  if (!website) {
    throw new Error("Website not found or unauthorized");
  }

  return website;
}

export async function createWebsite(data: { name: string; domain?: string; slug?: string; description?: string; templateId?: string }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const parsed = createWebsiteSchema.parse(data);
  const { workspace, role } = await requireActiveWorkspace();
  
  checkWritePermission(role);

  const websiteQuota = await getRemainingQuota(workspace.id, "websites");
  if (websiteQuota.remaining <= 0) {
    throw new Error(`Plan limit reached: You can only have up to ${websiteQuota.limit} websites on your current plan.`);
  }

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

      if (!template) throw new Error("Template not found");

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

          // Clone and remap the nodeTree
          const newTree = deepCloneAndRemapIds(tp.nodeTree, idMap);

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
              }
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
                }
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
    title: "Website Created",
    message: `Your website "${website.name}" has been created successfully.`,
    actionUrl: `/dashboard/websites/${website.id}/pages`,
    actionText: "Manage Pages",
  });

  revalidatePath("/dashboard/websites");
  return website;
}

export async function updateWebsite(id: string, data: { name: string; domain?: string; slug?: string; description?: string }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const parsed = updateWebsiteSchema.parse(data);
  const { workspace, role } = await requireActiveWorkspace();
  
  checkWritePermission(role);

  const website = await prisma.website.findFirst({
    where: { id, workspaceId: workspace.id },
  });
  if (!website) throw new Error("Website not found");

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

  revalidatePath("/dashboard/websites");
  return updated;
}

export async function archiveWebsite(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");
  
  const { workspace, role } = await requireActiveWorkspace();
  checkWritePermission(role);
  
  const website = await prisma.website.findFirst({
    where: { id, workspaceId: workspace.id },
  });
  if (!website) throw new Error("Website not found");

  const archived = await prisma.website.update({
    where: { id },
    data: { deletedAt: new Date() }, // Soft delete / archive
  });

  revalidatePath("/dashboard/websites");
  return archived;
}

export async function deleteWebsite(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");
  
  const { workspace, role } = await requireActiveWorkspace();
  checkWritePermission(role);
  
  const website = await prisma.website.findFirst({
    where: { id, workspaceId: workspace.id },
  });
  if (!website) throw new Error("Website not found");

  await prisma.website.delete({
    where: { id },
  });

  revalidatePath("/dashboard/websites");
  return { success: true };
}

export async function duplicateWebsite(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");
  
  const { workspace, role } = await requireActiveWorkspace();
  checkWritePermission(role);
  
  const website = await prisma.website.findFirst({
    where: { id, workspaceId: workspace.id },
  });
  if (!website) throw new Error("Website not found");

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

  revalidatePath("/dashboard/websites");
  return duplicated;
}

export async function restoreWebsite(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");
  
  const { workspace, role } = await requireActiveWorkspace();
  checkWritePermission(role);
  
  const website = await prisma.website.findFirst({
    where: { id, workspaceId: workspace.id },
  });
  if (!website) throw new Error("Website not found");

  const restored = await prisma.website.update({
    where: { id },
    data: { deletedAt: null },
  });

  revalidatePath("/dashboard/websites");
  return restored;
}

export async function updateWebsiteSettings(id: string, data: any) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");
  
  const { workspace, role } = await requireActiveWorkspace();
  checkWritePermission(role);
  
  const website = await prisma.website.findFirst({
    where: { id, workspaceId: workspace.id },
  });
  if (!website) throw new Error("Website not found");

  const updated = await prisma.website.update({
    where: { id },
    data: {
      settings: data ?? Prisma.JsonNull,
    },
  });

  revalidatePath(`/dashboard/websites/${id}/settings`);
  revalidatePath("/dashboard/websites");
  return updated;
}

export async function exportWebsiteToTemplate(websiteId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const { workspace, role } = await requireActiveWorkspace();
  checkWritePermission(role);

  const website = await prisma.website.findFirst({
    where: { id: websiteId, workspaceId: workspace.id },
    include: {
      pages: {
        include: {
          versions: {
            orderBy: { versionNumber: "desc" },
            take: 1
          }
        }
      },
      theme: true,
      cmsModels: {
        include: {
          entries: true
        }
      }
    }
  });

  if (!website) throw new Error("Website not found");

  const settings: any = website.settings || {};

  const templateData = {
    metadata: {
      version: "1.0",
      status: "published",
      thumbnail: "",
      description: website.description || ""
    },
    pages: website.pages.map(page => ({
      id: page.id,
      slug: page.slug,
      title: page.title,
      order: page.order,
      nodeTree: page.versions[0]?.nodeTree || {}
    })),
    theme: website.theme?.variables,
    navigation: settings.navigation || { navbar: [], footer: [] },
    cms: {
      models: website.cmsModels.map(model => ({
        id: model.id,
        name: model.name,
        schema: model.schema
      })),
      entries: website.cmsModels.flatMap(model => model.entries.map(entry => ({
        modelId: model.id,
        status: entry.status,
        data: entry.data
      })))
    }
  };

  return JSON.stringify({
    name: `${website.name} Template`,
    defaultTree: templateData
  }, null, 2);
}
