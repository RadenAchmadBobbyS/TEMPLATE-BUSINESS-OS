import { PageCard } from "./PageCard";
import { EmptyState } from "@/shared/ui/empty-state";

export function PageList({ pages }: { pages: any[] }) {
  if (!pages || pages.length === 0) {
    return (
      <div className="mt-8">
        <EmptyState 
          title="No pages found" 
          description="Create your first page to start building your website." 
        />
      </div>
    );
  }

  // Build hierarchy
  const rootPages = pages.filter(p => !p.parentId).sort((a, b) => a.order - b.order);
  
  const getChildren = (parentId: string) => {
    return pages.filter(p => p.parentId === parentId).sort((a, b) => a.order - b.order);
  };

  const renderPage = (page: any, level: number) => {
    const children = getChildren(page.id);
    return (
      <div key={page.id} className="space-y-3">
        <PageCard page={page} level={level} />
        {children.length > 0 && (
          <div className="space-y-3 relative before:content-[''] before:absolute before:left-[1.2rem] before:top-[-1rem] before:bottom-6 before:w-[2px] before:bg-border/50">
            {children.map(child => renderPage(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mt-6 space-y-3">
      {rootPages.map(page => renderPage(page, 0))}
    </div>
  );
}
