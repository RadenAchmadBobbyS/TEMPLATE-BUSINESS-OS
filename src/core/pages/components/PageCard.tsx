"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, Edit2, FileText, Globe, Home, Lock, MoreVertical, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { deletePage, duplicatePage, togglePublishState, setHomepage, reorderPage } from "@/core/pages/actions";
import { useToast } from "@/shared/hooks/use-toast";

import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { PageSettingsModal } from "./PageSettingsModal";
import { Switch } from "@/shared/ui/switch";

export function PageCard({ page, level = 0, role }: { page: any; level?: number; role?: string }) {
  const { toast } = useToast();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const isHomepage = page.slug === "/";
  const is404 = page.slug === "/404";
  const isPasswordProtected = page.settings?.security?.isPasswordProtected;

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this page?")) {
      try {
        await deletePage(page.id);
        toast({ title: "Page deleted" });
      } catch (error: any) {
        toast({ title: "Delete Failed", description: error.message, variant: "destructive" });
      }
    }
  };

  const handleDuplicate = async () => {
    try {
      await duplicatePage(page.id);
      toast({ title: "Page duplicated" });
    } catch {
      toast({ title: "Failed to duplicate", variant: "destructive" });
    }
  };

  const handleTogglePublish = async () => {
    setIsPublishing(true);
    try {
      await togglePublishState(page.id, !page.isPublished);
      toast({ title: page.isPublished ? "Page drafted" : "Page published" });
    } catch {
      toast({ title: "Status update failed", variant: "destructive" });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSetHomepage = async () => {
    try {
      await setHomepage(page.id);
      toast({ title: "Homepage updated" });
    } catch (error: any) {
      toast({ title: "Failed to set homepage", description: error.message, variant: "destructive" });
    }
  };

  const handleReorder = async (direction: "up" | "down") => {
    try {
      const res = await reorderPage(page.id, direction);
      if (!res.success) {
        toast({ title: "Notice", description: res.message });
      }
    } catch (error: any) {
      toast({ title: "Failed to reorder", description: error.message, variant: "destructive" });
    }
  };

  return (
    <>
      <div 
        className="flex items-center justify-between p-4 bg-background border rounded-lg hover:shadow-sm transition-all"
        style={{ marginLeft: `${level * 2}rem` }}
      >
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-muted rounded-md flex items-center justify-center">
            {isHomepage ? <Home className="h-5 w-5 text-primary" /> : <FileText className="h-5 w-5 text-muted-foreground" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold">{page.title}</h4>
              {isHomepage && <Badge variant="secondary" className="text-xs">Homepage</Badge>}
              {is404 && <Badge variant="outline" className="text-xs border-destructive text-destructive">404</Badge>}
              {isPasswordProtected && <Lock className="h-3 w-3 text-amber-500" />}
            </div>
            <p className="text-sm text-muted-foreground font-mono mt-1">{page.slug}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 mr-4">
              <span className="text-xs text-muted-foreground font-medium">
                {page.isPublished ? "Published" : "Draft"}
              </span>
              <Switch 
                checked={page.isPublished} 
                onChange={handleTogglePublish}
                disabled={isPublishing}
              />
            </div>

              <Button render={
                <Link href={`/builder/${page.websiteId}/${page.id}`}>
                  <Edit2 className="mr-2 h-4 w-4" /> Edit Canvas
                </Link>
              } variant="default" size="sm" />

              <DropdownMenu>
                <DropdownMenuTrigger render={
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                } />
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsSettingsOpen(true)}>
                    <Globe className="mr-2 h-4 w-4" /> Page Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem render={
                    <Link href={`/dashboard/websites/${page.websiteId}/pages/${page.id}/seo`}>
                      <Globe className="mr-2 h-4 w-4 text-blue-500" /> Advanced SEO
                    </Link>
                  } />
                  {!isHomepage && (
                    <DropdownMenuItem onClick={handleSetHomepage}>
                      <Home className="mr-2 h-4 w-4" /> Set as Homepage
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleReorder("up")}>
                    <ArrowUp className="mr-2 h-4 w-4" /> Move Up
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleReorder("down")}>
                    <ArrowDown className="mr-2 h-4 w-4" /> Move Down
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleDuplicate}>
                    <Copy className="mr-2 h-4 w-4" /> Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleDelete} 
                    className="text-destructive focus:text-destructive"
                    disabled={isHomepage}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
        </div>
      </div>

      <PageSettingsModal page={page} open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </>
  );
}
