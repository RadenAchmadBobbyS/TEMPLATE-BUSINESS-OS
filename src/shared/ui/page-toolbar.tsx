'use client';

import React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/shared/ui/input';
import { CornerMarks } from '@/shared/ui/blueprint';

export function PageToolbar({
  search,
  searchPlaceholder = 'Search...',
  searchParamName = 'search',
  actions,
}: {
  search?: string;
  searchPlaceholder?: string;
  searchParamName?: string;
  actions?: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(searchParamName, value);
    } else {
      params.delete(searchParamName);
    }
    // reset page param if it exists when searching
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div
      className="relative flex flex-col gap-3 border-2 p-3 lg:flex-row lg:items-center lg:justify-between lg:gap-4"
      style={{
        borderColor: 'var(--ink)',
        boxShadow: '4px 4px 0px var(--ink)',
        backgroundColor: 'var(--paper)',
      }}
    >
      <CornerMarks />

      {/* Search */}
      <form
        className="relative flex w-full items-center lg:max-w-sm"
        onSubmit={(e) => {
          e.preventDefault();
          const value = (e.currentTarget.elements.namedItem(searchParamName) as HTMLInputElement).value;
          updateSearch(value);
        }}
      >
        <Search
          className="pointer-events-none absolute left-3 h-4 w-4"
          style={{ color: 'var(--slate)' }}
        />
        <Input
          name={searchParamName}
          defaultValue={search || ''}
          placeholder={searchPlaceholder}
          className="font-data h-9 rounded-none border-2 border-[var(--ink)] pl-9 text-xs placeholder:text-xs focus-visible:ring-[var(--signal)]"
          style={{ backgroundColor: 'var(--paper)' }}
        />
      </form>

      {/* Actions (Filter, View Toggle, etc) */}
      {actions && (
        <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0">
          {actions}
        </div>
      )}
    </div>
  );
}
