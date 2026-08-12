import { prisma } from "@/shared/lib/prisma";
import { getWebsiteById } from "@/core/websites/actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { MenuBuilder } from "@/core/navigation/components/MenuBuilder";
import { getPages } from "@/core/pages/actions";

export default async function NavigationDashboard({ params }: { params: Promise<{ websiteId: string }> }) {
  const resolvedParams = await params;
  
  let website;
  let pages = [];
  try {
    website = await getWebsiteById(resolvedParams.websiteId);
    pages = await getPages(resolvedParams.websiteId);
  } catch (e) {
    notFound();
  }

  const initialNav = (website.settings as any)?.navigation || { navbar: [], footer: [] };

  return (
    <div className="space-y-6 max-w-5xl pb-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/websites">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Navigation Manager</h2>
          <p className="text-muted-foreground">
            Configure global navbars, footers, and mega menus for {website.name}.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <MenuBuilder website={website} initialNav={initialNav} pages={pages} />
      </div>
    </div>
  );
}
