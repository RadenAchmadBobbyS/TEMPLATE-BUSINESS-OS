"use server";

import { prisma } from "@/shared/lib/prisma";
import { auth } from "@/core/auth/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { createModelSchema, updateEntrySchema } from "./schemas";
import { CmsEntryStatus } from "@prisma/client";

async function ensureWebsiteAccess(websiteId: string, actionType: "read" | "write" = "read") {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const role = await prisma.userRole.findFirst({
    where: { userId: session.user.id },
  });
  if (!role) throw new Error("Workspace access denied");

  if (actionType === "write" && !["OWNER", "ADMIN", "EDITOR"].includes(role.role)) {
    throw new Error("Unauthorized to perform this action");
  }

  const website = await prisma.website.findFirst({
    where: { id: websiteId, workspaceId: role.workspaceId },
  });
  if (!website) throw new Error("Website not found");

  return website;
}

// =====================================
// MODELS (COLLECTIONS)
// =====================================

export async function getCmsModels(websiteId: string) {
  await ensureWebsiteAccess(websiteId);
  return prisma.cmsModel.findMany({
    where: { websiteId },
    orderBy: { createdAt: "asc" },
  });
}

export async function createCmsModel(websiteId: string, data: any) {
  await ensureWebsiteAccess(websiteId, "write");
  const parsed = createModelSchema.parse(data);

  const existing = await prisma.cmsModel.findFirst({
    where: { websiteId, name: parsed.name },
  });
  if (existing) throw new Error("A model with this name already exists.");

  const model = await prisma.cmsModel.create({
    data: {
      websiteId,
      name: parsed.name,
      schema: parsed.schema as any,
    },
  });

  revalidatePath(`/dashboard/websites/${websiteId}/cms`);
  return model;
}

export async function deleteCmsModel(modelId: string) {
  const model = await prisma.cmsModel.findUnique({ where: { id: modelId } });
  if (!model) throw new Error("Model not found");
  await ensureWebsiteAccess(model.websiteId, "write");

  await prisma.cmsModel.delete({ where: { id: modelId } });
  revalidatePath(`/dashboard/websites/${model.websiteId}/cms`);
  return { success: true };
}

// =====================================
// ENTRIES (CONTENT)
// =====================================

export async function getCmsEntries(modelId: string) {
  const model = await prisma.cmsModel.findUnique({ where: { id: modelId } });
  if (!model) throw new Error("Model not found");
  await ensureWebsiteAccess(model.websiteId);

  return prisma.cmsEntry.findMany({
    where: { modelId },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getCmsEntry(entryId: string) {
  const entry = await prisma.cmsEntry.findUnique({ 
    where: { id: entryId },
    include: { model: true }
  });
  if (!entry) throw new Error("Entry not found");
  await ensureWebsiteAccess(entry.model.websiteId);

  return entry;
}

export async function createCmsEntry(modelId: string, status: CmsEntryStatus = "DRAFT") {
  const model = await prisma.cmsModel.findUnique({ where: { id: modelId } });
  if (!model) throw new Error("Model not found");
  await ensureWebsiteAccess(model.websiteId, "write");

  // Initialize with empty data structure based on schema
  const schema = model.schema as any[];
  const initialData: Record<string, any> = {};
  schema.forEach(field => {
    initialData[field.id] = field.type === "boolean" ? false : "";
  });

  const entry = await prisma.cmsEntry.create({
    data: {
      modelId,
      status,
      data: initialData,
    },
  });

  revalidatePath(`/dashboard/websites/${model.websiteId}/cms/${modelId}`);
  return entry;
}

export async function updateCmsEntry(entryId: string, data: any) {
  const entry = await prisma.cmsEntry.findUnique({ include: { model: true }, where: { id: entryId } });
  if (!entry) throw new Error("Entry not found");
  await ensureWebsiteAccess(entry.model.websiteId, "write");

  const parsed = updateEntrySchema.parse(data);

  // Dynamic Validation against Schema
  const schema = entry.model.schema as any[];
  const validatedData: Record<string, any> = {};

  for (const field of schema) {
    const val = parsed.data[field.id];
    
    if (field.required && (val === undefined || val === null || val === "")) {
      throw new Error(`Validation Error: Field '${field.label}' is required.`);
    }

    if (val !== undefined && val !== null && val !== "") {
      // Basic type enforcement
      if (field.type === "number" && typeof val !== "number") {
        throw new Error(`Validation Error: Field '${field.label}' must be a number.`);
      }
      if (field.type === "boolean" && typeof val !== "boolean") {
        throw new Error(`Validation Error: Field '${field.label}' must be a boolean.`);
      }
    }
    
    validatedData[field.id] = val;
  }

  const updated = await prisma.cmsEntry.update({
    where: { id: entryId },
    data: {
      status: parsed.status as CmsEntryStatus,
      data: validatedData,
    },
  });

  revalidatePath(`/dashboard/websites/${entry.model.websiteId}/cms/${entry.modelId}`);
  revalidatePath(`/dashboard/websites/${entry.model.websiteId}/cms/${entry.modelId}/${entryId}`);
  return updated;
}

export async function deleteCmsEntry(entryId: string) {
  const entry = await prisma.cmsEntry.findUnique({ include: { model: true }, where: { id: entryId } });
  if (!entry) throw new Error("Entry not found");
  await ensureWebsiteAccess(entry.model.websiteId, "write");

  await prisma.cmsEntry.delete({ where: { id: entryId } });
  revalidatePath(`/dashboard/websites/${entry.model.websiteId}/cms/${entry.modelId}`);
  return { success: true };
}
