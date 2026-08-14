"use client";

import Link from "next/link";
import { Folder as FolderIcon, MoreVertical, Trash2 } from "lucide-react";

import { deleteFolder } from "@/core/media/actions";
import { useToast } from "@/shared/hooks/use-toast";

import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

type Folder = {
  id: string;
  name: string;
};

import { useWorkspace } from "@/core/workspaces/components/WorkspaceProvider";

export function FolderCard({ folder }: { folder: Folder }) {
  const { toast } = useToast();
  const { role, canCreateDelete } = useWorkspace();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link click
    e.stopPropagation();
    try {
      const res = await deleteFolder(folder.id);
      if (!res.success) {
        toast({
          title: "Error",
          description: res.error || "Failed to delete folder.",
          variant: "destructive",
        });
        return;
      }
      toast({ title: "Folder deleted" });
    } catch (error) {
      toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
    }
  };

  return (
    <Link href={`/dashboard/media?folderId=${folder.id}`}>
      <Card className="group flex items-center justify-between p-4 hover:bg-accent/50 transition-colors cursor-pointer border-dashed border-2">
        <div className="flex items-center gap-3">
          <FolderIcon className="h-6 w-6 text-primary fill-primary/20" />
          <span className="font-medium text-sm">{folder.name}</span>
        </div>
        <div onClick={(e) => e.preventDefault()}>
          <DropdownMenu>
            <DropdownMenuTrigger render={
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="h-4 w-4" />
              </Button>
            } />
            <DropdownMenuContent align="end">
              {role === 'OWNER' || role === 'ADMIN' || canCreateDelete ? (
                <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem disabled>
                  <Trash2 className="mr-2 h-4 w-4" /> Delete (Restricted)
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>
    </Link>
  );
}
