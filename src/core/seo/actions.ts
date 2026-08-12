"use server";

import { prisma } from "@/shared/lib/prisma";
import { auth } from "@/core/auth/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

async function ensureWebsiteAccess(websiteId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const role = await prisma.userRole.findFirst({
    where: { userId: session.user.id },
  });
  if (!role) throw new Error("Workspace access denied");

  const website = await prisma.website.findFirst({
    where: { id: websiteId, workspaceId: role.workspaceId }
  });
  if (!website) throw new Error("Website not found");

  return website;
}

// =====================================
// PAGE SEO METADATA
// =====================================

export async function updatePageSeo(pageId: string, websiteId: string, seoMetadata: any) {
  await ensureWebsiteAccess(websiteId);

  const updated = await prisma.page.update({
    where: { id: pageId, websiteId },
    data: { seoMetadata }
  });

  revalidatePath(`/dashboard/websites/${websiteId}/pages/${pageId}/seo`);
  return updated;
}

// =====================================
// REDIRECTS MANAGEMENT
// =====================================

export async function createRedirect(websiteId: string, source: string, destination: string, permanent: boolean = true) {
  await ensureWebsiteAccess(websiteId);

  // Simple validation
  if (!source.startsWith("/")) source = "/" + source;

  const redirect = await prisma.redirect.create({
    data: {
      websiteId,
      source,
      destination,
      permanent
    }
  });

  revalidatePath(`/dashboard/websites/${websiteId}/redirects`);
  return redirect;
}

export async function deleteRedirect(redirectId: string, websiteId: string) {
  await ensureWebsiteAccess(websiteId);

  await prisma.redirect.delete({
    where: { id: redirectId, websiteId }
  });

  revalidatePath(`/dashboard/websites/${websiteId}/redirects`);
  return true;
}

export async function getRedirects(websiteId: string) {
  await ensureWebsiteAccess(websiteId);

  return prisma.redirect.findMany({
    where: { websiteId },
    orderBy: { createdAt: "desc" }
  });
}
