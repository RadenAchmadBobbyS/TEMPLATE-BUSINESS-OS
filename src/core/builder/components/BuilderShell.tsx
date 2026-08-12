"use client";

import React, { useState } from "react";
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates, arrayMove } from "@dnd-kit/sortable";
import { TopToolbar } from "./TopToolbar";
import { LeftSidebar } from "./LeftSidebar";
import { RightSidebar } from "./RightSidebar";
import { Canvas } from "../engine/Canvas";
import { useBuilderStore, findNodeAndParent } from "../store";
import { ComponentType } from "../schemas";
import { componentRegistry } from "../registry";

export function BuilderShell({ websiteId, pageId }: { websiteId?: string, pageId?: string }) {
  const { addNode, moveNode, nodes, deviceMode } = useBuilderStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<ComponentType | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before dragging starts
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    if (active.data.current?.isSidebarItem) {
      setActiveType(active.data.current.type as ComponentType);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Handling nested drag over is complex; for a simple V1, 
    // we let DragEnd handle the final drop placement.
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    setActiveType(null);

    const { active, over } = event;
    if (!over) return;

    const isSidebarItem = active.data.current?.isSidebarItem;
    const itemType = active.data.current?.type as ComponentType;
    
    // Determine target parent and index
    const overId = over.id as string;
    const isOverContainer = over.data.current?.isContainer;
    
    const { node: overNode, parentId: overParentId } = findNodeAndParent(nodes, overId);

    // Simplistic drop logic:
    if (isSidebarItem) {
      // It's a new item from sidebar
      const newNode = {
        id: crypto.randomUUID(),
        type: itemType,
        props: componentRegistry[itemType].defaultProps || {},
        styles: {},
        children: []
      };

      if (overId === "canvas-root") {
        addNode(newNode);
      } else if (isOverContainer) {
        addNode(newNode, overId);
      } else {
        if (overParentId) {
          const parentNode = findNodeAndParent(nodes, overParentId).node;
          const index = parentNode?.children?.findIndex((n: any) => n.id === overId) ?? 0;
          addNode(newNode, overParentId, index + 1);
        } else {
          const index = nodes.findIndex((n: any) => n.id === overId);
          addNode(newNode, undefined, index + 1);
        }
      }
    } else {
      // Reordering an existing item
      if (active.id !== over.id) {
        const { node: activeNode } = findNodeAndParent(nodes, active.id as string);
        
        const isDescendant = (parent: any, childId: string): boolean => {
          if (parent.id === childId) return true;
          return parent.children?.some((c: any) => isDescendant(c, childId)) || false;
        };

        if (activeNode && isDescendant(activeNode, overId)) {
          return; // Invalid move
        }

        if (isOverContainer && overId !== active.id) {
          moveNode(active.id as string, overId, 9999);
        } else if (overId === "canvas-root") {
          moveNode(active.id as string, "root", 9999);
        } else {
          if (overParentId) {
            const parentNode = findNodeAndParent(nodes, overParentId).node;
            const index = parentNode?.children?.findIndex((n: any) => n.id === overId) ?? 0;
            moveNode(active.id as string, overParentId, index + 1);
          } else {
            const index = nodes.findIndex((n: any) => n.id === overId);
            moveNode(active.id as string, "root", index + 1);
          }
        }
      }
    }
  };

  return (
    <DndContext 
      sensors={sensors} 
      collisionDetection={closestCorners} 
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col h-screen w-full">
        <TopToolbar websiteId={websiteId} pageId={pageId} />
        <div className="flex flex-1 overflow-hidden relative">
          <LeftSidebar />
          <Canvas />
          <RightSidebar />
        </div>
      </div>

      <DragOverlay dropAnimation={null}>
        {activeId && activeType ? (
          <div className="p-4 bg-primary text-primary-foreground rounded-md shadow-xl opacity-90 border-2 border-white cursor-grabbing">
            {componentRegistry[activeType].label}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
