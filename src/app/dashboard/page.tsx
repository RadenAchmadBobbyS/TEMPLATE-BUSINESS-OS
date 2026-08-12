import Link from 'next/link';
import { auth } from '@/core/auth/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getActiveWorkspace } from '@/core/workspaces/server-context';
import { prisma } from '@/shared/lib/prisma';

import {
  Globe,
  Users,
  CreditCard,
  LifeBuoy,
  Image as ImageIcon,
  ArrowRight,
  Plus,
  Building2,
  LayoutTemplate,
} from 'lucide-react';

import { formatDistanceToNow } from 'date-fns';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/shared/ui/card';

import { Button } from '@/shared/ui/button';
import { FadeIn, StaggerContainer, StaggerItem } from '@/shared/ui/motion';

import { CornerMarks, PageHeader } from '@/shared/ui/blueprint';

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/login');
  }

  const active = await getActiveWorkspace();

  /**
   * New users may not have a workspace yet.
   *
   * Dashboard should still be accessible in this state.
   * Instead of redirecting or throwing an error, show an
   * empty state and let the user create their first workspace.
   */
  if (!active) {
    return (
      <StaggerContainer
        className="mx-auto max-w-7xl space-y-8"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {/* Header */}
        <StaggerItem>
          <PageHeader
            eyebrow="WORKSPACE OVERVIEW"
            title="Welcome to your dashboard"
            description="You're all set. Create your first workspace to start building and managing your websites."
          />
        </StaggerItem>

        {/* Empty State */}
        <StaggerItem>
          <Card
            className="relative overflow-hidden rounded-none border-2 bg-[var(--paper)]"
            style={{
              borderColor: 'var(--ink)',
              boxShadow: '6px 6px 0px var(--ink)',
            }}
          >
            <CornerMarks />

            {/* Blueprint decoration */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-[0.035]"
              style={{
                backgroundImage: `
                  linear-gradient(var(--ink) 1px, transparent 1px),
                  linear-gradient(90deg, var(--ink) 1px, transparent 1px)
                `,
                backgroundSize: '32px 32px',
              }}
            />

            <CardContent className="relative flex min-h-[420px] flex-col items-center justify-center px-6 py-16 text-center sm:px-10">
              {/* Icon */}
              <FadeIn>
                <div
                  className="mb-8 flex h-20 w-20 items-center justify-center border-2"
                  style={{
                    borderColor: 'var(--ink)',
                    backgroundColor: 'var(--paper)',
                    boxShadow: '4px 4px 0px var(--ink)',
                  }}
                >
                  <Building2
                    className="h-9 w-9"
                    style={{ color: 'var(--signal)' }}
                    strokeWidth={1.5}
                  />
                </div>
              </FadeIn>

              {/* Status */}
              <FadeIn>
                <div
                  className="font-data mb-3 flex items-center gap-2 text-[11px] tracking-wider"
                  style={{ color: 'var(--slate)' }}
                >
                  <span className="h-1.5 w-1.5" style={{ backgroundColor: 'var(--amber)' }} />
                  NO ACTIVE WORKSPACE
                </div>
              </FadeIn>

              {/* Title */}
              <FadeIn>
                <h3
                  className="font-display text-2xl font-semibold tracking-tight sm:text-3xl"
                  style={{ color: 'var(--ink)' }}
                >
                  Create your first workspace
                </h3>
              </FadeIn>

              {/* Description */}
              <FadeIn>
                <p className="mt-3 max-w-lg text-sm leading-6" style={{ color: 'var(--slate)' }}>
                  A workspace is where your websites, team members, media, and business projects
                  live. Create one to get started.
                </p>
              </FadeIn>

              {/* Action */}
              <FadeIn>
                <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
                  <Button
                    asChild
                    className="h-11 rounded-none px-5 text-sm font-medium transition-transform hover:-translate-y-0.5"
                    style={{
                      backgroundColor: 'var(--signal)',
                      color: '#fff',
                    }}
                  >
                    <Link href="/dashboard/workspaces/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Workspace
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    asChild
                    className="h-11 rounded-none border-[var(--ink)] px-5 text-sm font-medium hover:bg-black/5"
                  >
                    <Link href="/dashboard/templates">
                      <LayoutTemplate className="mr-2 h-4 w-4" />
                      Browse Templates
                    </Link>
                  </Button>
                </div>
              </FadeIn>
            </CardContent>

            {/* Technical footer */}
            <div
              className="relative flex flex-col gap-2 border-t px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
              style={{ borderColor: 'var(--line)' }}
            >
              <span
                className="font-data text-[10px] tracking-wider"
                style={{ color: 'var(--slate)' }}
              >
                WORKSPACE STATUS
              </span>

              <span
                className="font-data flex items-center gap-2 text-[10px]"
                style={{ color: 'var(--slate)' }}
              >
                <span className="h-1.5 w-1.5" style={{ backgroundColor: 'var(--amber)' }} />
                SETUP REQUIRED
              </span>
            </div>
          </Card>
        </StaggerItem>

        {/* Helpful next steps */}
        <StaggerItem className="grid gap-4 md:grid-cols-3">
          <Card
            className="relative rounded-none border-2 bg-[var(--paper)]"
            style={{
              borderColor: 'var(--ink)',
              boxShadow: '4px 4px 0px var(--ink)',
            }}
          >
            <CornerMarks />

            <CardHeader>
              <div
                className="mb-2 flex h-9 w-9 items-center justify-center border"
                style={{
                  borderColor: 'var(--ink)',
                  color: 'var(--signal)',
                }}
              >
                <Building2 className="h-4 w-4" />
              </div>

              <CardTitle className="font-display text-base" style={{ color: 'var(--ink)' }}>
                01. Create Workspace
              </CardTitle>

              <CardDescription style={{ color: 'var(--slate)' }}>
                Set up the workspace where your projects will live.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card
            className="relative rounded-none border-2 bg-[var(--paper)]"
            style={{
              borderColor: 'var(--ink)',
              boxShadow: '4px 4px 0px var(--ink)',
            }}
          >
            <CornerMarks />

            <CardHeader>
              <div
                className="mb-2 flex h-9 w-9 items-center justify-center border"
                style={{
                  borderColor: 'var(--ink)',
                  color: 'var(--signal)',
                }}
              >
                <LayoutTemplate className="h-4 w-4" />
              </div>

              <CardTitle className="font-display text-base" style={{ color: 'var(--ink)' }}>
                02. Choose a Template
              </CardTitle>

              <CardDescription style={{ color: 'var(--slate)' }}>
                Start faster with a pre-built website foundation.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card
            className="relative rounded-none border-2 bg-[var(--paper)]"
            style={{
              borderColor: 'var(--ink)',
              boxShadow: '4px 4px 0px var(--ink)',
            }}
          >
            <CornerMarks />

            <CardHeader>
              <div
                className="mb-2 flex h-9 w-9 items-center justify-center border"
                style={{
                  borderColor: 'var(--ink)',
                  color: 'var(--signal)',
                }}
              >
                <Globe className="h-4 w-4" />
              </div>

              <CardTitle className="font-display text-base" style={{ color: 'var(--ink)' }}>
                03. Build Your Website
              </CardTitle>

              <CardDescription style={{ color: 'var(--slate)' }}>
                Create, customize, and publish your first website.
              </CardDescription>
            </CardHeader>
          </Card>
        </StaggerItem>
      </StaggerContainer>
    );
  }

  const { workspace } = active;

  const [websitesCount, membersCount, recentWebsites] = await Promise.all([
    prisma.website.count({
      where: {
        workspaceId: workspace.id,
        deletedAt: null,
      },
    }),

    prisma.userRole.count({
      where: {
        workspaceId: workspace.id,
      },
    }),

    prisma.website.findMany({
      where: {
        workspaceId: workspace.id,
        deletedAt: null,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: 3,
    }),
  ]);

  return (
    <StaggerContainer
      className="mx-auto max-w-7xl space-y-8"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      {/* Header */}
      <StaggerItem>
        <PageHeader
          eyebrow="WORKSPACE OVERVIEW"
          title="Overview"
          description={
            <>
              Welcome back, {session.user.name || session.user.email}. Here's what's happening in{' '}
              <span className="font-medium" style={{ color: 'var(--ink)' }}>
                {workspace.name}
              </span>
              .
            </>
          }
          actions={
            <>
              <Button
                asChild
                className="h-10 rounded-none px-4 text-sm font-medium transition-transform hover:-translate-y-0.5"
                style={{
                  backgroundColor: 'var(--signal)',
                  color: '#fff',
                }}
              >
                <Link href="/dashboard/websites">
                  <Plus className="mr-2 h-4 w-4" />
                  New Website
                </Link>
              </Button>

              <Button
                variant="outline"
                asChild
                className="h-10 rounded-none border-[var(--ink)] px-4 text-sm font-medium hover:bg-black/5"
              >
                <Link href="/dashboard/media">
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Media Library
                </Link>
              </Button>

              <Button
                variant="outline"
                asChild
                className="h-10 rounded-none border-[var(--ink)] px-4 text-sm font-medium hover:bg-black/5"
              >
                <Link href="/dashboard/billing">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Billing
                </Link>
              </Button>

              <Button
                variant="outline"
                asChild
                className="h-10 rounded-none border-[var(--ink)] px-4 text-sm font-medium hover:bg-black/5"
              >
                <Link href="/dashboard/support/new">
                  <LifeBuoy className="mr-2 h-4 w-4" />
                  Support Ticket
                </Link>
              </Button>
            </>
          }
        />
      </StaggerItem>

      {/* Stats Grid */}
      <StaggerItem className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card
          className="relative rounded-none border-2 bg-[var(--paper)] transition-transform hover:-translate-y-1"
          style={{
            borderColor: 'var(--ink)',
            boxShadow: '4px 4px 0px var(--ink)',
          }}
        >
          <CornerMarks />

          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle
              className="font-data text-xs font-medium tracking-wider uppercase"
              style={{ color: 'var(--slate)' }}
            >
              Active Websites
            </CardTitle>

            <Globe className="h-4 w-4" style={{ color: 'var(--signal)' }} />
          </CardHeader>

          <CardContent>
            <div className="font-display text-3xl font-semibold" style={{ color: 'var(--signal)' }}>
              {websitesCount}
            </div>

            <p className="mt-1 text-xs" style={{ color: 'var(--slate)' }}>
              Currently hosted projects
            </p>
          </CardContent>
        </Card>

        <Card
          className="relative rounded-none border-2 bg-[var(--paper)] transition-transform hover:-translate-y-1"
          style={{
            borderColor: 'var(--ink)',
            boxShadow: '4px 4px 0px var(--ink)',
          }}
        >
          <CornerMarks />

          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle
              className="font-data text-xs font-medium tracking-wider uppercase"
              style={{ color: 'var(--slate)' }}
            >
              Team Members
            </CardTitle>

            <Users className="h-4 w-4" style={{ color: 'var(--signal)' }} />
          </CardHeader>

          <CardContent>
            <div className="font-display text-3xl font-semibold" style={{ color: 'var(--signal)' }}>
              {membersCount}
            </div>

            <p className="mt-1 text-xs" style={{ color: 'var(--slate)' }}>
              Active in this workspace
            </p>
          </CardContent>
        </Card>
      </StaggerItem>

      {/* Recent Activity */}
      <StaggerItem className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card
          className="relative col-span-4 flex flex-col rounded-none border-2 bg-[var(--paper)]"
          style={{
            borderColor: 'var(--ink)',
            boxShadow: '4px 4px 0px var(--ink)',
          }}
        >
          <CornerMarks />

          <CardHeader>
            <CardTitle className="font-display" style={{ color: 'var(--ink)' }}>
              Recent Websites
            </CardTitle>

            <CardDescription style={{ color: 'var(--slate)' }}>
              Projects you recently updated in {workspace.name}.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex-1">
            {recentWebsites.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Globe className="mb-4 h-10 w-10 opacity-20" />

                <p style={{ color: 'var(--ink)' }}>No websites found.</p>

                <p className="text-sm" style={{ color: 'var(--slate)' }}>
                  Create your first website to get started.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentWebsites.map((website) => (
                  <div
                    key={website.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    style={{ borderColor: 'var(--line)' }}
                  >
                    <div>
                      <p className="font-medium" style={{ color: 'var(--ink)' }}>
                        {website.name}
                      </p>

                      <p className="font-data text-xs" style={{ color: 'var(--slate)' }}>
                        Updated{' '}
                        {formatDistanceToNow(new Date(website.updatedAt), { addSuffix: true })}
                      </p>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="rounded-none hover:bg-black/5"
                      style={{ color: 'var(--signal)' }}
                    >
                      <Link href={`/dashboard/websites/${website.id}/pages`}>
                        Manage
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>

          {recentWebsites.length > 0 && (
            <CardFooter className="border-t pt-4" style={{ borderColor: 'var(--line)' }}>
              <Button
                variant="outline"
                className="w-full rounded-none border-[var(--ink)] hover:bg-black/5"
                asChild
              >
                <Link href="/dashboard/websites">View All Websites</Link>
              </Button>
            </CardFooter>
          )}
        </Card>
      </StaggerItem>
    </StaggerContainer>
  );
}
