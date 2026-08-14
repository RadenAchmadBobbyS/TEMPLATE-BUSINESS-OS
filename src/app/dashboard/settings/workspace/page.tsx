import { getActiveWorkspace } from "@/core/workspaces/server-context";
import { WorkspaceSettingsForm } from "@/core/workspaces/components/WorkspaceSettingsForm";
import { WorkspaceMembersTable } from "@/core/workspaces/components/WorkspaceMembersTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { CornerMarks } from "@/shared/ui/blueprint";
import { ShieldAlert } from "lucide-react";

export default async function WorkspaceSettingsPage() {
  const active = await getActiveWorkspace();

  if (!active) {
    return (
      <div className="space-y-6">
        <Card className="rounded-none border-2 border-[var(--ink)] shadow-[4px_4px_0px_var(--ink)] bg-[var(--paper)] relative">
          <CornerMarks />
          <CardHeader>
            <div className="flex items-center gap-2 text-amber-600 mb-2">
              <ShieldAlert className="h-5 w-5" />
              <CardTitle className="font-display">Workspace Required</CardTitle>
            </div>
            <CardDescription style={{ color: "var(--slate)" }}>
              You do not have an active workspace selected. 
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-data">
              Please create a new workspace or select an existing one from the sidebar switcher to manage its settings, members, and billing details.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (active.role === "EDITOR") {
    return (
      <div className="space-y-6">
        <Card className="rounded-none border-2 border-red-600 shadow-[4px_4px_0px_theme(colors.red.600)] bg-[var(--paper)] relative">
          <CornerMarks />
          <CardHeader>
            <div className="flex items-center gap-2 text-red-600 mb-2">
              <ShieldAlert className="h-5 w-5" />
              <CardTitle className="font-display">Unauthorized Access</CardTitle>
            </div>
            <CardDescription className="text-red-600/70">
              You do not have permission to view workspace settings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-data text-[var(--slate)]">
              This page is restricted to Workspace Admins and Owners.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <WorkspaceSettingsForm />
      <WorkspaceMembersTable />
    </div>
  );
}
