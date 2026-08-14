import { Suspense } from 'react';
import Link from 'next/link';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';

import { getUserWebsites, GetWebsitesOptions } from '@/core/websites/actions';
import { getActiveWorkspace } from '@/core/workspaces/server-context';
import { WebsiteList } from '@/core/websites/components/WebsiteList';
import { WebsiteToolbar } from '@/core/websites/components/WebsiteToolbar';
import { WebsiteSkeleton } from '@/core/websites/components/WebsiteSkeleton';
import { CreateWebsiteModal } from '@/core/websites/components/CreateWebsiteModal';

import { Button } from '@/shared/ui/button';
import { StaggerContainer, StaggerItem } from '@/shared/ui/motion';
import { PageHeader, btnPrimary } from '@/shared/ui/blueprint';

async function WebsitesData({
  options,
  view,
  role,
  canCreateDelete,
}: {
  options: GetWebsitesOptions;
  view: 'grid' | 'list';
  role: string;
  canCreateDelete?: boolean;
}) {
  const { websites, total, pages } = await getUserWebsites(options);
  const currentPage = options.page || 1;

  return (
    <div className="space-y-6">
      <WebsiteList websites={websites} view={view} role={role} canCreateDelete={canCreateDelete} />

      {pages > 1 && (
        <div
          className="flex items-center justify-between border-t-2 pt-4"
          style={{ borderColor: 'var(--line)' }}
        >
          <p className="font-data text-xs" style={{ color: 'var(--slate)' }}>
            Showing {websites.length} of {total} websites
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              asChild={currentPage > 1}
              className="rounded-none border-2"
              style={{ borderColor: 'var(--ink)' }}
            >
              {currentPage > 1 ? (
                <Link
                  href={`?${new URLSearchParams({ ...(options as any), page: (currentPage - 1).toString(), view }).toString()}`}
                >
                  <ChevronLeft className="mr-1 h-4 w-4" /> Previous
                </Link>
              ) : (
                <>
                  <ChevronLeft className="mr-1 h-4 w-4" /> Previous
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= pages}
              asChild={currentPage < pages}
              className="rounded-none border-2"
              style={{ borderColor: 'var(--ink)' }}
            >
              {currentPage < pages ? (
                <Link
                  href={`?${new URLSearchParams({ ...(options as any), page: (currentPage + 1).toString(), view }).toString()}`}
                >
                  Next <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              ) : (
                <>
                  Next <ChevronRight className="ml-1 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default async function WebsitesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const active = await getActiveWorkspace();

  const status =
    typeof params.status === 'string' && params.status === 'archived' ? 'archived' : 'active';
  const search = typeof params.search === 'string' ? params.search : undefined;
  const sort = typeof params.sort === 'string' ? params.sort : 'createdAt_desc';
  const filter = typeof params.filter === 'string' ? params.filter : undefined;
  const page = typeof params.page === 'string' ? parseInt(params.page, 10) : 1;
  const view = typeof params.view === 'string' && params.view === 'list' ? 'list' : 'grid';

  const options: GetWebsitesOptions = { status, search, sort, filter, page, limit: 12 };

  return (
    <StaggerContainer className="space-y-6">
      <StaggerItem>
        <PageHeader
          eyebrow="PROJECTS"
          title="Websites"
          description="Manage your deployed sites, custom domains, and global settings."
          actions={
            active && (active.role === 'OWNER' || active.role === 'ADMIN' || active.canCreateDelete) ? (
              <CreateWebsiteModal>
                <Button
                  className={btnPrimary}
                  style={{ backgroundColor: 'var(--signal)', color: '#fff' }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Website
                </Button>
              </CreateWebsiteModal>
            ) : null
          }
        />
      </StaggerItem>

      {/* Status tabs — blueprint style: underline indicator, bukan pill */}
      <StaggerItem>
        <div className="flex gap-6 border-b-2" style={{ borderColor: 'var(--line)' }}>
          {(['active', 'archived'] as const).map((tab) => (
            <Link
              key={tab}
              href={`?status=${tab}`}
              className="font-data relative -mb-0.5 pb-3 text-xs font-semibold tracking-wider uppercase transition-colors"
              style={{
                color: status === tab ? 'var(--ink)' : 'var(--slate)',
                borderBottom: status === tab ? '2px solid var(--signal)' : '2px solid transparent',
              }}
            >
              {tab}
            </Link>
          ))}
        </div>
      </StaggerItem>

      <StaggerItem>
        <WebsiteToolbar search={search} sort={sort} view={view} />
      </StaggerItem>

      <StaggerItem>
        <Suspense fallback={<WebsiteSkeleton view={view} />} key={JSON.stringify(options) + view}>
          <WebsitesData options={options} view={view} role={active?.role || 'EDITOR'} canCreateDelete={active?.canCreateDelete} />
        </Suspense>
      </StaggerItem>
    </StaggerContainer>
  );
}
