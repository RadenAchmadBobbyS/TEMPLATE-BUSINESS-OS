import { ThemeControls } from "@/core/theme/components/ThemeControls";
import { LivePreview } from "@/core/theme/components/LivePreview";
import { ThemeStoreInitializer } from "@/core/theme/components/ThemeStoreInitializer";
import { getWebsiteTheme } from "@/core/theme/actions";
import { prisma } from "@/shared/lib/prisma";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function ThemePage({ params }: { params: Promise<{ websiteId: string }> }) {
  const resolvedParams = await params;
  const initialTheme = await getWebsiteTheme(resolvedParams.websiteId);

  const page = await prisma.page.findFirst({
    where: { websiteId: resolvedParams.websiteId, deletedAt: null },
    include: {
      versions: { orderBy: { versionNumber: 'desc' }, take: 1 }
    }
  });
  const nodeTree = page?.versions[0]?.nodeTree || null;

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      {/* Mini header for navigation */}
      <header className="h-14 border-b bg-background flex items-center px-4 shrink-0 gap-4">
        <Link href="/dashboard/websites" className="text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <span className="font-semibold">Global Theme Configuration</span>
      </header>
      
      {/* Split Pane */}
      <div className="flex flex-1 overflow-hidden">
        <ThemeStoreInitializer initialTheme={initialTheme} />
        <ThemeControls websiteId={resolvedParams.websiteId} />
        <LivePreview nodeTree={nodeTree as any} />
      </div>
    </div>
  );
}
