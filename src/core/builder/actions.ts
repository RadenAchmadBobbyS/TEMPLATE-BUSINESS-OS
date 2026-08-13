'use server';

import { prisma } from '@/shared/lib/prisma';
import { requireActiveWorkspace } from '@/core/workspaces/server-context';
import { builderDocumentSchema, BuilderDocument } from './schemas';
import { toBuilderDocument } from './tree-normalizer';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

export async function getPageVersion(pageId: string) {
  const { workspace, role } = await requireActiveWorkspace();

  if (!['OWNER', 'ADMIN', 'EDITOR'].includes(role)) {
    throw new Error('Unauthorized to access builder');
  }

  const page = await prisma.page.findUnique({
    where: { id: pageId },
    include: {
      website: true,
      versions: {
        orderBy: { versionNumber: 'desc' },
        take: 1,
      },
    },
  });

  if (!page || page.website.workspaceId !== workspace.id) {
    throw new Error('Page not found or unauthorized');
  }

  const latestVersion = page.versions[0];

  if (!latestVersion) {
    // Return empty starter document
    return {
      versionNumber: 1,
      nodeTree: {
        version: 1,
        root: { id: 'root', type: 'Container', props: {}, styles: {}, children: [] },
      } as BuilderDocument,
    };
  }

  // Normalize all legacy node shapes into a valid builder document.
  const tree = toBuilderDocument(latestVersion.nodeTree as any);

  return {
    versionNumber: latestVersion.versionNumber,
    nodeTree: tree as BuilderDocument,
  };
}

export async function savePageVersion(pageId: string, document: BuilderDocument) {
  const { workspace, role } = await requireActiveWorkspace();

  if (!['OWNER', 'ADMIN', 'EDITOR'].includes(role)) {
    throw new Error('Unauthorized to save page');
  }

  // Validate the tree structure to prevent bad data
  try {
    builderDocumentSchema.parse(document);
  } catch (error) {
    console.error('Zod Validation Error:', error);
    throw new Error('Invalid builder document structure');
  }

  const page = await prisma.page.findUnique({
    where: { id: pageId },
    include: { website: true, versions: { orderBy: { versionNumber: 'desc' }, take: 1 } },
  });

  if (!page || page.website.workspaceId !== workspace.id) {
    throw new Error('Page not found or unauthorized');
  }

  const nextVersionNumber = (page.versions[0]?.versionNumber || 0) + 1;

  // We save as a NEW version if it's published, otherwise we just update the draft.
  // For V1, we'll always just update or create the draft version (version 1) to avoid exploding the DB,
  // or we can just append versions. To be safe, we'll append versions but keep it simple.

  const savedVersion = await prisma.pageVersion.create({
    data: {
      pageId,
      versionNumber: nextVersionNumber,
      nodeTree: document as any,
    },
  });

  revalidatePath(`/builder/${page.websiteId}/${pageId}`);

  return { success: true, versionId: savedVersion.id, versionNumber: savedVersion.versionNumber };
}
