"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Shield, ShieldAlert, ShieldCheck, Loader2, UserCog } from "lucide-react";

import { toggleUserBan } from "@/core/admin/actions";
import { useToast } from "@/shared/hooks/use-toast";

import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";

export function UserTable({ users }: { users: any[] }) {
  const { toast } = useToast();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleToggleBan = async (userId: string, currentStatus: string) => {
    setProcessingId(userId);
    try {
      const isBanning = currentStatus !== "BANNED";
      await toggleUserBan(userId, isBanning);
      toast({ title: isBanning ? "User Banned" : "User Unbanned", variant: isBanning ? "destructive" : "default" });
    } catch (error: any) {
      toast({ title: "Action Failed", description: error.message, variant: "destructive" });
    } finally {
      setProcessingId(null);
    }
  };

  const handleImpersonate = async (userId: string) => {
    setProcessingId(userId);
    try {
      const res = await fetch(`/api/admin/v1/users/${userId}/impersonate`, { method: "POST" });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to impersonate");
      }
      toast({ title: "Impersonation started", description: "Redirecting to dashboard..." });
      window.location.href = "/dashboard";
    } catch (error: any) {
      toast({ title: "Impersonation Failed", description: error.message, variant: "destructive" });
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
              <th className="px-6 py-4 font-medium">User</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Joined</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {user.name} 
                        {user.isSuperAdmin && <span title="Super Admin"><ShieldAlert className="h-3 w-3 text-rose-500" /></span>}
                      </div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={user.status === "ACTIVE" ? "default" : "destructive"} className={user.status === "ACTIVE" ? "bg-green-500/10 text-green-600 hover:bg-green-500/20" : ""}>
                    {user.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {format(new Date(user.createdAt), "MMM d, yyyy")}
                </td>
                <td className="px-6 py-4 text-right">
                  <Button 
                    variant={user.status === "BANNED" ? "outline" : "destructive"} 
                    size="sm"
                    disabled={user.isSuperAdmin || processingId === user.id}
                    onClick={() => handleToggleBan(user.id, user.status)}
                  >
                    {processingId === user.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : user.status === "BANNED" ? (
                      <><ShieldCheck className="mr-2 h-4 w-4" /> Unban</>
                    ) : (
                      <><Shield className="mr-2 h-4 w-4" /> Ban</>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="ml-2"
                    disabled={user.isSuperAdmin || processingId === user.id}
                    onClick={() => handleImpersonate(user.id)}
                  >
                    <UserCog className="mr-2 h-4 w-4" /> Impersonate
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
