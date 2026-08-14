"use client";

import { useState } from "react";
import { restoreWorkspace, deleteWorkspace } from "@/core/workspaces/actions";
import { useToast } from "@/shared/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Loader2, RefreshCw, Trash2, AlertTriangle } from "lucide-react";
import { CornerMarks } from "@/shared/ui/blueprint";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/ui/alert-dialog";

export function ArchivedWorkspaceCard({ workspace }: { workspace: any }) {
  const [isRestoring, setIsRestoring] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleRestore = async () => {
    setIsRestoring(true);
    try {
      await restoreWorkspace(workspace.id);
      toast({ title: "Workspace Restored", description: `${workspace.name} has been unarchived.` });
    } catch (error: any) {
      toast({ title: "Failed to restore", description: error.message, variant: "destructive" });
    } finally {
      setIsRestoring(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteWorkspace(workspace.id);
      toast({ title: "Workspace Deleted", description: `${workspace.name} has been permanently deleted.` });
    } catch (error: any) {
      toast({ title: "Failed to delete", description: error.message, variant: "destructive" });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="rounded-none border-2 border-[var(--ink)] shadow-[4px_4px_0px_var(--ink)] bg-[var(--paper)] relative flex flex-col justify-between">
      <CornerMarks />
      <CardHeader>
        <CardTitle className="font-display">{workspace.name}</CardTitle>
        <CardDescription style={{ color: "var(--slate)" }}>
          Archived Workspace
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex gap-2 justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRestore} 
          disabled={isRestoring || isDeleting}
          className="rounded-none border-2 border-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--paper)] transition-colors"
        >
          {isRestoring ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          Restore
        </Button>

        <AlertDialog>
          {/* @ts-expect-error asChild is valid for Radix UI primitives but sometimes mistyped */}
          <AlertDialogTrigger asChild>
            <Button 
              variant="destructive" 
              size="sm"
              disabled={isRestoring || isDeleting}
              className="rounded-none border-2 border-red-600 bg-red-600 hover:bg-red-700 hover:border-red-700 transition-colors shadow-[2px_2px_0px_theme(colors.red.800)]"
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-none border-2 border-[var(--ink)] shadow-[4px_4px_0px_var(--ink)] bg-[var(--paper)]">
            <AlertDialogHeader>
              <div className="flex items-center gap-2 text-red-600 mb-2">
                <AlertTriangle className="h-5 w-5" />
                <AlertDialogTitle className="font-display">Delete Permanently?</AlertDialogTitle>
              </div>
              <AlertDialogDescription style={{ color: "var(--slate)" }}>
                This action cannot be undone. This will permanently delete the <strong>{workspace.name}</strong> workspace and remove all associated data, including websites, media, and members.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-none border-2 border-[var(--ink)]">Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete}
                className="rounded-none border-2 border-red-600 bg-red-600 hover:bg-red-700 text-white"
              >
                Delete Permanently
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
