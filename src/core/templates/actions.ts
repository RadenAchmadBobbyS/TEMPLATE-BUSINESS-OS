'use server';

import { prisma } from '@/shared/lib/prisma';
import { auth } from '@/core/auth/auth';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { hasTemplateAccess } from '@/core/billing/entitlements';
import { toBuilderDocument } from '@/core/builder/tree-normalizer';
import { requireActiveWorkspace, requireActiveWorkspaceAction } from '@/core/workspaces/server-context';

export async function applyTemplateToWebsite(templateId: string, websiteId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { success: false, error: 'Unauthorized' };

  const active = await requireActiveWorkspaceAction();
  if (!active.success) return { success: false, error: active.error };
  const { workspace, role } = active;

  if (!['OWNER', 'ADMIN', 'EDITOR'].includes(role)) {
    return { success: false, error: 'Unauthorized to perform this action' };
  }

  const website = await prisma.website.findFirst({
    where: { id: websiteId, workspaceId: workspace.id },
  });

  if (!website) return { success: false, error: 'Website not found or access denied' };

  const template = await prisma.template.findUnique({
    where: { id: templateId },
  });

  if (!template) return { success: false, error: 'Template not found' };

  const hasAccess = await hasTemplateAccess(workspace.id, (template as any).requiredTier);
  if (!hasAccess) {
    return { success: false, error: `This template requires the ${(template as any).requiredTier} plan or higher.` };
  }

  let page = await prisma.page.findFirst({
    where: { websiteId, slug: '/' },
  });

  if (!page) {
    page = await prisma.page.create({
      data: {
        websiteId,
        slug: '/',
        title: 'Home',
      },
    });
  }

  const latestVersion = await prisma.pageVersion.findFirst({
    where: { pageId: page.id },
    orderBy: { versionNumber: 'desc' },
  });

  const nextVersionNumber = latestVersion ? latestVersion.versionNumber + 1 : 1;

  let homeNodeTree: any = {};

  if (template.defaultTree) {
    try {
      const templateData = template.defaultTree as any;
      if (templateData.pages && Array.isArray(templateData.pages)) {
        const homePageTemplate = templateData.pages.find((p: any) => p.slug === '/');
        if (homePageTemplate && homePageTemplate.nodeTree) {
          homeNodeTree = homePageTemplate.nodeTree;
        } else if (templateData.pages.length > 0) {
          homeNodeTree = templateData.pages[0].nodeTree || {};
        }
      } else {
        // Fallback for older formats or direct tree
        homeNodeTree = template.defaultTree;
      }
    } catch {
      homeNodeTree = template.defaultTree;
    }
  }

  await prisma.pageVersion.create({
    data: {
      pageId: page.id,
      versionNumber: nextVersionNumber,
      nodeTree: toBuilderDocument(homeNodeTree),
    },
  });

  revalidatePath('/dashboard/websites');
  return { success: true, websiteId: website.id };
}

export async function importCustomTemplate(jsonString: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { success: false, error: 'Unauthorized' };

  let parsed: any;
  try {
    parsed = JSON.parse(jsonString);
  } catch {
    return { success: false, error: 'Invalid JSON format' };
  }

  if (!parsed || !parsed.name || !parsed.defaultTree) {
    return { success: false, error: "JSON must contain 'name' and 'defaultTree' properties" };
  }

  // Find a generic category for imported templates, or create one
  let category = await prisma.category.findFirst({ where: { name: 'Custom' } });
  if (!category) {
    category = await prisma.category.create({ data: { name: 'Custom' } });
  }

  let industry = await prisma.industry.findFirst({ where: { name: 'General' } });
  if (!industry) {
    industry = await prisma.industry.create({ data: { name: 'General' } });
  }

  const template = await prisma.template.create({
    data: {
      name: parsed.name,
      categoryId: category.id,
      industryId: industry.id,
      defaultTree: parsed.defaultTree,
      requiredTier: 'FREE',
    },
  });

  revalidatePath('/dashboard/templates');
  return { success: true, template };
}

export async function exportWebsiteAsTemplateJSON(websiteId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { success: false, error: 'Unauthorized' };

  const active = await requireActiveWorkspaceAction();
  if (!active.success) return { success: false, error: active.error };
  const { workspace, role } = active;

  if (!['OWNER', 'ADMIN', 'EDITOR'].includes(role)) {
    return { success: false, error: 'Unauthorized' };
  }

  const website = await prisma.website.findFirst({
    where: { id: websiteId, workspaceId: workspace.id },
    include: {
      pages: {
        include: {
          versions: { orderBy: { versionNumber: 'desc' }, take: 1 }
        }
      },
      cmsModels: {
        include: {
          entries: true
        }
      }
    }
  });

  if (!website) return { success: false, error: 'Website not found' };

  const defaultTree = {
    pages: website.pages.map(p => ({
      slug: p.slug,
      title: p.title,
      nodeTree: p.versions[0]?.nodeTree || {}
    })),
    cms: {
      models: website.cmsModels.map(m => ({
        id: m.id,
        name: m.name,
        schema: m.schema
      })),
      entries: website.cmsModels.flatMap(m => m.entries.map(e => ({
        modelId: e.modelId,
        status: e.status,
        data: e.data
      })))
    }
  };

  const exportData = {
    name: `${website.name} Template`,
    defaultTree
  };

  return { success: true, json: JSON.stringify(exportData, null, 2) };
}
