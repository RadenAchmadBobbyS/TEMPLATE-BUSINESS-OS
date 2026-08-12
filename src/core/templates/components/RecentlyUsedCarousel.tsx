'use client';

import { useEffect, useState } from 'react';
import { TemplateCard } from './TemplateCard';
import { getTemplates } from '@/core/templates/queries';
import { ScrollArea, ScrollBar } from '@/shared/ui/scroll-area';
import { Clock } from 'lucide-react';

type Template = {
  id: string;
  name: string;
  requiredTier: string;
  category: { name: string };
  industry: { name: string };
  defaultTree?: any;
};

export function RecentlyUsedCarousel({ userTier }: { userTier: string }) {
  const [recentTemplates, setRecentTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadRecents() {
      try {
        const stored = JSON.parse(localStorage.getItem('recently_used_templates') || '[]');
        if (stored.length === 0) {
          setIsLoading(false);
          return;
        }
        const allTemplates = await getTemplates();
        const found = stored
          .map((id: string) => allTemplates.find((t) => t.id === id))
          .filter(Boolean)
          .slice(0, 5);
        setRecentTemplates(found);
      } catch (e) {
        console.error('Failed to load recents', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadRecents();
  }, []);

  if (isLoading || recentTemplates.length === 0) return null;

  return (
    <div className="mb-10">
      <div className="mb-4 flex items-center gap-2">
        <Clock className="h-4 w-4" style={{ color: 'var(--signal)' }} />
        <h3
          className="font-display text-lg font-semibold tracking-tight"
          style={{ color: 'var(--ink)' }}
        >
          Recently Used
        </h3>
      </div>

      <ScrollArea className="w-full pb-4 whitespace-nowrap">
        <div className="flex w-max space-x-4">
          {recentTemplates.map((template) => (
            <div key={template.id} className="inline-block w-[300px]">
              <TemplateCard template={template} userTier={userTier} />
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
