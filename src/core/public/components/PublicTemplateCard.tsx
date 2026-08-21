import Link from 'next/link';
import { Play } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { CornerMarks } from '@/shared/ui/blueprint';

type Template = {
  id: string;
  slug?: string | null;
  name: string;
  requiredTier: string;
  category: { name: string };
  industry: { name: string };
  defaultTree?: any;
};

export function PublicTemplateCard({ template }: { template: Template }) {
  const metadata = template.defaultTree?.metadata || {
    version: 'v1.0.0',
    status: 'Published',
    thumbnail:
      'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?q=80&w=600&auto=format&fit=crop',
  };

  const templateSlug = template.slug || template.id;

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
        className="relative aspect-[4/3] w-full overflow-hidden border-b-2 cursor-pointer"
        style={{ borderColor: 'var(--ink)' }}
      >
        <Link href={`/templates/${templateSlug}`} className="absolute inset-0 z-10" aria-label={`View ${template.name}`} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={metadata.thumbnail}
          alt={`${template.name} preview`}
          className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
        />

        <div className="absolute top-2 right-2 flex gap-2 z-20">
          {template.requiredTier !== 'FREE' && (
            <Badge
              className="font-data flex items-center gap-1 rounded-none border-2"
              style={{
                borderColor: 'var(--ink)',
                backgroundColor: 'var(--amber)',
                color: 'var(--ink)',
              }}
            >
              {template.requiredTier}
            </Badge>
          )}
        </div>

        <div className="absolute top-2 left-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 z-20">
          <Badge
            variant="outline"
            className="font-data rounded-none border-2 text-[10px]"
            style={{ borderColor: 'var(--ink)', backgroundColor: 'var(--paper)' }}
          >
            {metadata.version}
          </Badge>
          <Badge
            variant="outline"
            className="font-data rounded-none border-2 text-[10px]"
            style={{
              borderColor: 'var(--signal)',
              backgroundColor: 'var(--paper)',
              color: 'var(--signal)',
            }}
          >
            {metadata.status}
          </Badge>
        </div>

        <div
          className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 backdrop-blur-[2px] transition-opacity group-hover:opacity-100"
          style={{ backgroundColor: 'rgba(20,23,31,0.15)' }}
        >
          <Button
            size="sm"
            className="rounded-none border-2 z-20 pointer-events-none"
            style={{
              borderColor: 'var(--ink)',
              backgroundColor: 'var(--paper)',
              color: 'var(--ink)',
            }}
          >
            <Play className="mr-2 h-4 w-4" /> View Details
          </Button>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-1">
        <Link href={`/templates/${templateSlug}`} className="hover:underline">
          <h3
            className="font-display max-w-[200px] truncate leading-none font-semibold tracking-tight"
            style={{ color: 'var(--ink)' }}
          >
            {template.name}
          </h3>
        </Link>
        <p className="font-data mt-1.5 text-[11px]" style={{ color: 'var(--slate)' }}>
          {template.industry.name} • {template.category.name}
        </p>
      </div>
    </div>
  );
}
