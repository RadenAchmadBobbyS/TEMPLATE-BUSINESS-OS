'use server';

import { prisma } from '@/shared/lib/prisma';

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
  });
}

export async function getIndustries() {
  return prisma.industry.findMany({
    orderBy: { name: 'asc' },
  });
}

import { SubscriptionTier } from '@prisma/client';

export async function getTemplates(params?: {
  search?: string;
  categoryId?: string;
  industryId?: string;
  tier?: SubscriptionTier;
}) {
  const { search, categoryId, industryId, tier } = params || {};

  return prisma.template.findMany({
    where: {
      ...(search ? { name: { contains: search, mode: 'insensitive' } } : {}),
      ...(categoryId ? { categoryId } : {}),
      ...(industryId ? { industryId } : {}),
      ...(tier ? { requiredTier: tier } : {}),
    },
    include: {
      category: true,
      industry: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getTemplate(slugOrId: string) {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(slugOrId);

  return prisma.template.findFirst({
    where: isUuid 
      ? { OR: [{ slug: slugOrId }, { id: slugOrId }] }
      : { slug: slugOrId },
    include: {
      category: true,
      industry: true,
    }
  });
}
