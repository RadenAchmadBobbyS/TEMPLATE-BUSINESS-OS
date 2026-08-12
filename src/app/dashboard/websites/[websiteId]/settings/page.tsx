import { getWebsiteById } from "@/core/websites/actions";
import { WebsiteSettingsForm } from "@/core/websites/components/WebsiteSettingsForm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/shared/ui/button";

export default async function WebsiteSettingsPage({ params }: { params: Promise<{ websiteId: string }> }) {
  const resolvedParams = await params;
  let website;
  try {
    website = await getWebsiteById(resolvedParams.websiteId);
  } catch (e) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-4xl pb-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/websites">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settings: {website.name}</h2>
          <p className="text-muted-foreground">
            Manage advanced configuration for this specific website.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <WebsiteSettingsForm website={website} />
      </div>
    </div>
  );
}
