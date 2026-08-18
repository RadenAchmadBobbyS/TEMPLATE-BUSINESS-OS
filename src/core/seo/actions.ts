"use server";

import { prisma } from "@/shared/lib/prisma";
import { auth } from "@/core/auth/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

async function checkWebsiteAccess(websiteId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { success: false, error: "Unauthorized" };

  const role = await prisma.userRole.findFirst({
    where: { userId: session.user.id },
  });
  if (!role) return { success: false, error: "Workspace access denied" };

  const website = await prisma.website.findFirst({
    where: { id: websiteId, workspaceId: role.workspaceId }
  });
  if (!website) return { success: false, error: "Website not found" };

  return { success: true, website };
}

async function ensureWebsiteAccess(websiteId: string) {
  const access = await checkWebsiteAccess(websiteId);
  if (!access.success) throw new Error(access.error);
  return access.website!;
}

// =====================================
// PAGE SEO METADATA
// =====================================

export async function updatePageSeo(pageId: string, websiteId: string, seoMetadata: any) {
  const access = await checkWebsiteAccess(websiteId);
  if (!access.success) return { success: false, error: access.error };

  const updated = await prisma.page.update({
    where: { id: pageId, websiteId },
    data: { seoMetadata }
  });

  revalidatePath(`/dashboard/websites/${websiteId}/pages/${pageId}/seo`);
  return { success: true, updated };
}

// =====================================
// REDIRECTS MANAGEMENT
// =====================================

export async function createRedirect(websiteId: string, source: string, destination: string, permanent: boolean = true) {
  const access = await checkWebsiteAccess(websiteId);
  if (!access.success) return { success: false, error: access.error };

  // Simple validation
  if (!source.startsWith("/")) source = "/" + source;

  if (source === destination) {
    return { success: false, error: "Source and destination cannot be the same." };
  }

  // Prevent loops
  const inverted = await prisma.redirect.findFirst({
    where: { websiteId, source: destination, destination: source }
  });
  if (inverted) {
    return { success: false, error: "This redirect would cause an infinite loop with an existing rule." };
  }

  // Prevent duplicates
  const existing = await prisma.redirect.findFirst({
    where: { websiteId, source }
  });
  if (existing) {
    return { success: false, error: "A redirect for this source already exists." };
  }

  const redirect = await prisma.redirect.create({
    data: {
      websiteId,
      source,
      destination,
      permanent,
      active: true
    }
  });

  revalidatePath(`/dashboard/websites/${websiteId}/redirects`);
  return { success: true, redirect };
}

export async function updateRedirect(redirectId: string, websiteId: string, data: { source?: string; destination?: string; permanent?: boolean; active?: boolean }) {
  const access = await checkWebsiteAccess(websiteId);
  if (!access.success) return { success: false, error: access.error };

  const existingRedirect = await prisma.redirect.findUnique({
    where: { id: redirectId, websiteId }
  });
  
  if (!existingRedirect) return { success: false, error: "Redirect not found." };

  const newSource = data.source !== undefined ? (data.source.startsWith("/") ? data.source : "/" + data.source) : existingRedirect.source;
  const newDestination = data.destination !== undefined ? data.destination : existingRedirect.destination;

  if (newSource === newDestination) {
    return { success: false, error: "Source and destination cannot be the same." };
  }

  // Check loops if changing paths
  if (newSource !== existingRedirect.source || newDestination !== existingRedirect.destination) {
    const inverted = await prisma.redirect.findFirst({
      where: { websiteId, source: newDestination, destination: newSource }
    });
    if (inverted) {
      return { success: false, error: "This redirect would cause an infinite loop with an existing rule." };
    }

    const existing = await prisma.redirect.findFirst({
      where: { websiteId, source: newSource, id: { not: redirectId } }
    });
    if (existing) {
      return { success: false, error: "A redirect for this source already exists." };
    }
  }

  const redirect = await prisma.redirect.update({
    where: { id: redirectId, websiteId },
    data: {
      source: newSource,
      destination: newDestination,
      permanent: data.permanent !== undefined ? data.permanent : existingRedirect.permanent,
      active: data.active !== undefined ? data.active : existingRedirect.active
    }
  });

  revalidatePath(`/dashboard/websites/${websiteId}/redirects`);
  return { success: true, redirect };
}

export async function deleteRedirect(redirectId: string, websiteId: string) {
  const access = await checkWebsiteAccess(websiteId);
  if (!access.success) return { success: false, error: access.error };

  await prisma.redirect.delete({
    where: { id: redirectId, websiteId }
  });

  revalidatePath(`/dashboard/websites/${websiteId}/redirects`);
  return { success: true };
}

export async function getRedirects(websiteId: string) {
  await ensureWebsiteAccess(websiteId);

  return prisma.redirect.findMany({
    where: { websiteId },
    orderBy: { createdAt: "desc" }
  });
}
