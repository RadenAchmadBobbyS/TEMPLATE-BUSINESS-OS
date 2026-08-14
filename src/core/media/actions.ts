"use server";

import { prisma } from "@/shared/lib/prisma";
import { auth } from "@/core/auth/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { generateUploadUrl, deleteStorageObject } from "./storage";

import { requireActiveWorkspace, requireActiveWorkspaceAction, canPerformDestructiveAction, hasWorkspacePermission } from "@/core/workspaces/server-context";

async function ensureWorkspaceAccess(actionType: "read" | "write" | "create_delete" | "delete" = "write") {
  const active = await requireActiveWorkspaceAction();
  if (!active.success) return { success: false, error: active.error };
  const { workspace, role, canCreateDelete } = active;

  if (actionType === "delete" || actionType === "create_delete") {
    if (!canPerformDestructiveAction(role, canCreateDelete)) {
      return { allowed: false, error: "Unauthorized to perform this destructive action", workspaceId: null };
    }
  } else if (actionType === "write") {
    if (!hasWorkspacePermission(role, "EDITOR")) {
      return { allowed: false, error: "Unauthorized to perform this action", workspaceId: null };
    }
  }
  
  return { allowed: true, workspaceId: workspace.id, error: null };
}

export async function createFolder(name: string, parentId?: string | null) {
  try {
    const access = await ensureWorkspaceAccess("create_delete");
    if (!access.allowed) return { success: false, error: access.error };

    const folder = await prisma.folder.create({
      data: {
        name,
        workspaceId: access.workspaceId!,
        parentId: parentId || null,
      },
    });

    revalidatePath("/dashboard/media");
    return { success: true, folder };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteFolder(id: string) {
  try {
    const access = await ensureWorkspaceAccess("delete");
    if (!access.allowed) return { success: false, error: access.error };

    await prisma.folder.delete({
      where: { id, workspaceId: access.workspaceId! },
    });

    revalidatePath("/dashboard/media");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "application/pdf"
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function getUploadUrl(
  filename: string,
  mimeType: string,
  sizeBytes: number
) {
  try {
    const access = await ensureWorkspaceAccess("write");
    if (!access.allowed) return { success: false, error: access.error };

    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      return { success: false, error: `Unsupported file type: ${mimeType}` };
    }

    if (sizeBytes > MAX_FILE_SIZE) {
      return { success: false, error: "File size exceeds 10MB limit" };
    }

    const safeName = filename.replace(/[^a-zA-Z0-9.\-_]/g, "").substring(0, 50);
    const s3Key = `workspaces/${access.workspaceId}/${Date.now()}-${safeName}`;

    const { uploadUrl, publicUrl } = await generateUploadUrl(s3Key, mimeType);

    return { success: true, uploadUrl, s3Key, publicUrl };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function finalizeUpload(data: {
  folderId: string | null;
  name: string;
  url: string;
  type: "IMAGE" | "DOCUMENT";
  sizeBytes: number;
  s3Key: string;
  fileHash: string;
  metadata?: any;
}) {
  try {
    const access = await ensureWorkspaceAccess("write");
    if (!access.allowed) return { success: false, error: access.error };

    const asset = await prisma.asset.create({
      data: {
        workspaceId: access.workspaceId!,
        folderId: data.folderId || null,
        name: data.name,
        url: data.url,
        type: data.type,
        sizeBytes: data.sizeBytes,
        s3Key: data.s3Key,
        fileHash: data.fileHash,
        metadata: data.metadata || {},
      },
    });

    revalidatePath("/dashboard/media");
    return { success: true, asset };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateAssetSettings(id: string, data: { name?: string, metadata?: any }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return { success: false, error: 'Unauthorized' };

    const active = await requireActiveWorkspaceAction();
  if (!active.success) return { success: false, error: active.error };
  const { workspace, role } = active;

    if (!hasWorkspacePermission(role, 'EDITOR')) {
      return { success: false, error: 'Unauthorized. Editor role required.' };
    }

    const existing = await prisma.asset.findFirst({
      where: { id, workspaceId: workspace.id },
    });
    if (!existing) return { success: false, error: 'Asset not found' };

  const asset = await prisma.asset.update({
    where: { id },
    data: {
      name: data.name !== undefined ? data.name : existing.name,
      metadata: data.metadata !== undefined ? data.metadata : existing.metadata,
    },
  });

    revalidatePath("/dashboard/media");
    return { success: true, asset };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function toggleFavoriteAsset(id: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return { success: false, error: 'Unauthorized' };

    const access = await ensureWorkspaceAccess("write");
    if (!access.allowed) return { success: false, error: access.error };

    const existing = await prisma.asset.findFirst({
      where: { id, workspaceId: access.workspaceId! },
    });

    if (!existing) return { success: false, error: "Asset not found" };

    const favorite = await prisma.userAssetFavorite.findUnique({
      where: {
        userId_assetId: {
          userId: session.user.id,
          assetId: id,
        }
      }
    });

    if (favorite) {
      await prisma.userAssetFavorite.delete({
        where: {
          userId_assetId: {
            userId: session.user.id,
            assetId: id,
          }
        }
      });
    } else {
      await prisma.userAssetFavorite.create({
        data: {
          userId: session.user.id,
          assetId: id,
        }
      });
    }

    revalidatePath("/dashboard/media");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function replaceAsset(id: string, formData: FormData) {
  try {
    const access = await ensureWorkspaceAccess("write");
    if (!access.allowed) return { success: false, error: access.error };
    const file = formData.get("file") as File;

    if (!file) return { success: false, error: "No file provided" };

    const existing = await prisma.asset.findFirst({
      where: { id, workspaceId: access.workspaceId! },
    });

    if (!existing) return { success: false, error: "Asset not found" };

    const newMockUrl = "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1000&auto=format&fit=crop";

    const asset = await prisma.asset.update({
      where: { id },
      data: {
        url: newMockUrl,
        sizeBytes: file.size,
        s3Key: `new-mock-s3-key-${Date.now()}`,
        fileHash: `new-mock-hash-${Date.now()}`,
      },
    });

    revalidatePath("/dashboard/media");
    return { success: true, asset };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteAsset(id: string) {
  try {
    const access = await ensureWorkspaceAccess("delete");
    if (!access.allowed) return { success: false, error: access.error };

    const existing = await prisma.asset.findFirst({
      where: { id, workspaceId: access.workspaceId! },
    });

    if (!existing) return { success: false, error: "Asset not found" };

    await deleteStorageObject(existing.s3Key);

    await prisma.asset.delete({
      where: { id },
    });

    revalidatePath("/dashboard/media");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
