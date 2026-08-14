import { SidebarProvider } from '@/shared/ui/sidebar';
import { AppSidebar } from '@/core/dashboard/components/AppSidebar';
import { AppHeader } from '@/core/dashboard/components/AppHeader';
import { getActiveWorkspace } from '@/core/workspaces/server-context';
import { getUserWorkspaces } from '@/core/workspaces/actions';
import { WorkspaceProvider } from '@/core/workspaces/components/WorkspaceProvider';
import { getImpersonationContext } from '@/core/auth/impersonation';
import { redirect } from 'next/navigation';
import { ShieldAlert } from 'lucide-react';
import { auth } from '@/core/auth/auth';
import { headers } from 'next/headers';
import { prisma } from '@/shared/lib/prisma';
import { Button } from '@/shared/ui/button';
import { GridBackdrop } from '@/shared/ui/blueprint';

type DashboardLayoutParams = {
  templateId?: string;
};

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<DashboardLayoutParams>;
}) {
  const resolvedParams = await params;
  const active = await getActiveWorkspace();
  const allWorkspaces = await getUserWorkspaces();
  const impersonation = await getImpersonationContext();
  const session = await auth.api.getSession({ headers: await headers() });
  let isSuperAdmin = false;
  let segmentLabelMap: Record<string, string> = {};

  if (session) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isSuperAdmin: true },
    });
    isSuperAdmin = user?.isSuperAdmin || false;
  }

  if (resolvedParams?.templateId) {
    const template = await prisma.template.findUnique({
      where: { id: resolvedParams.templateId },
      select: { name: true },
    });

    if (template?.name) {
      segmentLabelMap = {
        [resolvedParams.templateId]: template.name,
      };
    }
  }

  if (!active && allWorkspaces.length === 0) {
    // handled inside the page itself for /workspaces/new
  }

  return (
    <WorkspaceProvider
      initialWorkspace={active?.workspace ?? null}
      initialRole={active?.role ?? null}
      initialCanCreateDelete={active?.canCreateDelete ?? false}
      initialSubscriptionTier={active?.ownerSubscription?.planTier ?? null}
      workspaces={allWorkspaces}
    >
      <SidebarProvider>
        <AppSidebar isSuperAdmin={isSuperAdmin} />
        <div className="flex h-svh flex-1 flex-col overflow-hidden">
          {impersonation && (
            <div
              className="font-data z-50 flex items-center justify-center gap-2 py-2 text-center text-sm font-semibold text-white"
              style={{ backgroundColor: '#DC2626' }}
            >
              <ShieldAlert className="h-4 w-4" />
              You are impersonating {impersonation.user.name}.
              <Button
                size="sm"
                variant="outline"
                className="ml-4 h-6 rounded-none border-white text-xs text-black"
                asChild
              >
                <a href="/api/admin/v1/users/stop-impersonation">Stop Impersonating</a>
              </Button>
            </div>
          )}
          <AppHeader segmentLabelMap={segmentLabelMap} />
          <main
            className="relative flex-1 overflow-auto p-4 md:p-8"
            style={{ backgroundColor: 'var(--paper)' }}
          >
            <GridBackdrop className="opacity-[0.35]" />
            <div className="relative z-10">{children}</div>
          </main>
        </div>
      </SidebarProvider>
    </WorkspaceProvider>
  );
}
