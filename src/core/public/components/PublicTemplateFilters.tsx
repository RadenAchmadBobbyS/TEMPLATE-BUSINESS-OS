'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { PageToolbar } from '@/shared/ui/page-toolbar';

type Category = {
  id: string;
  name: string;
};

const TIER_LABELS: Record<string, string> = {
  all: 'All Tiers',
  FREE: 'Free',
  STARTER: 'Starter',
  PRO: 'Pro',
  BUSINESS: 'Business',
  ENTERPRISE: 'Enterprise',
};

export function PublicTemplateFilters({
  categories,
}: {
  categories: Category[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get('search') || '';
  const currentCategory = searchParams.get('category') || 'all';
  const currentTier = searchParams.get('tier') || 'all';

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <PageToolbar
      search={currentSearch}
      searchPlaceholder="Search templates..."
      actions={
        <div className="flex gap-2">
          <Select
            value={currentTier}
            onValueChange={(value) => updateFilters('tier', value as string)}
          >
            <SelectTrigger
              className="font-data h-9 w-[140px] shrink-0 rounded-none border-2 text-xs"
              style={{ borderColor: 'var(--ink)', backgroundColor: 'var(--paper)' }}
            >
              <SelectValue placeholder="All Tiers">
                {(value: string) => TIER_LABELS[value] || 'All Tiers'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent
              className="rounded-none border-2"
              style={{
                borderColor: 'var(--ink)',
                boxShadow: '4px 4px 0px var(--ink)',
                backgroundColor: 'var(--paper)',
              }}
            >
              <SelectItem value="all" className="font-data text-xs">
                All Tiers
              </SelectItem>
              <SelectItem value="FREE" className="font-data text-xs">
                Free
              </SelectItem>
              <SelectItem value="STARTER" className="font-data text-xs">
                Starter
              </SelectItem>
              <SelectItem value="PRO" className="font-data text-xs">
                Pro
              </SelectItem>
              <SelectItem value="BUSINESS" className="font-data text-xs">
                Business
              </SelectItem>
              <SelectItem value="ENTERPRISE" className="font-data text-xs">
                Enterprise
              </SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={currentCategory}
            onValueChange={(value) => updateFilters('category', value as string)}
          >
            <SelectTrigger
              className="font-data h-9 w-[160px] shrink-0 rounded-none border-2 text-xs"
              style={{ borderColor: 'var(--ink)', backgroundColor: 'var(--paper)' }}
            >
              <SelectValue placeholder="All Categories">
                {(value: string) => {
                  if (!value || value === 'all') return 'All Categories';
                  return categories.find(c => c.id === value)?.name || value;
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent
              className="rounded-none border-2"
              style={{
                borderColor: 'var(--ink)',
                boxShadow: '4px 4px 0px var(--ink)',
                backgroundColor: 'var(--paper)',
              }}
            >
              <SelectItem value="all" className="font-data text-xs">
                All Categories
              </SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id} className="font-data text-xs">
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      }
    />
  );
}
