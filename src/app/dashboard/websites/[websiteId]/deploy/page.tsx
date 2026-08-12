import { prisma } from "@/shared/lib/prisma";
import { getWebsiteById } from "@/core/websites/actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { DeployDashboard } from "@/core/hosting/components/DeployDashboard";

export default async function DeployPage({ params }: { params: Promise<{ websiteId: string }> }) {
  const resolvedParams = await params;
  
  let website;
  try {
    website = await getWebsiteById(resolvedParams.websiteId);
  } catch (e) {
    notFound();
  }

  const deployments = await prisma.deployment.findMany({
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
          <h2 className="text-3xl font-bold tracking-tight">Hosting & Deployments</h2>
          <p className="text-muted-foreground">
            Deploy {website.name} to the edge and manage version history.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <DeployDashboard website={website} deployments={deployments} />
      </div>
    </div>
  );
}
