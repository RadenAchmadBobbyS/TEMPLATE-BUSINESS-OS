"use client";

import { ThemeInjector } from "./ThemeInjector";
import { PublicRenderNode } from "@/core/publishing/components/PublicRenderNode";
import { toRenderableRoot } from "@/core/builder/tree-normalizer";

export function LivePreview({ nodeTree }: { nodeTree: any }) {
  const root = toRenderableRoot(nodeTree);

  return (
    <div className="flex-1 bg-muted/30 flex items-center justify-center p-8 overflow-auto relative">
      <ThemeInjector>
        <div className="w-full h-full bg-[hsl(var(--background))] text-[hsl(var(--foreground))] rounded-[var(--radius)] shadow-lg overflow-auto border border-[hsl(var(--border))] transition-all duration-300 relative">
          
          {root ? (
            <PublicRenderNode node={root} deviceMode="desktop" />
          ) : (
            <div className="flex items-center justify-center h-full text-[hsl(var(--muted-foreground))]">
              <p>No content on this page.</p>
            </div>
          )}
          
        </div>
      </ThemeInjector>
    </div>
  );
}
