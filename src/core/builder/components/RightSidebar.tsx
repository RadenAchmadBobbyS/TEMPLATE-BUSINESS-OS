"use client";

import { useBuilderStore } from "@/core/builder/store";
import { Settings2, Trash2, Copy, Monitor, Tablet, Smartphone } from "lucide-react";

import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { Separator } from "@/shared/ui/separator";
import { Textarea } from "@/shared/ui/textarea";
import { Button } from "@/shared/ui/button";

import { ContentProps, LayoutProps, SpacingProps, TypographyProps, ColorsProps, BorderProps } from "./properties/PropertyEditor";

export function RightSidebar() {
  const { nodes, selectedNodeId, deviceMode, previewMode, removeNode, duplicateNode, updateNodeProps } = useBuilderStore();

  if (previewMode) return null;

  // Find selected node deeply
  const findNode = (nodesList: any[], id: string): any => {
    for (const node of nodesList) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findNode(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const selectedNode = selectedNodeId ? findNode(nodes, selectedNodeId) : null;

  return (
    <div className="w-72 border-l bg-[var(--paper)] border-[var(--line)] flex flex-col h-full shrink-0 z-10">
      <div className="p-4 border-b border-[var(--line)] font-semibold text-sm flex items-center justify-between gap-2 uppercase tracking-wider font-data" style={{ color: "var(--slate)" }}>
        <div className="flex items-center gap-2">
          <Settings2 className="h-4 w-4" />
          Property Panel
        </div>
        
        {/* Device mode indicator */}
        <div className="text-muted-foreground flex items-center gap-1 bg-muted p-1 rounded">
          {deviceMode === "desktop" && <Monitor className="w-3 h-3" />}
          {deviceMode === "tablet" && <Tablet className="w-3 h-3" />}
          {deviceMode === "mobile" && <Smartphone className="w-3 h-3" />}
        </div>
      </div>
      
      {!selectedNode ? (
        <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground p-4 text-center">
          Select an element on the canvas to edit its properties.
        </div>
      ) : (
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-bold mb-1 font-display" style={{ color: "var(--ink)" }}>Element: {selectedNode.type}</h3>
                <div className="text-[10px] break-all uppercase tracking-wider font-data" style={{ color: "var(--slate)" }}>
                  ID: {selectedNode.id}
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => duplicateNode(selectedNode.id)}>
                  <Copy className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => removeNode(selectedNode.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <Separator />

            {/* Structured Property Editor */}
            <ContentProps node={selectedNode} />
            <LayoutProps node={selectedNode} deviceMode={deviceMode} />
            <SpacingProps node={selectedNode} deviceMode={deviceMode} />
            <TypographyProps node={selectedNode} deviceMode={deviceMode} />
            <ColorsProps node={selectedNode} deviceMode={deviceMode} />
            <BorderProps node={selectedNode} deviceMode={deviceMode} />

            <Separator />

            <div className="space-y-1.5">
              <Label className="text-xs">Tailwind Classes (Raw)</Label>
              <Textarea 
                className="text-xs min-h-[60px]"
                placeholder="e.g. bg-blue-500 text-white p-4"
                value={selectedNode.props.className || ""} 
                onChange={(e) => updateNodeProps(selectedNode.id, { className: e.target.value })}
              />
            </div>

          </div>
        </ScrollArea>
      )}
    </div>
  );
}
