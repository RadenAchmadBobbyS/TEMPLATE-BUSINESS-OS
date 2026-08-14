"use client";

import Link from "next/link";
import { Monitor, Smartphone, Tablet, ChevronLeft, Play, Undo, Redo, Save, EyeOff, Loader2 } from "lucide-react";
import { useBuilderStore } from "@/core/builder/store";
import { savePageVersion } from "@/core/builder/actions";
import { deployWebsite } from "@/core/hosting/actions";
import { useState, useTransition } from "react";
import { toast } from "@/shared/hooks/use-toast";

import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";

export function TopToolbar({ websiteId = "", pageId = "" }: { websiteId?: string, pageId?: string }) {
  const { deviceMode, setDeviceMode, previewMode, togglePreview, undo, redo, past, future, isDirty, isSaving, setIsSaving, setIsDirty, nodes, isReadOnly } = useBuilderStore();
  const [isPending, startTransition] = useTransition();
  const [isPublishing, setIsPublishing] = useState(false);

  if (previewMode) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <Button variant="default" className="shadow-lg" onClick={togglePreview}>
          <EyeOff className="mr-2 h-4 w-4" /> Exit Preview
        </Button>
      </div>
    );
  }

  const handleSave = () => {
    if (!pageId) return;
    setIsSaving(true);
    
    startTransition(async () => {
      try {
        const rootNode = nodes[0] || { id: "root", type: "Container", props: {}, children: [] };
        
        await savePageVersion(pageId, {
          version: 1,
          root: rootNode
        });
        
        setIsDirty(false);
        toast({ title: "Saved successfully", description: "Your page has been saved." });
      } catch (error) {
        toast({ variant: "destructive", title: "Error saving", description: "Failed to save the page." });
      } finally {
        setIsSaving(false);
      }
    });
  };

  const handlePublish = async () => {
    if (!websiteId) return;
    setIsPublishing(true);
    try {
      const result = await deployWebsite(websiteId);
      if (result.error) {
        toast({ variant: "destructive", title: "Publish Failed", description: result.error });
      } else {
        toast({ title: "Published successfully", description: "Your website is now live." });
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Publish Failed", description: error.message });
    } finally {
      setIsPublishing(false);
    }
  };

  const isSaveLoading = isSaving || isPending;

  return (
    <header className="h-14 border-b bg-[var(--paper)] border-[var(--line)] flex items-center justify-between px-4 shrink-0 z-20 relative">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-none border-2 border-transparent hover:border-[var(--ink)]" asChild>
          <Link href={`/dashboard/websites/${websiteId}/pages`}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <Separator orientation="vertical" className="h-6 bg-[var(--line)]" />
        <span className="text-sm font-bold uppercase tracking-wider font-display">Page Editor</span>
      </div>

      <div className="flex items-center gap-1 bg-[var(--paper)] border border-[var(--line)] rounded-none p-1">
        <Button 
          variant={deviceMode === "desktop" ? "secondary" : "ghost"} 
          size="icon" 
          className={`h-8 w-8 rounded-none ${deviceMode === "desktop" ? "bg-[var(--line)]" : ""}`}
          onClick={() => setDeviceMode("desktop")}
        >
          <Monitor className="h-4 w-4" />
        </Button>
        <Button 
          variant={deviceMode === "tablet" ? "secondary" : "ghost"} 
          size="icon" 
          className={`h-8 w-8 rounded-none ${deviceMode === "tablet" ? "bg-[var(--line)]" : ""}`}
          onClick={() => setDeviceMode("tablet")}
        >
          <Tablet className="h-4 w-4" />
        </Button>
        <Button 
          variant={deviceMode === "mobile" ? "secondary" : "ghost"} 
          size="icon" 
          className={`h-8 w-8 rounded-none ${deviceMode === "mobile" ? "bg-[var(--line)]" : ""}`}
          onClick={() => setDeviceMode("mobile")}
        >
          <Smartphone className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        {!isReadOnly && (
          <>
            <Button variant="ghost" size="icon" className="rounded-none hover:bg-[var(--line)]" onClick={undo} disabled={past.length === 0}>
              <Undo className="h-4 w-4 text-[var(--ink)]" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-none hover:bg-[var(--line)]" onClick={redo} disabled={future.length === 0}>
              <Redo className="h-4 w-4 text-[var(--ink)]" />
            </Button>
          </>
        )}
        {!isReadOnly && (
          <>
            <Separator orientation="vertical" className="h-6 mx-1 bg-[var(--line)]" />
            <Button variant="outline" className="rounded-none border-[var(--ink)] hover:bg-[var(--ink)] hover:text-white transition-colors" onClick={togglePreview}>
              <Play className="mr-2 h-4 w-4" /> Preview
            </Button>
          </>
        )}
        {isReadOnly ? (
          <div className="px-3 py-1.5 text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 ml-2 rounded">
            READ ONLY
          </div>
        ) : (
          <>
            <Button className="rounded-none" style={{ backgroundColor: "var(--signal)", color: "white" }} onClick={handleSave} disabled={!isDirty || isSaveLoading}>
              {isSaveLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {isDirty ? "Save Changes" : "Saved"}
            </Button>
            <Button onClick={handlePublish} disabled={isPublishing || isDirty} variant="secondary" className="rounded-none border-2 border-[var(--ink)] bg-[var(--paper)] text-[var(--ink)] hover:bg-[var(--line)]">
              {isPublishing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Publish
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
