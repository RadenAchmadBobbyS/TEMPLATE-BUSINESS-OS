"use client";

import { useBuilderStore } from "@/core/builder/store";
import { ComponentType } from "@/core/builder/schemas";
import { componentsList, ComponentMetadata } from "@/core/builder/registry";
import { useDraggable } from "@dnd-kit/core";
import { Button } from "@/shared/ui/button";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { LayoutTemplate, Type, Image as ImageIcon, Square, Plus, PanelTop, CreditCard, Navigation, Columns, Heading1, MoveVertical } from "lucide-react";

// Helper to grab a reasonable icon for unknown components
const getIcon = (category: string) => {
  switch (category) {
    case "Layout": return Square;
    case "Content": return Type;
    case "Business": return CreditCard;
    case "Navigation": return Navigation;
    default: return Plus;
  }
};

function DraggableSidebarItem({ comp }: { comp: ComponentMetadata }) {
  const { addNode, selectedNodeId } = useBuilderStore();
  // eslint-disable-next-line react-hooks/static-components
  const Icon = getIcon(comp.category);

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `sidebar-${comp.type}`,
    data: {
      type: comp.type,
      isSidebarItem: true,
    }
  });

  const handleAddComponent = () => {
    // Click to add support
    addNode({
      id: crypto.randomUUID(),
      type: comp.type,
      props: comp.defaultProps || {},
      styles: comp.defaultStyles || {},
      children: []
    }, selectedNodeId || undefined);
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`relative w-full ${isDragging ? "opacity-50" : ""}`}
    >
      <Button 
        variant="ghost" 
        className="font-display w-full justify-start rounded-none border border-[var(--line)] bg-[var(--paper)] hover:bg-[var(--line)] hover:border-[var(--ink)] cursor-grab active:cursor-grabbing transition-colors"
        onClick={handleAddComponent}
        style={{ color: "var(--ink)" }}
      >
        <Icon className="mr-3 h-4 w-4" style={{ color: "var(--slate)" }} />
        {comp.label}
      </Button>
    </div>
  );
}

import { useState } from "react";
import { LayersPanel } from "./LayersPanel";

export function LeftSidebar() {
  const { previewMode } = useBuilderStore();
  const [activeTab, setActiveTab] = useState<"components" | "layers">("components");

  if (previewMode) return null;

  const categories = ["Layout", "Content", "Business", "Navigation"];

  return (
    <div className="w-64 border-r bg-[var(--paper)] border-[var(--line)] flex flex-col h-full shrink-0 z-10">
      <div className="flex border-b border-[var(--line)]">
        <button 
          className={`font-data flex-1 p-4 font-semibold text-xs uppercase tracking-wider text-center ${activeTab === "components" ? "bg-muted/50 border-b-2 border-primary" : "text-muted-foreground hover:bg-muted/30"}`}
          onClick={() => setActiveTab("components")}
        >
          Components
        </button>
        <button 
          className={`font-data flex-1 p-4 font-semibold text-xs uppercase tracking-wider text-center ${activeTab === "layers" ? "bg-muted/50 border-b-2 border-primary" : "text-muted-foreground hover:bg-muted/30"}`}
          onClick={() => setActiveTab("layers")}
        >
          Layers
        </button>
      </div>
      
      {activeTab === "components" ? (
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            {categories.map(category => (
              <div key={category}>
                <h3 className="text-[10px] font-semibold uppercase tracking-wider mb-3 font-data" style={{ color: "var(--slate)" }}>
                  {category}
                </h3>
                <div className="space-y-2">
                  {componentsList.filter(c => c.category === category).map((comp) => (
                    <DraggableSidebarItem key={comp.type} comp={comp} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="flex-1 overflow-hidden">
          <LayersPanel />
        </div>
      )}
    </div>
  );
}
