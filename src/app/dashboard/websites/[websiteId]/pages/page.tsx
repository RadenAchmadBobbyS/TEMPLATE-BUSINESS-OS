import { Suspense } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { getPages } from '@/core/pages/actions';
import { PageList } from '@/core/pages/components/PageList';
import { CreatePageModal } from '@/core/pages/components/CreatePageModal';
import { Button } from '@/shared/ui/button';
import { LoadingState } from '@/shared/ui/loading-state';

async function PagesData({ websiteId }: { websiteId: string }) {
  const pages = await getPages(websiteId);
  return <PageList pages={pages} websiteId={websiteId} />;
}

export default async function PagesDashboard({
  params,
}: {
  params: Promise<{ websiteId: string }>;
}) {
  const resolvedParams = await params;

  // Fetch pages for the modal dropdown
  const pages = await getPages(resolvedParams.websiteId);

  return (
    <div className="max-w-5xl space-y-6 pb-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/websites">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Pages Architecture</h2>
            <p className="text-muted-foreground">
              Manage your website's routing, SEO, and nested page structure.
            </p>
          </div>
        </div>

        <CreatePageModal websiteId={resolvedParams.websiteId} pages={pages} />
      </div>

      <div className="bg-muted/30 rounded-lg border p-6">
        <Suspense fallback={<LoadingState message="Loading architecture..." />}>
          <PagesData websiteId={resolvedParams.websiteId} />
        </Suspense>
      </div>
    </div>
  );
}
