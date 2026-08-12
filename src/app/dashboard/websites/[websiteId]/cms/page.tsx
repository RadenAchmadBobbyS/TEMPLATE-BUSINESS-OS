import { prisma } from "@/shared/lib/prisma";
import { getWebsiteById } from "@/core/websites/actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { ModelBuilder } from "@/core/cms/components/ModelBuilder";

export default async function CmsDashboard({ params }: { params: Promise<{ websiteId: string }> }) {
  const resolvedParams = await params;
  
  let website;
  try {
    website = await getWebsiteById(resolvedParams.websiteId);
  } catch (e) {
    notFound();
  }

  const models = await prisma.cmsModel.findMany({
    where: { websiteId: resolvedParams.websiteId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 max-w-6xl pb-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/websites">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Headless CMS Engine</h2>
          <p className="text-muted-foreground">
            Define dynamic data schemas (Blogs, Products, etc.) and manage content for {website.name}.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <ModelBuilder websiteId={resolvedParams.websiteId} models={models} />
      </div>
    </div>
  );
}
