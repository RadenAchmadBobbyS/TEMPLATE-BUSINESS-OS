import React, { useState } from "react";
import { useBuilderStore } from "../store";
import { BuilderNode } from "../types";
import { ChevronRight, ChevronDown, Layers, Box, Type, Image as ImageIcon, Copy, Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/utils";
import { componentRegistry } from "../registry";

const getIconForType = (type: string) => {
  if (type === "Text" || type === "Heading") return <Type className="h-4 w-4" />;
  if (type === "Image") return <ImageIcon className="h-4 w-4" />;
  if (type === "Container" || type === "Section" || type === "Grid") return <Box className="h-4 w-4" />;
  return <Layers className="h-4 w-4" />;
};

const LayerItem = ({ node, level = 0 }: { node: BuilderNode, level?: number }) => {
  const { selectedNodeId, selectNode, hoveredNodeId, hoverNode, duplicateNode, removeNode } = useBuilderStore();
  const [expanded, setExpanded] = useState(true);

  const isSelected = selectedNodeId === node.id;
  const isHovered = hoveredNodeId === node.id;
  const hasChildren = node.children && node.children.length > 0;
  
  const ComponentDef = componentRegistry[node.type as keyof typeof componentRegistry];
  const label = ComponentDef ? ComponentDef.label : node.type;

  return (
    <div className="flex flex-col">
      <div 
        className={cn(
          "group flex items-center justify-between py-1.5 px-2 rounded-md cursor-pointer text-sm select-none",
          isSelected ? "bg-primary/20 text-primary font-medium" : "hover:bg-muted",
          isHovered && !isSelected ? "bg-muted/50" : ""
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={(e) => { e.stopPropagation(); selectNode(node.id); }}
        onMouseEnter={() => hoverNode(node.id)}
        onMouseLeave={() => hoverNode(null)}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {hasChildren ? (
            <button 
              onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
              className="p-0.5 hover:bg-muted-foreground/20 rounded shrink-0"
            >
              {expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </button>
          ) : (
            <div className="w-4 shrink-0" />
          )}
          <div className="text-muted-foreground shrink-0">
            {getIconForType(node.type)}
          </div>
          <span className="truncate">{label}</span>
        </div>
        
        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 shrink-0">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6" 
            onClick={(e) => { e.stopPropagation(); duplicateNode(node.id); }}
            title="Duplicate"
          >
            <Copy className="h-3 w-3" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10" 
            onClick={(e) => { e.stopPropagation(); removeNode(node.id); }}
            title="Delete"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      {expanded && hasChildren && (
        <div className="flex flex-col">
          {node.children!.map((child: BuilderNode) => (
            <LayerItem key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export function LayersPanel() {
  const { nodes, selectNode } = useBuilderStore();
  
  if (nodes.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        Canvas is empty.
      </div>
    );
  }
  
  return (
    <div className="flex flex-col gap-1 p-2 h-full overflow-y-auto" onClick={() => selectNode(null)}>
      {nodes.map(node => (
        <LayerItem key={node.id} node={node} />
      ))}
    </div>
  );
}
