import React from "react";
import { BuilderNode } from "@/core/builder/types";
import { componentRegistry } from "@/core/builder/registry";

/**
 * PublicRenderNode is a read-only, highly optimized version of the Builder's RenderNode.
 * It strips out all dnd-kit hooks, Zustand store subscriptions, and hover/select states
 * to ensure maximum performance and clean hydration on public-facing pages.
 */
export function PublicRenderNode({ node, deviceMode = "desktop" }: { node: BuilderNode, deviceMode?: "desktop" | "tablet" | "mobile" }) {
  const componentMeta = componentRegistry[node.type as keyof typeof componentRegistry];
  const Component = componentMeta?.render;

  if (!Component) {
    // In production, we might want to return null or a generic fallback instead of a red error box.
    // However, returning a subtle placeholder can help site owners identify broken components.
    return null;
  }

  // The "previewMode" flag is passed as true so that components know they are in a read-only state.
  return (
    <Component {...node.props} styles={node.styles} mode={deviceMode} previewMode={true}>
      {node.children?.map((child: BuilderNode) => (
        <PublicRenderNode key={child.id} node={child} deviceMode={deviceMode} />
      ))}
    </Component>
  );
}
