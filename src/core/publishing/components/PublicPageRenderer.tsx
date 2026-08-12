import React from "react";
import { BuilderNode } from "@/core/builder/types";
import { PublicRenderNode } from "./PublicRenderNode";
import { generateThemeCSS } from "@/core/theme/utils";
import { AnalyticsTracker } from "@/core/analytics/client";

interface PublicPageRendererProps {
  nodeTree: BuilderNode | null;
  themeVariables: any;
  websiteId?: string;
}

export function PublicPageRenderer({ nodeTree, themeVariables, websiteId }: PublicPageRendererProps) {
  if (!nodeTree) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">No content found for this page.</p>
      </div>
    );
  }

  // Convert stored theme variables into CSS properties string if they exist.
  // Assuming `generateThemeCSS` works with the theme settings and returns a string like:
  // "--primary: 220 100% 50%; --radius: 0.5rem;"
  // If generateThemeCSS returns a full stylesheet block (like <style>), we should handle it accordingly.
  // Based on the usual BusinessOS ThemeEngine usage, we'll inline it or let the parent layout handle it.
  // For safety, we can inject a style tag if needed, but the layout is better.
  
  return (
    <div className="w-full min-h-screen bg-background text-foreground overflow-x-hidden">
      {themeVariables && (
        <style dangerouslySetInnerHTML={{ __html: generateThemeCSS(themeVariables) }} />
      )}
      <PublicRenderNode node={nodeTree} deviceMode="desktop" />
      {websiteId && <AnalyticsTracker websiteId={websiteId} />}
    </div>
  );
}
