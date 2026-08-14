"use server";

import { prisma } from "@/shared/lib/prisma";
import { auth } from "@/core/auth/auth";
import { headers } from "next/headers";

import { getActiveWorkspace } from "@/core/workspaces/server-context";

async function getWorkspaceId() {
  const active = await getActiveWorkspace();
  if (!active) return null;
  return active.workspace.id;
}

export async function getFolders(parentId?: string | null) {
  const workspaceId = await getWorkspaceId();
  if (!workspaceId) return [];

  return prisma.folder.findMany({
    where: {
      workspaceId,
      parentId: parentId || null,
    },
    orderBy: { name: "asc" },
  });
}

export async function getAssets(folderId?: string | null, search?: string, isFavorite?: boolean) {
  const workspaceId = await getWorkspaceId();
  if (!workspaceId) return [];

  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;

  const assets = await prisma.asset.findMany({
    where: {
      workspaceId,
      ...(folderId !== undefined ? { folderId: folderId || null } : {}),
      ...(isFavorite !== undefined && userId ? {
        favoritedBy: isFavorite ? { some: { userId } } : { none: { userId } }
      } : {}),
      ...(search ? {
        OR: [
          { url: { contains: search, mode: "insensitive" } },
          { name: { contains: search, mode: "insensitive" } }
        ]
      } : {}),
    },
    include: {
      favoritedBy: userId ? {
        where: { userId }
      } : false
    },
    orderBy: { createdAt: "desc" },
  });

  return assets.map((asset: any) => {
    const isFav = asset.favoritedBy && asset.favoritedBy.length > 0;
    const { favoritedBy, ...rest } = asset;
    return { ...rest, isFavorite: isFav };
  });
}

export async function getFolderPath(folderId: string) {
  // Simple breadcrumb logic. In production, a recursive CTE is better.
  let currentId: string | null = folderId;
  const path = [];

  while (currentId) {
    const folder: any = await prisma.folder.findUnique({
      where: { id: currentId },
    });
    if (!folder) break;
    
    path.unshift(folder);
    currentId = folder.parentId;
  }

  return path;
}
