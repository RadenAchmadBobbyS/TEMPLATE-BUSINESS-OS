'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DndContext } from '@dnd-kit/core';
import { ArrowLeft, Monitor, Smartphone, Download, Loader2 } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { CreateWebsiteModal } from '@/core/websites/components/CreateWebsiteModal';
import { RenderNode } from '@/core/builder/engine/RenderNode';
import { useBuilderStore } from '@/core/builder/store';
import { BuilderNode } from '@/core/builder/types';
import { toRenderableRoot } from '@/core/builder/tree-normalizer';

type Template = {
  id: string;
  name: string;
  requiredTier: string;
  category: { name: string };
  industry: { name: string };
  defaultTree?: any;
};

export function TemplatePreviewClient({
  template,
  userTier,
}: {
  template: Template;
  userTier: string;
}) {
  const [deviceMode, setLocalDeviceMode] = useState<'desktop' | 'mobile' | 'tablet'>('desktop');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    useBuilderStore.setState({ previewMode: true, deviceMode });
    setIsReady(true);
    return () => {
      useBuilderStore.setState({ previewMode: false, deviceMode: 'desktop' });
    };
  }, [deviceMode]);

  const tiers = ['FREE', 'STARTER', 'PRO', 'BUSINESS', 'ENTERPRISE'];
  const isLocked = tiers.indexOf(template.requiredTier) > tiers.indexOf(userTier);

  // We extract the nodes from the template's defaultTree
  // Assuming defaultTree is structured like { pages: [{ nodeTree: { ... } }] } or just the nodeTree itself.
  // In our seed script we created: { pages: [{ nodeTree: { type: "Container", ... } }] }
  const defaultPage =
    template.defaultTree?.pages?.find((p: any) => p.slug === '/') ||
    template.defaultTree?.pages?.[0];
  const rootNode = toRenderableRoot(
    defaultPage?.nodeTree || template.defaultTree,
  ) as BuilderNode | null;

  return (
    <div className="flex h-svh w-full flex-col overflow-hidden bg-slate-100">
      {/* Header Bar */}
      <div
        className="flex items-center justify-between border-b-2 bg-white p-4"
        style={{
          borderColor: 'var(--ink)',
          boxShadow: '0px 4px 0px rgba(20,23,31,0.05)',
          zIndex: 10,
        }}
      >
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/templates">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="font-display flex items-center gap-2 text-lg leading-none font-bold">
              {template.name}
              {template.requiredTier !== 'FREE' && (
                <Badge
                  className="font-data rounded-none border-2 text-[10px]"
                  style={{
                    borderColor: 'var(--ink)',
                    backgroundColor: 'var(--amber)',
                    color: 'var(--ink)',
                  }}
                >
                  {isLocked ? '🔒' : ''} {template.requiredTier}
                </Badge>
              )}
            </h1>
            <p className="font-data mt-1 text-xs text-slate-500">
              {template.industry.name} • {template.category.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="mr-4 flex items-center border-2 border-[var(--ink)] bg-[var(--paper)]">
            <Button
              variant="ghost"
              size="icon"
              className={`h-9 w-9 rounded-none ${deviceMode === 'desktop' ? 'bg-[var(--ink)] text-[var(--paper)]' : ''}`}
              onClick={() => setLocalDeviceMode('desktop')}
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-9 w-9 rounded-none border-l-2 border-[var(--ink)] ${deviceMode === 'mobile' ? 'bg-[var(--ink)] text-[var(--paper)]' : ''}`}
              onClick={() => setLocalDeviceMode('mobile')}
            >
              <Smartphone className="h-4 w-4" />
            </Button>
          </div>

          {isLocked ? (
            <Button
              asChild
              className="rounded-none border-2 px-6"
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
                className="rounded-none border-2 px-6"
                style={{
                  borderColor: 'var(--ink)',
                  backgroundColor: 'var(--signal)',
                  color: '#fff',
                }}
              >
                <Download className="mr-2 h-4 w-4" /> Use Template
              </Button>
            </CreateWebsiteModal>
          )}
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex flex-1 justify-center overflow-auto p-4 md:p-8">
        {!isReady ? (
          <div className="flex h-full w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          </div>
        ) : (
          <div
            className={`overflow-y-auto border-2 border-[var(--ink)] bg-white shadow-2xl transition-all duration-300 ${
              deviceMode === 'mobile'
                ? 'h-[812px] w-[375px] rounded-[2rem]'
                : 'h-full w-full max-w-6xl rounded-md'
            }`}
          >
            <DndContext>
              {rootNode ? (
                <RenderNode node={rootNode} />
              ) : (
                <div className="p-8 text-center text-slate-500">
                  No preview available for this template.
                </div>
              )}
            </DndContext>
          </div>
        )}
      </div>
    </div>
  );
}
