import { ExternalLink } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { CornerMarks } from '@/shared/ui/blueprint';

type ShowcaseWebsite = {
  id: string;
  name: string;
  slug: string;
  domain: string | null;
  description: string | null;
  settings: any;
};

export function ShowcaseCard({ website }: { website: ShowcaseWebsite }) {
  const metadata = website.settings?.metadata || {
    thumbnail:
      'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?q=80&w=600&auto=format&fit=crop',
  };

  const previewUrl = website.domain ? `https://${website.domain}` : null;

  return (
    <div
      className="group relative flex flex-col justify-between overflow-hidden border-2 transition-transform hover:-translate-y-1"
      style={{
        borderColor: 'var(--ink)',
        boxShadow: '4px 4px 0px var(--ink)',
        backgroundColor: 'var(--paper)',
      }}
    >
      <CornerMarks />
      <div
        className="relative aspect-[16/10] w-full overflow-hidden border-b-2"
        style={{ borderColor: 'var(--ink)' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={metadata.thumbnail}
          alt={`${website.name} preview`}
          className="h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
        />

        {previewUrl && (
          <div
            className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 backdrop-blur-[2px] transition-opacity group-hover:opacity-100"
            style={{ backgroundColor: 'rgba(20,23,31,0.15)' }}
          >
            <Button
              size="sm"
              className="rounded-none border-2 z-20"
              asChild
              style={{
                borderColor: 'var(--ink)',
                backgroundColor: 'var(--paper)',
                color: 'var(--ink)',
              }}
            >
              <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" /> Visit Site
              </a>
            </Button>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col gap-1">
        <h3
          className="font-display max-w-full truncate leading-none font-semibold tracking-tight"
          style={{ color: 'var(--ink)' }}
        >
          {website.name}
        </h3>
        <p className="font-data mt-1.5 text-xs text-muted-foreground line-clamp-2" style={{ minHeight: '32px' }}>
          {website.description || 'A beautiful website built with Business OS.'}
        </p>
      </div>
    </div>
  );
}
