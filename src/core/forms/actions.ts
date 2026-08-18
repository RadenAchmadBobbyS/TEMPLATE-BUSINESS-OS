"use server";

import { prisma } from "@/shared/lib/prisma";
import { auth } from "@/core/auth/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { createFormSchema, submitFormSchema } from "./schemas";
import { sendTransactionalEmail } from "@/core/notifications/email";

async function checkWebsiteAccess(websiteId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { success: false, error: "Unauthorized" };

  const role = await prisma.userRole.findFirst({
    where: { userId: session.user.id },
  });
  if (!role) return { success: false, error: "Workspace access denied" };

  const website = await prisma.website.findFirst({
    where: { id: websiteId, workspaceId: role.workspaceId },
  });
  if (!website) return { success: false, error: "Website not found" };

  return { success: true, website };
}

async function ensureWebsiteAccess(websiteId: string) {
  const access = await checkWebsiteAccess(websiteId);
  if (!access.success) throw new Error(access.error);
  return access.website!;
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
  const access = await checkWebsiteAccess(websiteId);
  if (!access.success) return { success: false, error: access.error };
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
  return { success: true, form };
}

export async function deleteForm(formId: string) {
  const form = await prisma.form.findUnique({ where: { id: formId } });
  if (!form) return { success: false, error: "Form not found" };
  const access = await checkWebsiteAccess(form.websiteId);
  if (!access.success) return { success: false, error: access.error };

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
  if (!form) return { success: false, error: "Form not found" };

  // 1. Optional fields validation (basic length limits or required checks could go here based on form.fields, but we'll accept parsed.data for now)

  const submission = await prisma.formSubmission.create({
    data: {
      formId: form.id,
      data: parsed.data as any,
    },
  });

  const settings = form.settings as any;
  if (settings?.notificationEmails && Array.isArray(settings.notificationEmails) && settings.notificationEmails.length > 0) {
    try {
      const emailContent = Object.entries(parsed.data as Record<string, any>)
        .map(([key, value]) => `<strong>${key}:</strong> ${value}`)
        .join("<br/>");

      await Promise.all(settings.notificationEmails.map(async (email: string) => {
        await sendTransactionalEmail({
          to: email,
          subject: `New Form Submission: ${form.name}`,
          html: `<p>You have a new submission for the form <strong>${form.name}</strong>.</p><br/>${emailContent}`,
        });
      }));
    } catch (e) {
      console.error("Failed to send form notification emails", e);
    }
  }

  revalidatePath(`/dashboard/websites/${form.websiteId}/forms/${form.id}`);
  
  // Return the success page URL if configured
  return { 
    success: true, 
    submissionId: submission.id,
    redirectUrl: settings?.successPageUrl || null 
  };
}
