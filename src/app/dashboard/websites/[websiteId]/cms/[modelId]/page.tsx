import { prisma } from "@/shared/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { EntryList } from "@/core/cms/components/EntryList";

export default async function CmsModelDashboard({ params }: { params: Promise<{ websiteId: string, modelId: string }> }) {
  const resolvedParams = await params;
  
  const model = await prisma.cmsModel.findUnique({
    where: { id: resolvedParams.modelId },
  });

  if (!model || model.websiteId !== resolvedParams.websiteId) {
    notFound();
  }

  const entries = await prisma.cmsEntry.findMany({
    where: { modelId: model.id },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-6 max-w-6xl pb-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dashboard/websites/${resolvedParams.websiteId}/cms`}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{model.name}</h2>
          <p className="text-muted-foreground">
            Manage entries for this collection.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <EntryList model={model} entries={entries} />
      </div>
    </div>
  );
}
