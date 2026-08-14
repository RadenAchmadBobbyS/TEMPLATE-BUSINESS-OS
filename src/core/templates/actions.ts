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
  if (!session) throw new Error('Unauthorized');

  const active = await requireActiveWorkspaceAction();
  if (!active.success) return { success: false, error: active.error };
  const { workspace, role } = active;

  if (!['OWNER', 'ADMIN', 'EDITOR'].includes(role)) {
    throw new Error('Unauthorized to perform this action');
  }

  const website = await prisma.website.findFirst({
    where: { id: websiteId, workspaceId: workspace.id },
  });

  if (!website) throw new Error('Website not found or access denied');

  const template = await prisma.template.findUnique({
    where: { id: templateId },
  });

  if (!template) throw new Error('Template not found');

  const hasAccess = await hasTemplateAccess(workspace.id, (template as any).requiredTier);
  if (!hasAccess) {
    throw new Error(`This template requires the ${(template as any).requiredTier} plan or higher.`);
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
  if (!session) throw new Error('Unauthorized');

  let parsed: any;
  try {
    parsed = JSON.parse(jsonString);
  } catch {
    throw new Error('Invalid JSON format');
  }

  if (!parsed || !parsed.name || !parsed.defaultTree) {
    throw new Error("JSON must contain 'name' and 'defaultTree' properties");
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
  return template;
}
