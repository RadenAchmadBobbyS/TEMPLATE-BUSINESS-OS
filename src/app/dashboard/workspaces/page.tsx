import { getAllUserWorkspaces } from "@/core/workspaces/actions";
import { WorkspaceList } from "@/core/workspaces/components/WorkspaceList";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { FadeIn } from "@/shared/ui/motion";

export const metadata = {
  title: "Workspaces | BusinessOS",
};

export default async function WorkspacesPage() {
  const workspaces = await getAllUserWorkspaces();

  return (
    <FadeIn className="container max-w-5xl py-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workspaces</h1>
          <p className="text-muted-foreground mt-2">
            Manage all your active and archived workspaces.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/workspaces/new">
            <Plus className="mr-2 h-4 w-4" />
            New Workspace
          </Link>
        </Button>
      </div>
      
      <WorkspaceList workspaces={workspaces} />
    </FadeIn>
  );
}
