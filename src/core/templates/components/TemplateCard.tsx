'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Play, Download, Share } from 'lucide-react';

import { useToast } from '@/shared/hooks/use-toast';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { CreateWebsiteModal } from '@/core/websites/components/CreateWebsiteModal';
import { CornerMarks } from '@/shared/ui/blueprint';
type Template = {
  id: string;
  name: string;
  requiredTier: string;
  category: { name: string };
  industry: { name: string };
  defaultTree?: any;
};

export function TemplateCard({ template, userTier }: { template: Template; userTier: string }) {
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);

  const metadata = template.defaultTree?.metadata || {
    version: 'v1.0.0',
    status: 'Published',
    thumbnail:
      'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?q=80&w=600&auto=format&fit=crop',
  };

  const tiers = ['FREE', 'STARTER', 'PRO', 'BUSINESS', 'ENTERPRISE'];
  const isLocked = tiers.indexOf(template.requiredTier) > tiers.indexOf(userTier);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem('favorite_templates') || '[]');
    setIsFavorite(favs.includes(template.id));
  }, [template.id]);

  const toggleFavorite = () => {
    const favs = JSON.parse(localStorage.getItem('favorite_templates') || '[]');
    if (isFavorite) {
      localStorage.setItem(
        'favorite_templates',
        JSON.stringify(favs.filter((id: string) => id !== template.id)),
      );
      setIsFavorite(false);
    } else {
      favs.push(template.id);
      localStorage.setItem('favorite_templates', JSON.stringify(favs));
      setIsFavorite(true);
    }
  };

  const handleExport = () => {
    const exportData = {
      name: template.name + ' (Exported)',
      defaultTree: template.defaultTree || { type: 'Container', props: {}, children: [] },
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name.toLowerCase().replace(/\s+/g, '-')}-template.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Template Exported', description: 'JSON file downloaded successfully.' });
  };

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
        className="relative aspect-[4/3] w-full overflow-hidden border-b-2"
        style={{ borderColor: 'var(--ink)' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={metadata.thumbnail}
          alt={`${template.name} preview`}
          className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
        />

        <div className="absolute top-2 right-2 flex gap-2">
          {template.requiredTier !== 'FREE' && (
            <Badge
              className="font-data flex items-center gap-1 rounded-none border-2"
              style={{
                borderColor: 'var(--ink)',
                backgroundColor: 'var(--amber)',
                color: 'var(--ink)',
              }}
            >
              {isLocked ? '🔒' : ''} {template.requiredTier}
            </Badge>
          )}
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 rounded-none border-2 opacity-0 transition-opacity group-hover:opacity-100"
            style={{ borderColor: 'var(--ink)', backgroundColor: 'var(--paper)' }}
            onClick={toggleFavorite}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
        </div>

        <div className="absolute top-2 left-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
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
            className="rounded-none border-2"
            asChild
            style={{
              borderColor: 'var(--ink)',
              backgroundColor: 'var(--paper)',
              color: 'var(--ink)',
            }}
          >
            <Link href={`/dashboard/templates/${template.id}/preview`}>
              <Play className="mr-2 h-4 w-4" /> Preview
            </Link>
          </Button>
        </div>
      </div>

      <div className="p-4 pb-0">
        <h3
          className="font-display max-w-[200px] truncate leading-none font-semibold tracking-tight"
          style={{ color: 'var(--ink)' }}
        >
          {template.name}
        </h3>
        <p className="font-data mt-1.5 text-[11px]" style={{ color: 'var(--slate)' }}>
          {template.industry.name} • {template.category.name}
        </p>
      </div>

      <div className="flex gap-2 p-4 pt-4">
        {isLocked ? (
          <Button
            asChild
            className="flex-1 rounded-none border-2"
            style={{
              borderColor: 'var(--ink)',
              backgroundColor: 'var(--amber)',
              color: 'var(--ink)',
            }}
          >
            <Link href="/dashboard/settings/workspace">Upgrade to {template.requiredTier}</Link>
          </Button>
        ) : (
          <CreateWebsiteModal templateId={template.id}>
            <Button
              className="flex-1 rounded-none border-2"
              style={{ borderColor: 'var(--ink)', backgroundColor: 'var(--signal)', color: '#fff' }}
            >
              <Download className="mr-2 h-4 w-4" /> Use Template
            </Button>
          </CreateWebsiteModal>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 rounded-none border-2"
                style={{ borderColor: 'var(--ink)' }}
              >
                <Share className="h-4 w-4" />
              </Button>
            }
          />
          <DropdownMenuContent
            align="end"
            className="rounded-none border-2"
            style={{ borderColor: 'var(--ink)', boxShadow: '4px 4px 0px var(--ink)' }}
          >
            <DropdownMenuItem onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" /> Export JSON
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
