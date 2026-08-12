import { prisma } from "@/shared/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { SubmissionTable } from "@/core/forms/components/SubmissionTable";

export default async function FormSubmissionsDashboard({ params }: { params: Promise<{ websiteId: string, formId: string }> }) {
  const resolvedParams = await params;
  
  const form = await prisma.form.findUnique({
    where: { id: resolvedParams.formId },
  });

  if (!form || form.websiteId !== resolvedParams.websiteId) {
    notFound();
  }

  const submissions = await prisma.formSubmission.findMany({
    where: { formId: form.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 max-w-7xl pb-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dashboard/websites/${resolvedParams.websiteId}/forms`}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{form.name}</h2>
          <p className="text-muted-foreground">
            Review incoming submissions and export data.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <SubmissionTable form={form} submissions={submissions} />
      </div>
    </div>
  );
}
