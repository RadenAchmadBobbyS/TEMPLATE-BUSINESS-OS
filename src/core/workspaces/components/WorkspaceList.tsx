"use client";

import { useState } from "react";
import { restoreWorkspace, setActiveWorkspace, deleteWorkspace } from "@/core/workspaces/actions";
import { useToast } from "@/shared/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Loader2, Globe, ArchiveRestore, Trash2 } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/shared/ui/motion";
import { CornerMarks } from "@/shared/ui/blueprint";

export function WorkspaceList({ workspaces }: { workspaces: any[] }) {
  const { toast } = useToast();
  const router = useRouter();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleSwitch = async (id: string) => {
    setProcessingId(id);
    try {
      const res = await setActiveWorkspace(id);
      if (res && 'success' in res && !res.success) {
        toast({ title: "Failed to switch", description: res.error, variant: "destructive" });
      } else {
        toast({ title: "Workspace switched" });
        router.push("/dashboard");
      }
    } catch (e: any) {
      toast({ title: "Failed to switch", description: e.message, variant: "destructive" });
    } finally {
      setProcessingId(null);
    }
  };

  const handleRestore = async (id: string) => {
    setProcessingId(id);
    try {
      const res = await restoreWorkspace(id);
      if (res && 'success' in res && !res.success) {
        toast({ title: "Failed to restore", description: res.error, variant: "destructive" });
      } else {
        toast({ title: "Workspace restored" });
        router.refresh();
      }
    } catch (e: any) {
      toast({ title: "Failed to restore", description: e.message, variant: "destructive" });
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to completely delete this workspace? This cannot be undone.")) return;
    setProcessingId(id);
    try {
      const res = await deleteWorkspace(id);
      if (res && 'success' in res && !res.success) {
        toast({ title: "Failed to delete", description: res.error, variant: "destructive" });
      } else {
        toast({ title: "Workspace deleted" });
        router.refresh();
      }
    } catch (e: any) {
      toast({ title: "Failed to delete", description: e.message, variant: "destructive" });
    } finally {
      setProcessingId(null);
    }
  };

  if (workspaces.length === 0) {
    return (
      <FadeIn>
        <Card className="relative rounded-none border-2 border-[var(--ink)] shadow-[4px_4px_0px_var(--ink)]">
          <CornerMarks />
          <CardHeader>
            <CardTitle>No Workspaces</CardTitle>
            <CardDescription>You are not a member of any workspace.</CardDescription>
          </CardHeader>
        </Card>
      </FadeIn>
    );
  }

  return (
    <StaggerContainer className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {workspaces.map((ws) => (
        <StaggerItem key={ws.id}>
          <Card className={`relative flex flex-col h-full rounded-none border-2 border-[var(--ink)] shadow-[4px_4px_0px_var(--ink)] transition-transform hover:-translate-y-1 ${ws.isArchived ? "opacity-75" : ""}`}>
            <CornerMarks />
            <CardHeader>
              <CardTitle className="flex justify-between items-center font-semibold font-display">
                <span className="truncate">{ws.name}</span>
                {ws.isArchived && <Badge variant="destructive">Archived</Badge>}
              </CardTitle>
              <CardDescription style={{ color: "var(--slate)" }}>
                Role: <Badge variant="outline" className="ml-1 rounded-none border-[var(--line)] font-data">{ws.role}</Badge>
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex gap-2 mt-auto">
              {!ws.isArchived ? (
                <Button 
                  className="w-full rounded-none h-10 transition-transform hover:-translate-y-0.5" 
                  style={{ backgroundColor: "var(--signal)", color: "#fff" }}
                  onClick={() => handleSwitch(ws.id)}
                  disabled={processingId !== null}
                >
                  {processingId === ws.id ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Globe className="h-4 w-4 mr-2" />}
                  Switch to
                </Button>
              ) : (
                <>
                  {ws.role === "OWNER" && (
                    <Button 
                      variant="outline" 
                      className="flex-1 rounded-none h-10 border-[var(--ink)] hover:bg-[var(--ink)]/5" 
                      onClick={() => handleRestore(ws.id)}
                      disabled={processingId !== null}
                    >
                      {processingId === ws.id ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ArchiveRestore className="h-4 w-4 mr-2" />}
                      Restore
                    </Button>
                  )}
                  {ws.role === "OWNER" && (
                    <Button 
                      variant="destructive" 
                      className="flex-1 rounded-none h-10" 
                      onClick={() => handleDelete(ws.id)}
                      disabled={processingId !== null}
                    >
                      {processingId === ws.id ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
                      Delete
                    </Button>
                  )}
                  {ws.role !== "OWNER" && (
                    <Button disabled className="w-full rounded-none h-10 border-[var(--line)]" variant="outline">
                      Archived
                    </Button>
                  )}
                </>
              )}
            </CardFooter>
          </Card>
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
