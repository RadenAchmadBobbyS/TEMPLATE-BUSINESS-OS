"use server";

import { prisma } from "@/shared/lib/prisma";
import { auth } from "@/core/auth/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { createPageSchema, pageSettingsSchema } from "./schemas";
import { requireActiveWorkspace, requireActiveWorkspaceAction, checkWorkspacePermission } from "@/core/workspaces/server-context";
import { getWorkspacePlan } from "@/core/billing/entitlements";

type RoleAccess = "OWNER" | "ADMIN" | "EDITOR";

async function ensureWebsiteAccess(websiteId: string, requiredRole: RoleAccess = "EDITOR") {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const active = await requireActiveWorkspaceAction();
  if (!active.success) throw new Error(active.error);
  const { workspace, role } = active;
  checkWorkspacePermission(role, requiredRole);

  const website = await prisma.website.findFirst({
    where: { id: websiteId, workspaceId: workspace.id },
  });

  if (!website) throw new Error("Website not found or unauthorized");
  return website;
}

export async function getPages(websiteId: string) {
  await ensureWebsiteAccess(websiteId, "EDITOR");

  return prisma.page.findMany({
    where: { websiteId, deletedAt: null },
    orderBy: { order: "asc" },
  });
}

export async function createPage(websiteId: string, data: any) {
  const website = await ensureWebsiteAccess(websiteId, "EDITOR");
  const parsed = createPageSchema.parse(data);

  // Check page limits
  const plan = await getWorkspacePlan(website.workspaceId);
  const pageCount = await prisma.page.count({ where: { websiteId, deletedAt: null } });
  if (pageCount >= plan.limits.maxPagesPerWebsite) {
    throw new Error(`Plan limit reached: You can only have up to ${plan.limits.maxPagesPerWebsite} pages per website on your current plan.`);
  }

  // Check if slug is unique
  const existing = await prisma.page.findFirst({
    where: { websiteId, slug: parsed.slug, deletedAt: null },
  });

  if (existing) {
    throw new Error(`A page with slug '${parsed.slug}' already exists.`);
  }

  // Get max order
  const maxOrderPage = await prisma.page.findFirst({
    where: { websiteId },
    orderBy: { order: "desc" },
  });
  
  const order = maxOrderPage ? maxOrderPage.order + 1 : 0;

  const page = await prisma.page.create({
    data: {
      websiteId,
      title: parsed.title,
      slug: parsed.slug,
      parentId: parsed.parentId || null,
      order,
    },
  });

  // Create an initial blank version
  await prisma.pageVersion.create({
    data: {
      pageId: page.id,
      versionNumber: 1,
      nodeTree: { type: "Container", props: {}, children: [] },
    },
  });

  revalidatePath(`/dashboard/websites/${websiteId}/pages`);
  return page;
}

export async function duplicatePage(pageId: string) {
  const page = await prisma.page.findUnique({
    where: { id: pageId },
  });

  if (!page) throw new Error("Page not found");
  const website = await ensureWebsiteAccess(page.websiteId, "EDITOR");

  // Check page limits
  const plan = await getWorkspacePlan(website.workspaceId);
  const pageCount = await prisma.page.count({ where: { websiteId: page.websiteId, deletedAt: null } });
  if (pageCount >= plan.limits.maxPagesPerWebsite) {
    throw new Error(`Plan limit reached: You can only have up to ${plan.limits.maxPagesPerWebsite} pages per website on your current plan.`);
  }

  // Get max order
  const maxOrderPage = await prisma.page.findFirst({
    where: { websiteId: page.websiteId },
    orderBy: { order: "desc" },
  });
  const order = maxOrderPage ? maxOrderPage.order + 1 : 0;

  const duplicated = await prisma.page.create({
    data: {
      websiteId: page.websiteId,
      title: `${page.title} (Copy)`,
      slug: `${page.slug}-copy-${Date.now()}`,
      parentId: page.parentId,
      order,
      settings: page.settings || undefined,
    },
  });

  // Clone latest version
  const latestVersion = await prisma.pageVersion.findFirst({
    where: { pageId: page.id },
    orderBy: { versionNumber: "desc" },
  });

  await prisma.pageVersion.create({
    data: {
      pageId: duplicated.id,
      versionNumber: 1,
      nodeTree: latestVersion?.nodeTree || { type: "Container", props: {}, children: [] },
    },
  });

  revalidatePath(`/dashboard/websites/${page.websiteId}/pages`);
  return duplicated;
}

