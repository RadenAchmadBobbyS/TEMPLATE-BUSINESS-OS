"use server";

import { prisma } from "@/shared/lib/prisma";
import { auth } from "@/core/auth/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { createFormSchema, submitFormSchema } from "./schemas";

async function ensureWebsiteAccess(websiteId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const role = await prisma.userRole.findFirst({
    where: { userId: session.user.id },
  });
  if (!role) throw new Error("Workspace access denied");

  const website = await prisma.website.findFirst({
    where: { id: websiteId, workspaceId: role.workspaceId },
  });
  if (!website) throw new Error("Website not found");

  return website;
}

export async function getForms(websiteId: string) {
  await ensureWebsiteAccess(websiteId);
  return prisma.form.findMany({
    where: { websiteId },
    include: {
      _count: {
        select: { submissions: true }
      }
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createForm(websiteId: string, data: any) {
  await ensureWebsiteAccess(websiteId);
  const parsed = createFormSchema.parse(data);

  const form = await prisma.form.create({
    data: {
      websiteId,
      name: parsed.name,
      fields: parsed.fields as any,
      settings: parsed.settings as any,
    },
  });

  revalidatePath(`/dashboard/websites/${websiteId}/forms`);
  return form;
}

export async function deleteForm(formId: string) {
  const form = await prisma.form.findUnique({ where: { id: formId } });
  if (!form) throw new Error("Form not found");
  await ensureWebsiteAccess(form.websiteId);

  await prisma.form.delete({ where: { id: formId } });
  revalidatePath(`/dashboard/websites/${form.websiteId}/forms`);
  return { success: true };
}

export async function getFormSubmissions(formId: string) {
  const form = await prisma.form.findUnique({ where: { id: formId } });
  if (!form) throw new Error("Form not found");
  await ensureWebsiteAccess(form.websiteId);

  return prisma.formSubmission.findMany({
    where: { formId },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Public endpoint mock for submitting a form.
 * In a real app, this would be an API route without `ensureWebsiteAccess`.
 */
export async function submitForm(data: any) {
  const parsed = submitFormSchema.parse(data);
  
  const form = await prisma.form.findUnique({ where: { id: parsed.formId } });
  if (!form) throw new Error("Form not found");

  // In a real implementation:
  // 1. Validate `parsed.data` against `form.fields` schema
  // 2. Process File uploads if any
  // 3. Verify CAPTCHA if `form.settings.captchaEnabled`
  // 4. Send Emails to `form.settings.notificationEmails`

  const submission = await prisma.formSubmission.create({
    data: {
      formId: form.id,
      data: parsed.data as any,
    },
  });

  revalidatePath(`/dashboard/websites/${form.websiteId}/forms/${form.id}`);
  
  // Return the success page URL if configured
  return { 
    success: true, 
    submissionId: submission.id,
    redirectUrl: (form.settings as any)?.successPageUrl || null 
  };
}
