"use server";

import { prisma } from "@/shared/lib/prisma";
import { auth } from "@/core/auth/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { websiteSettingsSchema, MenuItemInput } from "@/core/websites/schemas";
import { requireActiveWorkspace, checkWorkspacePermission } from "@/core/workspaces/server-context";

export async function saveNavigation(websiteId: string, navigationData: { navbar: MenuItemInput[], footer: MenuItemInput[] }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const { workspace, role } = await requireActiveWorkspace();
  checkWorkspacePermission(role, "EDITOR");

  const website = await prisma.website.findFirst({
    where: { id: websiteId, workspaceId: workspace.id },
  });

  if (!website) throw new Error("Website not found or unauthorized");

  // Validate the navigation tree
  const parsedNav = websiteSettingsSchema.shape.navigation.parse(navigationData);

  // Extract all pageIds from the tree
  const extractedPageIds = new Set<string>();

  const extractIdsAndValidate = (items: MenuItemInput[]) => {
    for (const item of items) {
      if (item.type === "page") {
        if (!item.pageId) throw new Error("A page link must have a selected page.");
        extractedPageIds.add(item.pageId);
      }
      if (item.type === "external") {
        if (!item.target || (!item.target.startsWith("http://") && !item.target.startsWith("https://"))) {
          throw new Error("External links must start with http:// or https://");
        }
      }
      if (item.children) {
        extractIdsAndValidate(item.children);
      }
    }
  };

  extractIdsAndValidate(parsedNav?.navbar || []);
  extractIdsAndValidate(parsedNav?.footer || []);

  // Verify all pageIds belong to the current website
  if (extractedPageIds.size > 0) {
    const validPages = await prisma.page.findMany({
      where: {
        id: { in: Array.from(extractedPageIds) },
        websiteId: website.id,
      },
      select: { id: true },
    });

    if (validPages.length !== extractedPageIds.size) {
      throw new Error("One or more pages selected do not belong to this website.");
    }
  }

  // Update website settings
  const currentSettings = (website.settings as Record<string, any>) || {};
  
  const updatedSettings = {
    ...currentSettings,
    navigation: parsedNav,
  };

  await prisma.website.update({
    where: { id: websiteId },
    data: { settings: updatedSettings },
  });

  revalidatePath(`/dashboard/websites/${websiteId}/navigation`);
  revalidatePath("/dashboard/websites");
  
  return { success: true };
}
