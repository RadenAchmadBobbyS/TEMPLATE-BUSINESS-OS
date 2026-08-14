"use client";

import { useBuilderStore } from "@/core/builder/store";
import { RenderNode } from "./RenderNode";
import { useDroppable } from "@dnd-kit/core";

export function Canvas() {
  const { nodes, deviceMode, selectNode, previewMode, isReadOnly } = useBuilderStore();
  const isPreview = previewMode || isReadOnly;

  const { setNodeRef, isOver } = useDroppable({
    id: "canvas-root",
    data: {
      isContainer: true
    }
  });

  const handleDeselect = (e: React.MouseEvent) => {
    // Only deselect if they click directly on the canvas background
    if (e.target === e.currentTarget) {
      selectNode(null);
    }
  };

  const getCanvasWidth = () => {
    switch (deviceMode) {
      case "mobile": return "max-w-[375px]";
      case "tablet": return "max-w-[768px]";
      default: return "max-w-full";
    }
  };

  return (
    <div 
      className={`flex-1 h-full overflow-auto bg-muted/30 flex justify-center ${isPreview ? "p-0" : "p-4 md:p-8"}`}
      onClick={handleDeselect}
    >
      <div 
        ref={setNodeRef}
        className={`w-full bg-background min-h-[800px] transition-all duration-300 ease-in-out shadow-sm ${getCanvasWidth()} ${!isPreview && deviceMode !== "desktop" ? "border rounded-md shadow-lg" : ""} ${isOver && !isPreview ? "ring-2 ring-primary ring-inset" : ""}`}
        style={{ minHeight: isPreview ? "100vh" : "800px" }}
        onClick={handleDeselect}
      >
        {nodes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-muted-foreground border-2 border-dashed rounded-lg m-8 pointer-events-none">
            <p>Canvas is empty</p>
            <p className="text-sm">Drag a component from the left sidebar to begin.</p>
          </div>
        ) : (
          nodes.map((node) => (
            <RenderNode key={node.id} node={node} />
          ))
        )}
      </div>
    </div>
  );
}
