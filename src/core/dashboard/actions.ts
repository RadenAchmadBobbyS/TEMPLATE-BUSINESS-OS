'use server';

import { prisma } from '@/shared/lib/prisma';

export async function resolveBreadcrumbLabel(segment: string) {
  // Simple UUID regex check
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment);
  if (!isUuid) return null;

  try {
    // Try to find if it's a template
    const template = await prisma.template.findUnique({
      where: { id: segment },
      select: { name: true },
    });
    if (template) return template.name;

    // Try to find if it's a website
    const website = await prisma.website.findUnique({
      where: { id: segment },
      select: { name: true },
    });
    if (website) return website.name;
  } catch (error) {
    console.error('Failed to resolve breadcrumb label:', error);
  }

  // fallback
  return null;
}
