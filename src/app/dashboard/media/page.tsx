import { Suspense } from 'react';
import Link from 'next/link';
import { ChevronRight, Home, UploadCloud, FolderPlus, Search, Heart } from 'lucide-react';

import { getFolders, getAssets, getFolderPath } from '@/core/media/queries';
import { MediaLibrary } from '@/core/media/components/MediaLibrary';
import { UploadModal } from '@/core/media/components/UploadModal';
import { CreateFolderModal } from '@/core/media/components/CreateFolderModal';

import { Button } from '@/shared/ui/button';
import { LoadingState } from '@/shared/ui/loading-state';
import { StaggerContainer, StaggerItem } from '@/shared/ui/motion';
import { CornerMarks, PageHeader, btnPrimary, btnOutline } from '@/shared/ui/blueprint';
import { PageToolbar } from '@/shared/ui/page-toolbar';
import { getActiveWorkspace, canPerformDestructiveAction, hasWorkspacePermission } from '@/core/workspaces/server-context';

async function MediaData({
  folderId,
  search,
  isFavorite,
}: {
  folderId?: string;
  search?: string;
  isFavorite?: boolean;
}) {
  const [folders, assets] = await Promise.all([
    getFolders(folderId),
    getAssets(folderId, search, isFavorite),
  ]);

  return <MediaLibrary folders={folders} assets={assets} />;
}

async function Breadcrumbs({ folderId }: { folderId?: string }) {
  if (!folderId) {
    return (
      <div
        className="font-data flex items-center gap-1.5 text-xs"
        style={{ color: 'var(--slate)' }}
      >
        <Home className="h-3.5 w-3.5" />
        Media Library
      </div>
    );
  }

  const path = await getFolderPath(folderId);

  return (
    <div
      className="font-data flex items-center overflow-x-auto text-xs whitespace-nowrap"
      style={{ color: 'var(--slate)' }}
    >
      <Link
        href="/dashboard/media"
        className="flex items-center transition-colors hover:opacity-100"
      >
        <Home className="h-3.5 w-3.5" />
      </Link>
      {path.map((folder, i) => (
        <div key={folder.id} className="flex items-center">
          <ChevronRight className="mx-1 h-3.5 w-3.5" style={{ color: 'var(--line)' }} />
          <Link
            href={`/dashboard/media?folderId=${folder.id}`}
            className="transition-colors hover:opacity-100"
            style={i === path.length - 1 ? { color: 'var(--ink)', fontWeight: 600 } : undefined}
          >
            {folder.name}
          </Link>
        </div>
      ))}
    </div>
  );
}

export default async function MediaPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const folderId = typeof params.folderId === 'string' ? params.folderId : undefined;
  const search = typeof params.search === 'string' ? params.search : undefined;
  const isFavorite = params.favorite === 'true';

  const active = await getActiveWorkspace();

  return (
    <StaggerContainer className="mx-auto max-w-7xl space-y-6">
      <StaggerItem>
        <PageHeader
          eyebrow="ASSET"
          title="Media Library"
          actions={
            <>
              {active && canPerformDestructiveAction(active.role, active.canCreateDelete) && (
                <CreateFolderModal parentId={folderId}>
                  <Button variant="outline" className={btnOutline}>
                    <FolderPlus className="mr-2 h-4 w-4" />
                    New Folder
                  </Button>
                </CreateFolderModal>
              )}
              {active && hasWorkspacePermission(active.role, 'EDITOR') && (
                <UploadModal folderId={folderId}>
                  <Button
                    className={btnPrimary}
                    style={{
                      backgroundColor: 'var(--signal)',
                      color: '#fff',
                      borderColor: 'var(--ink)',
                    }}
                  >
                    <UploadCloud className="mr-2 h-4 w-4" />
                    Upload
                  </Button>
                </UploadModal>
              )}
            </>
          }
        />
        <div className="mt-3">
          <Suspense
            fallback={
              <div className="h-4 w-48 animate-pulse" style={{ backgroundColor: 'var(--line)' }} />
            }
          >
            <Breadcrumbs folderId={folderId} />
          </Suspense>
        </div>
      </StaggerItem>

      <StaggerItem>
        <PageToolbar
          search={search}
          searchPlaceholder="Search assets..."
          actions={
            <div className="flex items-center gap-2">
              {search && (
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="font-data h-9 rounded-none text-xs"
                >
                  <Link href={`/dashboard/media${folderId ? `?folderId=${folderId}` : ''}`}>Clear</Link>
                </Button>
              )}
              <Button
                asChild
                size="sm"
                className={isFavorite ? `${btnPrimary} h-9` : `${btnOutline} h-9`}
                style={isFavorite ? { backgroundColor: 'var(--signal)', color: '#fff' } : undefined}
              >
                <Link
                  href={`/dashboard/media?${folderId ? `folderId=${folderId}&` : ''}favorite=${!isFavorite}`}
                >
                  <Heart className={`mr-2 h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                  Favorites
                </Link>
              </Button>
            </div>
          }
        />
      </StaggerItem>

      <StaggerItem>
        <Suspense fallback={<LoadingState message="Fetching media..." />}>
          <MediaData folderId={folderId} search={search} isFavorite={isFavorite} />
        </Suspense>
      </StaggerItem>
    </StaggerContainer>
  );
}
