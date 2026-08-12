"use server";

import { prisma } from "@/shared/lib/prisma";
import { auth } from "@/core/auth/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { generateUploadUrl, deleteStorageObject } from "./storage";

async function ensureWorkspaceAccess(actionType: "read" | "write" = "write") {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const role = await prisma.userRole.findFirst({
    where: { userId: session.user.id },
  });

  if (!role) throw new Error("No workspace found");
  
  if (actionType === "write" && !["OWNER", "ADMIN", "EDITOR"].includes(role.role)) {
    throw new Error("Unauthorized to perform this action");
  }

  return role.workspaceId;
}

export async function createFolder(name: string, parentId?: string | null) {
  const workspaceId = await ensureWorkspaceAccess("write");

  const folder = await prisma.folder.create({
    data: {
      name,
      workspaceId,
      parentId: parentId || null,
    },
  });

  revalidatePath("/dashboard/media");
  return folder;
}

export async function deleteFolder(id: string) {
  const workspaceId = await ensureWorkspaceAccess("write");

  // Will cascade delete assets inside it based on DB constraints (if we set it, currently SetNull on asset folderId, wait our schema says SetNull. So assets move to root).
  await prisma.folder.delete({
    where: { id, workspaceId },
  });

  revalidatePath("/dashboard/media");
  return { success: true };
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
  const workspaceId = await ensureWorkspaceAccess("write");

  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    throw new Error(`Unsupported file type: ${mimeType}`);
  }

  if (sizeBytes > MAX_FILE_SIZE) {
    throw new Error("File size exceeds 10MB limit");
  }

  // Create deterministic, unique key: workspaceId/timestamp-filename
  // Simple sanitize
  const safeName = filename.replace(/[^a-zA-Z0-9.\-_]/g, "").substring(0, 50);
  const s3Key = `workspaces/${workspaceId}/${Date.now()}-${safeName}`;

  const { uploadUrl, publicUrl } = await generateUploadUrl(s3Key, mimeType);

  return { uploadUrl, s3Key, publicUrl };
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
  const workspaceId = await ensureWorkspaceAccess("write");

  const asset = await prisma.asset.create({
    data: {
      workspaceId,
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
  return asset;
}

export async function updateAssetSettings(id: string, data: { name?: string, isFavorite?: boolean, metadata?: any }) {
  const workspaceId = await ensureWorkspaceAccess("write");

  const existing = await prisma.asset.findFirst({
    where: { id, workspaceId },
  });

  if (!existing) throw new Error("Asset not found");

  const asset = await prisma.asset.update({
    where: { id },
    data: {
      name: data.name !== undefined ? data.name : existing.name,
      isFavorite: data.isFavorite !== undefined ? data.isFavorite : existing.isFavorite,
      metadata: data.metadata !== undefined ? data.metadata : existing.metadata,
    },
  });

  revalidatePath("/dashboard/media");
  return asset;
}

export async function replaceAsset(id: string, formData: FormData) {
  const workspaceId = await ensureWorkspaceAccess("write");
  const file = formData.get("file") as File;

  if (!file) throw new Error("No file provided");

  const existing = await prisma.asset.findFirst({
    where: { id, workspaceId },
  });

  if (!existing) throw new Error("Asset not found");

  // MOCK: Delete old file from S3, upload new file.
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
  return asset;
}

export async function deleteAsset(id: string) {
  const workspaceId = await ensureWorkspaceAccess("write");

  const existing = await prisma.asset.findFirst({
    where: { id, workspaceId },
  });

  if (!existing) throw new Error("Asset not found");

  // Actually delete from storage
  await deleteStorageObject(existing.s3Key);

  await prisma.asset.delete({
    where: { id },
  });

  revalidatePath("/dashboard/media");
  return { success: true };
}
