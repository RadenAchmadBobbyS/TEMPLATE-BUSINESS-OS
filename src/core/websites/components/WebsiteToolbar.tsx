'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { LayoutGrid, List } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { PageToolbar } from '@/shared/ui/page-toolbar';

const sortOptions = [
  { value: 'createdAt_desc', label: 'Newest first' },
  { value: 'createdAt_asc', label: 'Oldest first' },
  { value: 'updatedAt_desc', label: 'Recently updated' },
  { value: 'name_asc', label: 'Name A–Z' },
];

export function WebsiteToolbar({
  search,
  sort,
  view,
}: {
  search?: string;
  sort: string;
  view: 'grid' | 'list';
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <PageToolbar
      search={search}
      searchPlaceholder="Search websites..."
      actions={
        <>
          <Select value={sort} onValueChange={(val) => updateParam('sort', val as string)}>
            <SelectTrigger
              className="font-data h-9 w-[170px] shrink-0 rounded-none border-2 text-xs"
              style={{ borderColor: 'var(--ink)', backgroundColor: 'var(--paper)' }}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent
              className="rounded-none border-2"
              style={{
                borderColor: 'var(--ink)',
                boxShadow: '4px 4px 0px var(--ink)',
                backgroundColor: 'var(--paper)',
              }}
            >
              {sortOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="font-data text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex h-9 shrink-0 border-2" style={{ borderColor: 'var(--ink)' }}>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-full w-9 rounded-none"
              style={
                view === 'grid'
                  ? { backgroundColor: 'var(--signal)', color: '#fff' }
                  : { color: 'var(--ink)' }
              }
              onClick={() => updateParam('view', 'grid')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-full w-9 rounded-none border-l-2"
              style={
                view === 'list'
                  ? { backgroundColor: 'var(--signal)', color: '#fff', borderColor: 'var(--ink)' }
                  : { color: 'var(--ink)', borderColor: 'var(--ink)' }
              }
              onClick={() => updateParam('view', 'list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </>
      }
    />
  );
}
