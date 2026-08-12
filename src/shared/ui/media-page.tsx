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

  return (
    <StaggerContainer className="mx-auto max-w-7xl space-y-6">
      <StaggerItem>
        <PageHeader
          eyebrow="ASSET"
          title="Media Library"
          actions={
            <>
              <CreateFolderModal parentId={folderId}>
                <Button variant="outline" className={btnOutline}>
                  <FolderPlus className="mr-2 h-4 w-4" />
                  New Folder
                </Button>
              </CreateFolderModal>
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

      <StaggerItem
        className="relative flex flex-col justify-between gap-4 border-2 p-3 sm:flex-row"
        style={{
          borderColor: 'var(--ink)',
          boxShadow: '4px 4px 0px var(--ink)',
          backgroundColor: 'var(--paper)',
        }}
      >
        <CornerMarks />
        <form className="flex max-w-sm flex-1 items-center gap-2">
          {folderId && <input type="hidden" name="folderId" value={folderId} />}
          {isFavorite && <input type="hidden" name="favorite" value="true" />}
          <div className="relative flex-1">
            <Search
              className="absolute top-2.5 left-2.5 h-4 w-4"
              style={{ color: 'var(--slate)' }}
            />
            <input
              type="text"
              name="search"
              defaultValue={search || ''}
              placeholder="Search assets..."
              className="w-full rounded-none border-2 py-2 pr-3 pl-9 text-sm focus:ring-2 focus:outline-none"
              style={{ borderColor: 'var(--ink)', backgroundColor: 'var(--paper)' }}
            />
          </div>
          <Button type="submit" variant="secondary" size="sm" className="rounded-none">
            Search
          </Button>
          {search && (
            <Button asChild variant="ghost" size="sm" className="rounded-none">
              <Link href={`/dashboard/media${folderId ? `?folderId=${folderId}` : ''}`}>Clear</Link>
            </Button>
          )}
        </form>

        <div className="flex items-center gap-2">
          <Button
            asChild
            size="sm"
            className={isFavorite ? btnPrimary : `${btnOutline} h-9`}
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
      </StaggerItem>

      <StaggerItem>
        <Suspense fallback={<LoadingState message="Fetching media..." />}>
          <MediaData folderId={folderId} search={search} isFavorite={isFavorite} />
        </Suspense>
      </StaggerItem>
    </StaggerContainer>
  );
}
