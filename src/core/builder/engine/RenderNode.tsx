"use client";

import React from "react";
import { BuilderNode } from "@/core/builder/types";
import { useBuilderStore } from "@/core/builder/store";
import { componentRegistry } from "@/core/builder/registry";
import { useDraggable, useDroppable } from "@dnd-kit/core";

export function RenderNode({ node }: { node: BuilderNode }) {
  const { selectedNodeId, hoveredNodeId, selectNode, hoverNode, previewMode, deviceMode, isReadOnly } = useBuilderStore();
  const isPreview = previewMode || isReadOnly;

  const isSelected = selectedNodeId === node.id;
  const isHovered = hoveredNodeId === node.id;

  const componentMeta = componentRegistry[node.type as keyof typeof componentRegistry];
  const isContainer = componentMeta?.allowedChildren !== "none";

  // Use Droppable for containers
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: node.id,
    data: {
      type: node.type,
      isContainer,
    },
    disabled: !isContainer || isPreview
  });

  // Use Draggable to allow moving the node
  const { attributes, listeners, setNodeRef: setDraggableRef, transform, isDragging } = useDraggable({
    id: node.id,
    data: {
      type: node.type,
      nodeId: node.id
    },
    disabled: isPreview
  });

  // Combine refs (one for wrapping div, one for the draggable handle if we want, or just both on the wrapper)
  // For simplicity, we apply both to the same wrapper, but usually you'd want a drag handle.
  const setRef = (element: HTMLElement | null) => {
    setDroppableRef(element);
    setDraggableRef(element);
  };

  const Component = componentMeta?.render;

  if (!Component) {
    return <div className="p-2 border border-red-500 text-red-500">Unknown component: {node.type}</div>;
  }

  const handleSelect = (e: React.MouseEvent) => {
    if (isPreview) return;
    e.stopPropagation();
    selectNode(node.id);
  };

  const handleHover = (e: React.MouseEvent) => {
    if (isPreview) return;
    e.stopPropagation();
    hoverNode(node.id);
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    if (isPreview) return;
    e.stopPropagation();
    hoverNode(null);
  };

  const wrapperClass = isPreview 
    ? "" 
    : `relative transition-all ${isSelected ? "ring-2 ring-primary z-10" : isHovered ? "ring-1 ring-primary/50 cursor-pointer" : "ring-1 ring-transparent hover:ring-border border-dashed border border-transparent hover:border-border"}`;

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.5 : 1,
  } : undefined;

  return (
    <div 
      ref={setRef}
      className={`${wrapperClass} ${isOver && isContainer && !isPreview ? "ring-2 ring-green-500 ring-inset bg-green-50/10" : ""}`}
      style={style}
      onClick={handleSelect}
      onMouseOver={handleHover}
      onMouseLeave={handleMouseLeave}
      {...(isPreview ? {} : { ...listeners, ...attributes })}
    >
      {/* Visual Badge when Selected */}
      {!isPreview && isSelected && (
        <div className="absolute -top-6 left-0 bg-primary text-primary-foreground text-[10px] px-2 py-1 rounded-t-md font-medium z-20 shadow-sm flex items-center gap-2 pointer-events-auto">
          <span className="cursor-grab">⋮⋮</span>
          {node.type}
        </div>
      )}
      
      <Component {...node.props} styles={node.styles} mode={deviceMode} previewMode={isPreview}>
        {node.children?.map((child: BuilderNode) => (
          <RenderNode key={child.id} node={child} />
        ))}
      </Component>
    </div>
  );
}
