import { prisma } from "@/shared/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/shared/ui/button";

import { SeoManager } from "@/core/seo/components/SeoManager";

export default async function PageSeoRoute({ params }: { params: Promise<{ websiteId: string, pageId: string }> }) {
  const resolvedParams = await params;
  
  const page = await prisma.page.findUnique({
    where: { id: resolvedParams.pageId, websiteId: resolvedParams.websiteId },
  });

  if (!page) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dashboard/websites/${resolvedParams.websiteId}/pages`}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-xl font-bold tracking-tight">SEO Metadata</h2>
          <p className="text-sm text-muted-foreground">Optimizing: {page.title}</p>
        </div>
      </div>

      <SeoManager websiteId={resolvedParams.websiteId} page={page} />
    </div>
  );
}
