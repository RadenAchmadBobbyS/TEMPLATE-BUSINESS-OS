'use server';

import { prisma } from '@/shared/lib/prisma';

export async function getShowcaseWebsites() {
  return prisma.website.findMany({
    where: {
      status: 'PUBLISHED',
    },
    select: {
      id: true,
      name: true,
      slug: true,
      domain: true,
      description: true,
      settings: true,
      // We only select safe public fields, avoiding internal workspace data or secrets
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 50,
  });
}
