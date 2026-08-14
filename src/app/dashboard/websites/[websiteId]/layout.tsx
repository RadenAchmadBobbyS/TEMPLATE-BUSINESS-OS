import { getWebsiteById } from '@/core/websites/actions';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { WebsiteSubNav } from '@/core/websites/components/WebsiteSubNav';
import { getActiveWorkspace } from '@/core/workspaces/server-context';

export default async function WebsiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ websiteId: string }>;
}) {
  const resolvedParams = await params;
  const active = await getActiveWorkspace();
  const role = active?.role || 'EDITOR';

  let website;
  try {
    website = await getWebsiteById(resolvedParams.websiteId);
  } catch (e) {
    notFound();
  }

  return (
    <div className="-m-4 space-y-0 md:-m-8">
      {/* Website Header */}
      <div className="bg-background border-b px-4 py-4 md:px-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/websites">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-semibold">{website.name}</h1>
            <p className="text-muted-foreground truncate text-sm">
              {website.domain || `${website.slug}.businessos.app`}
            </p>
          </div>
        </div>
      </div>

      {/* Sub Navigation Tabs */}
      <WebsiteSubNav websiteId={resolvedParams.websiteId} role={role} />

      {/* Page Content */}
      <div className="p-4 md:p-8">{children}</div>
    </div>
  );
}
