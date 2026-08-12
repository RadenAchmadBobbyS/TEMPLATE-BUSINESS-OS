"use server";

import { prisma } from "@/shared/lib/prisma";

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
  });
}

export async function getIndustries() {
  return prisma.industry.findMany({
    orderBy: { name: "asc" },
  });
}

export async function getTemplates(params?: { search?: string; categoryId?: string; industryId?: string }) {
  const { search, categoryId, industryId } = params || {};

  return prisma.template.findMany({
    where: {
      ...(search ? { name: { contains: search, mode: "insensitive" } } : {}),
      ...(categoryId ? { categoryId } : {}),
      ...(industryId ? { industryId } : {}),
    },
    include: {
      category: true,
      industry: true,
    },
    orderBy: { createdAt: "desc" },
  });
}