export async function deletePage(pageId: string) {
  const page = await prisma.page.findUnique({ where: { id: pageId } });
  if (!page) throw new Error("Page not found");
  await ensureWebsiteAccess(page.websiteId, "EDITOR");

  // Prevent deleting homepage
  if (page.slug === "/") {
    throw new Error("Cannot delete the homepage.");
  }

  // Soft delete (or hard delete based on preference. Using hard delete for simplicity on child pages)
  await prisma.page.delete({
    where: { id: pageId },
  });

  // Cascade deletion to Navigation JSON tree
  const website = await prisma.website.findUnique({
    where: { id: page.websiteId },
    select: { settings: true }
  });

  if (website?.settings) {
    const settings = website.settings as any;
    if (settings.navigation) {
      const removePageRefs = (items: any[]): any[] => {
        return items.filter(item => item.pageId !== pageId).map(item => {
          if (item.children) {
            return { ...item, children: removePageRefs(item.children) };
          }
          return item;
        });
      };

      if (settings.navigation.navbar) {
        settings.navigation.navbar = removePageRefs(settings.navigation.navbar);
      }
      if (settings.navigation.footer) {
        settings.navigation.footer = removePageRefs(settings.navigation.footer);
      }

      await prisma.website.update({
        where: { id: page.websiteId },
        data: { settings },
      });
    }
  }

  revalidatePath(`/dashboard/websites/${page.websiteId}/pages`);
  return { success: true };
}

export async function updatePageSettings(pageId: string, data: any) {
  const page = await prisma.page.findUnique({ where: { id: pageId } });
  if (!page) throw new Error("Page not found");
  await ensureWebsiteAccess(page.websiteId, "EDITOR");

  const { title, slug, ...settingsData } = data;
  const parsedSettings = pageSettingsSchema.parse(settingsData);
  
  const newSlug = slug || page.slug;

  if (page.slug === "/" && newSlug !== "/") {
    throw new Error("Cannot change the slug of the homepage directly. Use 'Set as Homepage' on another page instead.");
  }

  if (page.slug !== "/" && newSlug === "/") {
    throw new Error("Cannot manually set slug to '/'. Use 'Set as Homepage' action instead.");
  }

  if (newSlug !== page.slug) {
    const existing = await prisma.page.findFirst({
      where: { websiteId: page.websiteId, slug: newSlug, deletedAt: null },
    });
    if (existing) {
      throw new Error(`A page with slug '${newSlug}' already exists.`);
    }
  }

  const updated = await prisma.page.update({
    where: { id: pageId },
    data: {
      title: title || page.title,
      slug: newSlug,
      settings: parsedSettings,
    },
  });

  revalidatePath(`/dashboard/websites/${page.websiteId}/pages`);
  return updated;
}

export async function togglePublishState(pageId: string, isPublished: boolean) {
  const page = await prisma.page.findUnique({ where: { id: pageId } });
  if (!page) throw new Error("Page not found");
  await ensureWebsiteAccess(page.websiteId, "EDITOR");

  await prisma.page.update({
    where: { id: pageId },
    data: { isPublished },
  });

  revalidatePath(`/dashboard/websites/${page.websiteId}/pages`);
}

export async function setHomepage(pageId: string) {
  const page = await prisma.page.findUnique({ where: { id: pageId } });
  if (!page) throw new Error("Page not found");
  await ensureWebsiteAccess(page.websiteId, "EDITOR");

  if (page.slug === "/") {
    throw new Error("Page is already the homepage.");
  }

  const currentHomepage = await prisma.page.findFirst({
    where: { websiteId: page.websiteId, slug: "/", deletedAt: null },
  });

  // Use a transaction to swap slugs safely
  await prisma.$transaction(async (tx) => {
    if (currentHomepage) {
      await tx.page.update({
        where: { id: currentHomepage.id },
        data: { slug: `/old-home-${Date.now()}` },
      });
    }

    await tx.page.update({
      where: { id: pageId },
      data: { slug: "/" },
    });
  });

  revalidatePath(`/dashboard/websites/${page.websiteId}/pages`);
  return { success: true };
}

export async function reorderPage(pageId: string, direction: "up" | "down") {
  const page = await prisma.page.findUnique({ where: { id: pageId } });
  if (!page) throw new Error("Page not found");
  await ensureWebsiteAccess(page.websiteId, "EDITOR");

  const siblingWhere = {
    websiteId: page.websiteId,
    parentId: page.parentId,
    deletedAt: null,
  };

  const adjacentPage = await prisma.page.findFirst({
    where: {
      ...siblingWhere,
      order: direction === "up" ? { lt: page.order } : { gt: page.order },
    },
    orderBy: {
      order: direction === "up" ? "desc" : "asc",
    },
  });

  if (!adjacentPage) {
    return { success: false, message: "Cannot move further." };
  }

  // Swap orders
  await prisma.$transaction([
    prisma.page.update({
      where: { id: page.id },
      data: { order: adjacentPage.order },
    }),
    prisma.page.update({
      where: { id: adjacentPage.id },
      data: { order: page.order },
    }),
  ]);

  revalidatePath(`/dashboard/websites/${page.websiteId}/pages`);
  return { success: true };
}
