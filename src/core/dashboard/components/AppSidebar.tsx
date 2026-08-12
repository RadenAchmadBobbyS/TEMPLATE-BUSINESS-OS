'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Globe,
  Layers,
  Settings,
  LifeBuoy,
  CreditCard,
  Shield,
  Image as ImageIcon,
} from 'lucide-react';
import { WorkspaceSwitcher } from '@/core/workspaces/components/WorkspaceSwitcher';
import { BlueprintLogo } from '@/shared/ui/blueprint';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/ui/sidebar';

const data = {
  navMain: [
    { title: 'Overview', url: '/dashboard', icon: LayoutDashboard, exact: true },
    { title: 'Websites', url: '/dashboard/websites', icon: Globe },
    { title: 'Templates', url: '/dashboard/templates', icon: Layers },
    { title: 'Media', url: '/dashboard/media', icon: ImageIcon },
  ],
  navSecondary: [
    { title: 'Support', url: '/dashboard/support', icon: LifeBuoy },
    { title: 'Billing', url: '/dashboard/billing', icon: CreditCard },
    { title: 'Settings', url: '/dashboard/settings/workspace', icon: Settings },
    { title: 'Admin Panel', url: '/admin', icon: Shield },
  ],
};

const menuButtonClass =
  'rounded-none border-l-2 border-transparent transition-colors ' +
  'hover:bg-[rgba(20,23,31,0.04)] ' +
  'data-[active=true]:border-[var(--signal)] data-[active=true]:bg-[rgba(36,81,255,0.07)] data-[active=true]:font-medium data-[active=true]:text-[var(--ink)] ' +
  'data-[active=true]:hover:bg-[rgba(36,81,255,0.1)]';

export function AppSidebar({ isSuperAdmin }: { isSuperAdmin?: boolean }) {
  const pathname = usePathname();

  const isActive = (url: string, exact?: boolean) => {
    if (exact) return pathname === url;
    return pathname === url || pathname.startsWith(url + '/');
  };

  const navSecondary = data.navSecondary.filter(
    (item) => item.title !== 'Admin Panel' || isSuperAdmin
  );

  return (
    <Sidebar
      className="border-r"
      style={{ borderColor: 'var(--line)', backgroundColor: 'var(--paper)' }}
    >
      <SidebarHeader
        className="flex h-16 items-center justify-center border-b px-4"
        style={{ borderColor: 'var(--line)' }}
      >
        <div className="flex w-full items-center justify-between">
          <BlueprintLogo className="origin-left scale-75" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel
            className="font-data text-[10px] tracking-wider uppercase"
            style={{ color: 'var(--slate)' }}
          >
            Platform
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    render={<Link href={item.url} />}
                    isActive={isActive(item.url, item.exact)}
                    className={menuButtonClass}
                  >
                    <item.icon />
                    <span className="font-display">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel
            className="font-data text-[10px] tracking-wider uppercase"
            style={{ color: 'var(--slate)' }}
          >
            Account
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navSecondary.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    render={<Link href={item.url} />}
                    isActive={isActive(item.url)}
                    className={menuButtonClass}
                  >
                    <item.icon />
                    <span className="font-display">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-4" style={{ borderColor: 'var(--line)' }}>
        <p className="font-data text-[10px]" style={{ color: 'var(--slate)' }}>
          &copy; {new Date().getFullYear()} BusinessOS
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
