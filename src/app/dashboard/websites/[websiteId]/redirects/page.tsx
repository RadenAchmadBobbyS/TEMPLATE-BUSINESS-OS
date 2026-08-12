import { prisma } from "@/shared/lib/prisma";
import { getWebsiteById } from "@/core/websites/actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/shared/ui/button";

import { getRedirects } from "@/core/seo/actions";
import { RedirectsManager } from "@/core/seo/components/RedirectsManager";

export default async function RedirectsPage({ params }: { params: Promise<{ websiteId: string }> }) {
  const resolvedParams = await params;
  const websiteId = resolvedParams.websiteId;
  
  let website;
  try {
    website = await getWebsiteById(websiteId);
  } catch (e) {
    notFound();
  }

  const redirects = await getRedirects(websiteId);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/websites">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-xl font-bold tracking-tight">URL Redirects</h2>
          <p className="text-sm text-muted-foreground">Manage 301 and 302 rules for {website.name}</p>
        </div>
      </div>

      <RedirectsManager websiteId={websiteId} initialRedirects={redirects} />
    </div>
  );
}
