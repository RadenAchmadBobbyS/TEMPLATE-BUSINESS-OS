"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Archive, ArchiveRestore, Loader2, Users, Globe } from "lucide-react";
import { toggleWorkspaceArchive } from "@/core/admin/actions";
import { useToast } from "@/shared/hooks/use-toast";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";

export function WorkspaceTable({ workspaces }: { workspaces: any[] }) {
  const { toast } = useToast();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleToggleArchive = async (workspaceId: string, isArchived: boolean) => {
    setProcessingId(workspaceId);
    try {
      const willArchive = !isArchived;
      await toggleWorkspaceArchive(workspaceId, willArchive);
      toast({ title: willArchive ? "Workspace Suspended" : "Workspace Restored", variant: willArchive ? "destructive" : "default" });
    } catch (error: any) {
      toast({ title: "Action Failed", description: error.message, variant: "destructive" });
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="bg-card border rounded-lg overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
            <tr>
              <th className="px-6 py-4 font-medium">Workspace</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Owner</th>
              <th className="px-6 py-4 font-medium">Stats</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {workspaces.map((ws) => {
              const owner = ws.members[0]?.user;
              return (
                <tr key={ws.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium">{ws.name}</div>
                    <div className="text-xs text-muted-foreground font-mono mt-1">{ws.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={ws.isArchived ? "destructive" : "default"} className={!ws.isArchived ? "bg-green-500/10 text-green-600 hover:bg-green-500/20" : ""}>
                      {ws.isArchived ? "SUSPENDED" : "ACTIVE"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium">{owner?.name || "No Owner"}</div>
                    <div className="text-xs text-muted-foreground">{owner?.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1" title="Members">
                        <Users className="h-3 w-3" /> {ws._count?.members || 0}
                      </div>
                      <div className="flex items-center gap-1" title="Websites">
                        <Globe className="h-3 w-3" /> {ws._count?.websites || 0}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button 
                      variant={ws.isArchived ? "outline" : "destructive"} 
                      size="sm"
                      disabled={processingId === ws.id}
                      onClick={() => handleToggleArchive(ws.id, ws.isArchived)}
                    >
                      {processingId === ws.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : ws.isArchived ? (
                        <><ArchiveRestore className="mr-2 h-4 w-4" /> Restore</>
                      ) : (
                        <><Archive className="mr-2 h-4 w-4" /> Suspend</>
                      )}
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
