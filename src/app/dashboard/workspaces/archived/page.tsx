import { getAllUserWorkspaces } from "@/core/workspaces/actions";
import { StaggerContainer, StaggerItem } from "@/shared/ui/motion";
import { PageHeader } from "@/shared/ui/blueprint";
import { ArchivedWorkspaceCard } from "@/core/workspaces/components/ArchivedWorkspaceCard";
import { ShieldAlert } from "lucide-react";

export default async function ArchivedWorkspacesPage() {
  const allWorkspaces = await getAllUserWorkspaces();
  const archivedWorkspaces = allWorkspaces.filter(ws => ws.isArchived);

  return (
    <StaggerContainer className="space-y-6">
      <StaggerItem>
        <PageHeader
          eyebrow="ARCHIVE"
          title="Archived Workspaces"
          description="View and restore workspaces that have been archived."
        />
      </StaggerItem>

      <StaggerItem>
        {archivedWorkspaces.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-[var(--line)] bg-[var(--paper)] text-center">
            <ShieldAlert className="h-10 w-10 text-[var(--slate)] mb-4" />
            <h3 className="text-lg font-display font-medium text-[var(--ink)]">No archived workspaces</h3>
            <p className="text-sm font-data text-[var(--slate)] mt-1">
              You don't have any archived workspaces.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {archivedWorkspaces.map((ws) => (
              <ArchivedWorkspaceCard key={ws.id} workspace={ws} />
            ))}
          </div>
        )}
      </StaggerItem>
    </StaggerContainer>
  );
}
