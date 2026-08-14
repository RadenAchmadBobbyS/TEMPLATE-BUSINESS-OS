import { PageCard } from './PageCard';
import { EmptyState } from '@/shared/ui/empty-state';
import { Button } from '@/shared/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export function PageList({ pages, websiteId, role }: { pages: any[]; websiteId?: string; role?: string }) {
  if (!pages || pages.length === 0) {
    return (
      <div className="mt-8">
        <EmptyState
          title="No pages found"
          description="Create your first page to start building your website, or apply a pre-built template."
          action={
            websiteId ? (
              <Button asChild style={{ backgroundColor: 'var(--signal)', color: '#fff' }}>
                <Link href={`/dashboard/templates?applyTo=${websiteId}`}>
                  <Plus className="mr-2 h-4 w-4" />
                  Browse Templates
                </Link>
              </Button>
            ) : undefined
          }
        />
      </div>
    );
  }

  // Build hierarchy
  const rootPages = pages.filter((p) => !p.parentId).sort((a, b) => a.order - b.order);

  const getChildren = (parentId: string) => {
    return pages.filter((p) => p.parentId === parentId).sort((a, b) => a.order - b.order);
  };

  const renderPage = (page: any, level: number) => {
    const children = getChildren(page.id);
    return (
      <div key={page.id} className="space-y-3">
        <PageCard page={page} level={level} role={role} />
        {children.length > 0 && (
          <div className="before:bg-border/50 relative space-y-3 before:absolute before:top-[-1rem] before:bottom-6 before:left-[1.2rem] before:w-[2px] before:content-['']">
            {children.map((child) => renderPage(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return <div className="mt-6 space-y-3">{rootPages.map((page) => renderPage(page, 0))}</div>;
}
