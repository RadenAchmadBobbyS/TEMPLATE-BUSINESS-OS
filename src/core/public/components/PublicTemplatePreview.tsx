"use client";

import React from "react";
import { componentRegistry } from "@/core/builder/registry";

// Type definitions matching the builder nodes
export type PublicBuilderNode = {
  id: string;
  type: string;
  props: Record<string, any>;
  styles?: any;
  children?: PublicBuilderNode[];
};

/**
 * Recursive read-only renderer for a single builder node.
 * This skips all drag-and-drop, selection, and builder store logic.
 */
function PublicRenderNode({ node }: { node: PublicBuilderNode }) {
  const componentMeta = componentRegistry[node.type as keyof typeof componentRegistry];
  const Component = componentMeta?.render;

  if (!Component) {
    // If a component is missing from the registry, safely render nothing or a tiny placeholder
    return <div className="hidden" data-missing-component={node.type} />;
  }

  // Pass previewMode={true} and mode="desktop" to ensure standard rendering
  return (
    <Component {...node.props} styles={node.styles} mode="desktop" previewMode={true}>
      {node.children?.map((child) => (
        <PublicRenderNode key={child.id} node={child} />
      ))}
    </Component>
  );
}

/**
 * PublicTemplatePreview
 * Renders an interactive, read-only preview of a Business OS template tree.
 * Wrapped in a stylized browser chrome frame.
 */
export function PublicTemplatePreview({ node, fullScreen = false, slug }: { node?: PublicBuilderNode | null, fullScreen?: boolean, slug?: string }) {
  if (!node) {
    return (
      <div className={`flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-border bg-muted/20 ${fullScreen ? 'min-h-screen' : 'rounded-xl'}`}>
        <p className="font-display text-lg font-semibold text-foreground mb-1">Preview Unavailable</p>
        <p className="text-sm text-muted-foreground">
          This template does not have valid structure data.
        </p>
      </div>
    );
  }

  if (fullScreen) {
    return (
      <div className="w-full bg-background min-h-screen">
        <PublicRenderNode node={node} />
      </div>
    );
  }

  // Using inline styles with standard CSS vars where needed to align with existing design system
  return (
    <div 
      className="flex flex-col overflow-hidden border-2 transition-all"
      style={{ 
        borderColor: 'var(--ink)', 
        backgroundColor: 'var(--paper)',
        boxShadow: '6px 6px 0 var(--ink)'
      }}
    >
      {/* Browser Chrome Header */}
      <div 
        className="flex items-center justify-between px-4 py-3 border-b-2"
        style={{ borderColor: 'var(--ink)', backgroundColor: 'var(--line)' }}
      >
        <div className="flex items-center gap-1.5 w-24">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#ff5f57' }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#febc2e' }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#28c840' }} />
        </div>
        <div className="flex-1 max-w-xl mx-auto flex justify-center">
          <div 
            className="w-full max-w-sm px-3 py-1 text-xs text-center border rounded-md font-data truncate"
            style={{ 
              borderColor: 'var(--ink)', 
              backgroundColor: 'var(--paper)',
              color: 'var(--slate)' 
            }}
          >
            businessos.app/preview
          </div>
        </div>
        <div className="flex justify-end w-24">
          {slug && (
            <a 
              href={`/templates/${slug}/preview`}
              className="text-[10px] font-semibold hover:underline"
              style={{ color: 'var(--ink)' }}
            >
              Full Preview ↗
            </a>
          )}
        </div>
      </div>
      
      {/* Scrollable Viewport */}
      <div className="relative w-full h-[600px] overflow-y-auto bg-background custom-scrollbar">
        {/* Render Root Node */}
        <PublicRenderNode node={node} />
      </div>
    </div>
  );
}
