import { notFound } from "next/navigation";
import { prisma } from "@/shared/lib/prisma";
import { getActiveWorkspace } from "@/core/workspaces/server-context";
import { getWorkspacePlan } from "@/core/billing/entitlements";
import { TemplatePreviewClient } from "./client";

export default async function TemplatePreviewPage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const { templateId } = await params;

  const template = await prisma.template.findUnique({
    where: { id: templateId },
    include: {
      category: true,
      industry: true,
    },
  });

  if (!template) {
    notFound();
  }

  const active = await getActiveWorkspace();
  let userTier = "FREE";
  if (active) {
    const plan = await getWorkspacePlan(active.workspace.id);
    userTier = plan.tier;
  }

  return (
    <TemplatePreviewClient
      template={template as any}
      userTier={userTier}
    />
  );
}
