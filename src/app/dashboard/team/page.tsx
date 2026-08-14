import { redirect } from 'next/navigation';
import { auth } from '@/core/auth/auth';
import { headers } from 'next/headers';
import { getActiveWorkspace } from '@/core/workspaces/server-context';

import { StaggerContainer, StaggerItem } from '@/shared/ui/motion';
import { PageHeader } from '@/shared/ui/blueprint';
import { WorkspaceMembersTable } from '@/core/workspaces/components/WorkspaceMembersTable';
import { hasWorkspacePermission } from '@/core/workspaces/server-context';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/card';
import { ShieldAlert } from 'lucide-react';

export default async function TeamPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect('/login');

  const active = await getActiveWorkspace();

  if (!active) {
    redirect('/dashboard');
  }

  const { workspace, role } = active;

  if (!hasWorkspacePermission(role, "ADMIN")) {
    return (
      <div className="flex flex-1 items-center justify-center p-6 bg-muted/20">
        <Card className="w-full max-w-md border-border shadow-sm">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 bg-destructive/10 p-3 rounded-full w-fit">
              <ShieldAlert className="w-8 h-8 text-destructive" />
            </div>
            <CardTitle className="text-xl">Unauthorized Access</CardTitle>
            <CardDescription>
              You do not have permission to view or manage the team in this workspace.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center text-sm text-muted-foreground pb-6">
            Only Workspace Administrators and Owners can access this page.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <StaggerContainer
      className="relative mx-auto max-w-7xl space-y-6"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      <StaggerItem>
        <PageHeader
          eyebrow="TEAM MANAGEMENT"
          title="Team Members"
          description={
            <>
              Manage members and invitations for{' '}
              <span className="font-medium" style={{ color: 'var(--ink)' }}>
                {workspace.name}
              </span>
              .
            </>
          }
        />
      </StaggerItem>

      <StaggerItem>
        <WorkspaceMembersTable />
      </StaggerItem>
    </StaggerContainer>
  );
}
