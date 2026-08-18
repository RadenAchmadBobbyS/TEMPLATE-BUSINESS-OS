"use server";

import { prisma } from "@/shared/lib/prisma";
import { auth } from "@/core/auth/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { themeConfigSchema, ValidatedThemeConfig } from "./schemas";
import { requireActiveWorkspace, requireActiveWorkspaceAction, checkWorkspacePermission } from "@/core/workspaces/server-context";
import { defaultTheme } from "./store";

async function checkWebsiteAccess(websiteId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { success: false, error: "Unauthorized" };

  const active = await requireActiveWorkspaceAction();
  if (!active.success) return { success: false, error: active.error };
  const { workspace, role } = active;
  try {
    checkWorkspacePermission(role, "EDITOR");
  } catch (e: any) {
    return { success: false, error: e.message };
  }

  const website = await prisma.website.findFirst({
    where: { id: websiteId, workspaceId: workspace.id },
  });

  if (!website) return { success: false, error: "Website not found or unauthorized" };

  return { success: true, website };
}

export async function getWebsiteTheme(websiteId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const active = await requireActiveWorkspaceAction();
  if (!active.success) throw new Error(active.error);
  const { workspace, role } = active;
  checkWorkspacePermission(role, "EDITOR");

  const website = await prisma.website.findFirst({
    where: { id: websiteId, workspaceId: workspace.id },
    include: { theme: true }
  });

  if (!website) throw new Error("Website not found or unauthorized");

  if (website.theme && website.theme.variables) {
    try {
      // Safely parse and validate the stored theme just in case
      return themeConfigSchema.parse(website.theme.variables) as ValidatedThemeConfig;
    } catch {
      return defaultTheme;
    }
  }

  return defaultTheme;
}

export async function updateWebsiteTheme(websiteId: string, data: ValidatedThemeConfig) {
  const access = await checkWebsiteAccess(websiteId);
  if (!access.success) return { success: false, error: access.error };

  const validatedConfig = themeConfigSchema.parse(data);

  const updatedTheme = await prisma.theme.upsert({
    where: { websiteId },
    update: { variables: validatedConfig },
    create: {
      websiteId,
      variables: validatedConfig,
    }
  });

  revalidatePath(`/dashboard/websites/${websiteId}/theme`);
  revalidatePath(`/websites/${websiteId}`); // Invalidation for future rendered pages
  
  return { success: true, updatedTheme };
}

export async function resetWebsiteTheme(websiteId: string) {
  const access = await checkWebsiteAccess(websiteId);
  if (!access.success) return { success: false, error: access.error };
  
  const website = await prisma.website.findFirst({
    where: { id: websiteId, workspaceId: access.website!.workspaceId },
    include: { theme: true }
  });

  if (!website) {
    return { success: false, error: "Website not found" };
  }

  if (website.theme) {
    await prisma.theme.delete({
      where: { websiteId },
    });
  }

  revalidatePath(`/dashboard/websites/${websiteId}/theme`);
  revalidatePath(`/websites/${websiteId}`);
  
  return { success: true };
}
