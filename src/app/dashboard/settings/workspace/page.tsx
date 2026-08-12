import { WorkspaceSettingsForm } from "@/core/workspaces/components/WorkspaceSettingsForm";
import { WorkspaceMembersTable } from "@/core/workspaces/components/WorkspaceMembersTable";
import { FadeIn, StaggerContainer, StaggerItem } from "@/shared/ui/motion";

export default function WorkspaceSettingsPage() {
  return (
    <div className="space-y-6">
      <WorkspaceSettingsForm />
      <WorkspaceMembersTable />
    </div>
  );
}
