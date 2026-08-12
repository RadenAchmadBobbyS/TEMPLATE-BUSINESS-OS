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

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const active = await getActiveWorkspace();
  const allWorkspaces = await getUserWorkspaces();
  const impersonation = await getImpersonationContext();
  const session = await auth.api.getSession({ headers: await headers() });
  let isSuperAdmin = false;
  
  if (session) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isSuperAdmin: true }
    });
    isSuperAdmin = user?.isSuperAdmin || false;
  }

  if (!active && allWorkspaces.length === 0) {
    // handled inside the page itself for /workspaces/new
  }

  return (
    <WorkspaceProvider
      initialWorkspace={active?.workspace ?? null}
      initialRole={active?.role ?? null}
      workspaces={allWorkspaces}
    >
      <SidebarProvider>
        <AppSidebar isSuperAdmin={isSuperAdmin} />
        <div className="flex flex-1 flex-col overflow-hidden h-svh">
          {impersonation && (
            <div
              className="z-50 flex items-center justify-center gap-2 py-2 text-center text-sm font-semibold text-white font-data" style={{ backgroundColor: '#DC2626' }}
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
          <AppHeader />
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
