import { canCreateWorkspace } from '@/core/workspaces/actions';
import { NewWorkspaceForm } from './new-workspace-form';

export default async function NewWorkspacePage() {
  const quota = await canCreateWorkspace();

  return <NewWorkspaceForm quota={quota} />;
}
