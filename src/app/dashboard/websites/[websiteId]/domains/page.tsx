import { prisma } from "@/shared/lib/prisma";
import { getWebsiteById } from "@/core/websites/actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { DomainManager } from "@/core/hosting/components/DomainManager";

export default async function DomainsPage({ params }: { params: Promise<{ websiteId: string }> }) {
  const resolvedParams = await params;
  
  let website;
  try {
    website = await getWebsiteById(resolvedParams.websiteId);
  } catch (e) {
    notFound();
  }

  const domains = await prisma.domain.findMany({
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
          <h2 className="text-3xl font-bold tracking-tight">Domain Management</h2>
          <p className="text-muted-foreground">
            Configure custom domains, subdomains, and SSL certificates.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <DomainManager websiteId={resolvedParams.websiteId} domains={domains} />
      </div>
    </div>
  );
}
