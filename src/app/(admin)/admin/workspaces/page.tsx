import { getAllWorkspaces } from "@/core/admin/actions";
import { WorkspaceTable } from "@/core/admin/components/WorkspaceTable";

export default async function AdminWorkspacesPage() {
  const workspaces = await getAllWorkspaces();

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Global Workspaces</h2>
        <p className="text-muted-foreground mt-1">Manage all tenant workspaces across the platform.</p>
      </div>

      <WorkspaceTable workspaces={workspaces} />
    </div>
  );
}
