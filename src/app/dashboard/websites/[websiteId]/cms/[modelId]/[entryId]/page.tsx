import { prisma } from "@/shared/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { DynamicForm } from "@/core/cms/components/DynamicForm";

export default async function CmsEntryEditor({ params }: { params: Promise<{ websiteId: string, modelId: string, entryId: string }> }) {
  const resolvedParams = await params;
  
  const entry = await prisma.cmsEntry.findUnique({
    where: { id: resolvedParams.entryId },
    include: { model: true },
  });

  if (!entry || entry.model.websiteId !== resolvedParams.websiteId) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-6xl pb-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dashboard/websites/${resolvedParams.websiteId}/cms/${resolvedParams.modelId}`}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Edit Entry</h2>
          <p className="text-muted-foreground">
            Editing {entry.model.name} entry.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <DynamicForm model={entry.model} entry={entry} />
      </div>
    </div>
  );
}
