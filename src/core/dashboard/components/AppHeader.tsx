'use client';

import * as React from 'react';
import { SidebarTrigger } from '@/shared/ui/sidebar';
import { Separator } from '@/shared/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shared/ui/breadcrumb';

import { ThemeToggle } from './ThemeToggle';
import { UserNav } from './UserNav';
import { NotificationNav } from '@/core/notifications/components/NotificationNav';
import { usePathname } from 'next/navigation';

export function AppHeader() {
  const pathname = usePathname();

  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = segments.map((segment, index) => {
    const url = `/${segments.slice(0, index + 1).join('/')}`;
    const isLast = index === segments.length - 1;
    const title = segment.charAt(0).toUpperCase() + segment.slice(1);
    return { title, url, isLast };
  });

  return (
    <header
      className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b px-4 w-full"
      style={{ backgroundColor: 'var(--paper)', borderColor: 'var(--line)' }}
    >
      <div className="flex flex-1 items-center gap-2 px-3">
        <SidebarTrigger className="-ml-3 rounded-none hover:bg-[rgba(20,23,31,0.05)]" />
        <Separator
          orientation="vertical"
          className="mt-1.5 mr-2 h-4"
          style={{ backgroundColor: 'var(--line)' }}
        />
        <Breadcrumb>
          <BreadcrumbList className="font-data -ml-2" style={{ fontSize: '14px' }}>
            <BreadcrumbItem className="hidden md:block"></BreadcrumbItem>
            {breadcrumbs.map((crumb, i) => (
              <React.Fragment key={crumb.url}>
                <BreadcrumbItem className="hidden md:block">
                  {crumb.isLast ? (
                    <BreadcrumbPage style={{ color: 'var(--ink)', fontWeight: 500 }}>
                      {crumb.title}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={crumb.url} style={{ color: 'var(--slate)' }}>
                      {crumb.title}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!crumb.isLast && (
                  <BreadcrumbSeparator
                    className="hidden md:block"
                    style={{ color: 'var(--line)' }}
                  />
                )}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex items-center gap-1">
        <ThemeToggle />
        <NotificationNav />
        <Separator
          orientation="vertical"
          className="mx-2 mt-1.5 h-5"
          style={{ backgroundColor: 'var(--line)' }}
        />
        <UserNav />
      </div>
    </header>
  );
}
