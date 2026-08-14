"use client";

import { useState } from "react";
import { Loader2, FolderPlus } from "lucide-react";
import { createFolder } from "@/core/media/actions";
import { useToast } from "@/shared/hooks/use-toast";
import { useWorkspace } from "@/core/workspaces/components/WorkspaceProvider";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Label } from "@/shared/ui/label";

export function CreateFolderModal({ parentId, children }: { parentId?: string, children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const { toast } = useToast();
  const { activeWorkspace } = useWorkspace();

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      const res = await createFolder(name, parentId);
      
      if (!res.success) {
        toast({
          title: "Error",
          description: res.error || "Failed to create folder.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Folder created",
        description: `Successfully created folder "${name}".`,
      });
      setOpen(false);
      setName("");
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={children as React.ReactElement} />
      <DialogContent className="sm:max-w-[425px]">
        {!activeWorkspace ? (
          <>
            <DialogHeader>
              <DialogTitle>Workspace Required</DialogTitle>
              <DialogDescription>
                You need an active workspace to create folders. Please create or switch to a workspace first.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => setOpen(false)}>Close</Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>New Folder</DialogTitle>
              <DialogDescription>
                Create a new directory to organize your assets.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="name">Folder Name</Label>
                <Input 
                  id="name" 
                  placeholder="e.g., Marketing Assets"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading || !name.trim()}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FolderPlus className="mr-2 h-4 w-4" />}
                  Create
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
