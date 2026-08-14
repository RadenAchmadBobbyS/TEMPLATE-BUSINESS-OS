import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarFooter } from "@/shared/ui/sidebar";
import Link from "next/link";
import { Activity, Users, Globe, CreditCard, Settings, ShieldAlert, LogOut, LifeBuoy } from "lucide-react";
import { auth } from "@/core/auth/auth";
import { headers } from "next/headers";
import { prisma } from "@/shared/lib/prisma";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect('/login');
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isSuperAdmin: true }
  });
  if (!user?.isSuperAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--paper)] text-[var(--ink)]">
        <ShieldAlert className="h-16 w-16 text-rose-500 mb-4" />
        <h1 className="text-3xl font-display font-semibold mb-2">Unauthorized Access</h1>
        <p className="text-[var(--slate)] mb-6 text-center max-w-md">
          You do not have the required platform administrator permissions to view this area.
        </p>
        <Link href="/dashboard" className="px-4 py-2 bg-[var(--ink)] text-[var(--paper)] rounded-md font-medium">
          Return to Dashboard
        </Link>
      </div>
    );
  }
  return (
    <SidebarProvider>
      <Sidebar className="border-r" style={{ borderColor: "var(--line)", backgroundColor: "var(--paper)" }}>
        <SidebarHeader className="h-16 flex items-center justify-center border-b px-4" style={{ borderColor: "var(--line)" }}>
          <div className="flex items-center gap-2 font-semibold font-display text-[var(--ink)]">
            <ShieldAlert className="h-5 w-5" style={{ color: "var(--signal)" }} />
            <span>Admin Console</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-[10px] tracking-wider uppercase font-data" style={{ color: "var(--slate)" }}>Platform Analytics</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton className="hover:bg-[rgba(20,23,31,0.04)] rounded-none" render={
                    <Link href="/admin"><Activity className="text-[var(--slate)]" /> <span className="font-display">Overview</span></Link>
                  } />
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel className="text-[10px] tracking-wider uppercase font-data" style={{ color: "var(--slate)" }}>Management</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton className="hover:bg-[rgba(20,23,31,0.04)] rounded-none" render={
                    <Link href="/admin/users"><Users className="text-[var(--slate)]" /> <span className="font-display">Users</span></Link>
                  } />
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton className="hover:bg-[rgba(20,23,31,0.04)] rounded-none" render={
                    <Link href="/admin/workspaces"><Globe className="text-[var(--slate)]" /> <span className="font-display">Workspaces</span></Link>
                  } />
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton className="hover:bg-[rgba(20,23,31,0.04)] rounded-none" render={
                    <Link href="/admin/websites"><Globe className="text-[var(--slate)]" /> <span className="font-display">Websites</span></Link>
                  } />
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton className="hover:bg-[rgba(20,23,31,0.04)] rounded-none" render={
                    <Link href="/admin/billing"><CreditCard className="text-[var(--slate)]" /> <span className="font-display">Billing & Subscriptions</span></Link>
                  } />
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton className="hover:bg-[rgba(20,23,31,0.04)] rounded-none" render={
                    <Link href="/admin/support"><LifeBuoy className="text-[var(--slate)]" /> <span className="font-display">Support Tickets</span></Link>
                  } />
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel className="text-[10px] tracking-wider uppercase font-data" style={{ color: "var(--slate)" }}>System</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton className="hover:bg-[rgba(20,23,31,0.04)] rounded-none" render={
                    <Link href="/admin/settings"><Settings className="text-[var(--slate)]" /> <span className="font-display">Settings & Logs</span></Link>
                  } />
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t p-4" style={{ borderColor: "var(--line)" }}>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="hover:bg-[rgba(20,23,31,0.04)] rounded-none" render={
                <Link href="/dashboard"><LogOut className="rotate-180 text-[var(--slate)]" /> <span className="font-display text-[var(--slate)]">Exit Admin</span></Link>
              } />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <div className="flex flex-1 flex-col overflow-hidden" style={{ backgroundColor: "var(--paper)" }}>
        <header className="sticky top-0 z-50 h-16 flex items-center px-8 border-b w-full" style={{ borderColor: "var(--line)", backgroundColor: "var(--paper)" }}>
          <h1 className="font-semibold text-lg font-display" style={{ color: "var(--ink)" }}>Super Admin Console</h1>
        </header>
        <main className="flex-1 overflow-auto p-8 relative">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
