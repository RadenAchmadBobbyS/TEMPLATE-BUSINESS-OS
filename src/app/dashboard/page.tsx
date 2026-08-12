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

import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { FadeIn, StaggerContainer, StaggerItem } from '@/shared/ui/motion';
import { CornerMarks, PageHeader } from '@/shared/ui/blueprint';

// deterministic gradient per website tile — visual identity, not fake data
const tileGradients = [
  ['var(--signal)', 'var(--amber)'],
  ['var(--amber)', 'var(--signal)'],
  ['var(--ink)', 'var(--signal)'],
];

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect('/login');

  const active = await getActiveWorkspace();

  if (!active) {
    return (
      <StaggerContainer
        className="relative mx-auto max-w-7xl space-y-8"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        <StaggerItem>
          <PageHeader
            eyebrow="WORKSPACE OVERVIEW"
            title="Welcome to your dashboard"
            description="You're all set. Create your first workspace to start building and managing your websites."
          />
        </StaggerItem>

        <StaggerItem className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
          {/* Left: floating stacked mockup illustration instead of another box */}
          <div className="relative hidden h-72 lg:block">
            <div className="pointer-events-none absolute top-6 left-10 h-56 w-56 rounded-full bg-[var(--signal)]/10 blur-3xl" />
            <div className="pointer-events-none absolute right-6 bottom-0 h-48 w-48 rounded-full bg-[var(--amber)]/10 blur-3xl" />

            <div className="absolute top-8 left-6 w-56 -rotate-6 border-2 border-[var(--ink)] bg-[var(--paper)] p-3 shadow-[6px_6px_0px_var(--ink)]">
              <div className="mb-2 flex gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[var(--ink)]/15" />
                <span className="h-2 w-2 rounded-full bg-[var(--ink)]/15" />
                <span className="h-2 w-2 rounded-full bg-[var(--ink)]/15" />
              </div>
              <div className="h-2 w-3/4 bg-[var(--ink)]/10" />
              <div className="mt-1.5 h-2 w-1/2 bg-[var(--ink)]/10" />
              <div className="mt-3 h-16 w-full bg-[var(--line)]" />
            </div>

            <div className="absolute top-0 left-24 w-56 rotate-3 border-2 border-[var(--ink)] bg-[var(--paper)] p-3 shadow-[8px_8px_0px_var(--ink)]">
              <div className="mb-2 flex gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[var(--amber)]" />
                <span className="h-2 w-2 rounded-full bg-[var(--signal)]" />
                <span className="h-2 w-2 rounded-full bg-[var(--ink)]/15" />
              </div>
              <div className="h-2 w-2/3 bg-[var(--ink)]/15" />
              <div className="mt-1.5 h-2 w-1/3 bg-[var(--ink)]/10" />
              <div className="mt-3 h-16 w-full bg-gradient-to-br from-[var(--signal)]/20 to-[var(--amber)]/15" />
            </div>

            <div className="absolute top-2 right-2 flex items-center gap-1.5 border-2 border-[var(--ink)] bg-[var(--paper)] px-2.5 py-1.5 shadow-[4px_4px_0px_var(--ink)]">
              <Globe className="h-3.5 w-3.5 text-[var(--signal)]" />
              <span className="font-data text-[10px] font-bold tracking-wider text-[var(--ink)] uppercase">
                Live
              </span>
            </div>
            <div className="absolute bottom-10 left-0 flex items-center gap-1.5 border-2 border-[var(--ink)] bg-[var(--paper)] px-2.5 py-1.5 shadow-[4px_4px_0px_var(--ink)]">
              <LayoutTemplate className="h-3.5 w-3.5 text-[var(--amber)]" />
              <span className="font-data text-[10px] font-bold tracking-wider text-[var(--ink)] uppercase">
                Template ready
              </span>
            </div>
          </div>

          {/* Right: headline + CTA, no heavy box */}
          <FadeIn>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5" style={{ backgroundColor: 'var(--amber)' }} />
              <span
                className="font-data text-[11px] tracking-wider"
                style={{ color: 'var(--slate)' }}
              >
                NO ACTIVE WORKSPACE
              </span>
            </div>
            <h3 className="font-display mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)] sm:text-4xl">
              Create your first workspace
            </h3>
            <p className="mt-3 max-w-md text-sm leading-6" style={{ color: 'var(--slate)' }}>
              A workspace is where your websites, team members, media, and business projects live.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button
                asChild
                className="h-11 rounded-none px-5 text-sm font-medium transition-transform hover:-translate-y-0.5"
                style={{ backgroundColor: 'var(--signal)', color: '#fff' }}
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

            <div className="mt-8 flex items-center gap-6">
              {['Create', 'Choose template', 'Publish'].map((step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <span
                    className="font-data flex h-6 w-6 items-center justify-center border text-[10px] font-bold"
                    style={{ borderColor: 'var(--ink)', color: 'var(--ink)' }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--slate)' }}>
                    {step}
                  </span>
                  {i < 2 && <ArrowRight className="h-3 w-3 opacity-30" />}
                </div>
              ))}
            </div>
          </FadeIn>
        </StaggerItem>
      </StaggerContainer>
    );
  }

  const { workspace } = active;

  const [websitesCount, membersCount, recentWebsites, members] = await Promise.all([
    prisma.website.count({ where: { workspaceId: workspace.id, deletedAt: null } }),
    prisma.userRole.count({ where: { workspaceId: workspace.id } }),
    prisma.website.findMany({
      where: { workspaceId: workspace.id, deletedAt: null },
      orderBy: { updatedAt: 'desc' },
      take: 4,
    }),
    prisma.userRole.findMany({
      where: { workspaceId: workspace.id },
      take: 5,
      include: { user: { select: { name: true, email: true } } },
    }),
  ]);

  return (
    <StaggerContainer
      className="relative mx-auto max-w-7xl space-y-6"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(to right, var(--ink) 1px, transparent 1px), linear-gradient(to bottom, var(--ink) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

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
                style={{ backgroundColor: 'var(--signal)', color: '#fff' }}
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

      {/* Bento row: hero stat + team card — rich via layout/illustration, no chart */}
      <StaggerItem className="grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr_1fr]">
        <Card
          className="relative flex flex-col justify-between overflow-hidden rounded-none border-2 bg-[var(--paper)] p-7"
          style={{ borderColor: 'var(--ink)', boxShadow: '6px 6px 0px var(--ink)' }}
        >
          <CornerMarks />

          <span
            aria-hidden
            className="font-display pointer-events-none absolute -top-6 -right-2 text-[9rem] leading-none font-bold select-none"
            style={{ color: 'var(--ink)', opacity: 0.04 }}
          >
            {websitesCount}
          </span>
          <div
            aria-hidden
            className="pointer-events-none absolute right-8 bottom-6 grid grid-cols-6 gap-2 opacity-[0.15]"
          >
            {Array.from({ length: 18 }).map((_, i) => (
              <span
                key={i}
                className="h-1 w-1 rounded-full"
                style={{ backgroundColor: i % 3 === 0 ? 'var(--amber)' : 'var(--signal)' }}
              />
            ))}
          </div>
          <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-[var(--signal)]/12 blur-3xl" />

          <div className="absolute top-0 left-7 -translate-y-1/2">
            <div className="mt-11 inline-flex items-center gap-1.5 border-2 border-[var(--ink)] bg-[var(--ink)] px-3 py-1">
              <Globe className="h-3 w-3" style={{ color: 'var(--paper)' }} />
              <span className="font-data text-[10px] tracking-wider text-[var(--paper)] uppercase">
                Live Overview
              </span>
            </div>
          </div>

          <div className="relative z-10 mt-4 flex items-start justify-between">
            <div>
              <div
                className="font-data mb-1 flex items-center gap-2 text-[11px] tracking-wider"
                style={{ color: 'var(--slate)' }}
              >
                ACTIVE WEBSITES
              </div>
              <div
                className="font-display text-7xl leading-none font-bold tracking-tight"
                style={{ color: 'var(--ink)' }}
              >
                {websitesCount}
              </div>
              <p className="mt-3 text-sm" style={{ color: 'var(--slate)' }}>
                {recentWebsites.length > 0
                  ? `Terakhir diupdate ${formatDistanceToNow(new Date(recentWebsites[0].updatedAt), { addSuffix: true })}`
                  : 'Belum ada aktivitas terbaru'}
              </p>
            </div>
            <Link
              href="/dashboard/websites"
              className="font-data flex shrink-0 items-center gap-1 text-[10px] font-bold tracking-wider uppercase transition-colors hover:text-[var(--signal)]"
              style={{ color: 'var(--slate)' }}
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div
            className="relative z-10 mt-6 flex items-center gap-2 border-t pt-4"
            style={{ borderColor: 'var(--line)' }}
          >
            <Building2 className="h-3.5 w-3.5" style={{ color: 'var(--slate)' }} />
            <span className="text-xs" style={{ color: 'var(--slate)' }}>
              Bagian dari workspace{' '}
              <span className="font-medium" style={{ color: 'var(--ink)' }}>
                {workspace.name}
              </span>
            </span>
          </div>
        </Card>

        <Card
          className="relative flex flex-col justify-between overflow-hidden rounded-none border-2 bg-[var(--paper)] p-7"
          style={{ borderColor: 'var(--ink)', boxShadow: '6px 6px 0px var(--ink)' }}
        >
          <CornerMarks />

          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(-45deg, var(--ink) 0, var(--ink) 1px, transparent 1px, transparent 14px)',
            }}
          />
          <div className="pointer-events-none absolute -bottom-14 -left-14 h-48 w-48 rounded-full bg-[var(--amber)]/10 blur-3xl" />

          <div className="relative z-10">
            <div
              className="font-data mb-4 flex items-center gap-2 text-[11px] tracking-wider"
              style={{ color: 'var(--slate)' }}
            >
              <Users className="h-3.5 w-3.5" style={{ color: 'var(--signal)' }} />
              TEAM MEMBERS
            </div>

            <div className="flex -space-x-3">
              {members.slice(0, 5).map((m, i) => (
                <div
                  key={m.id ?? i}
                  className="font-display flex h-12 w-12 items-center justify-center border-2 text-sm font-bold uppercase transition-transform hover:z-10 hover:-translate-y-1"
                  style={{
                    borderColor: 'var(--paper)',
                    backgroundColor: i % 2 === 0 ? 'var(--signal)' : 'var(--amber)',
                    color: '#fff',
                    boxShadow: '2px 2px 0px var(--ink)',
                  }}
                >
                  {(m.user?.name || m.user?.email || '?').slice(0, 2)}
                </div>
              ))}
              {membersCount > 5 && (
                <div
                  className="font-data flex h-12 w-12 items-center justify-center border-2 text-[10px] font-bold"
                  style={{
                    borderColor: 'var(--paper)',
                    backgroundColor: 'var(--line)',
                    color: 'var(--ink)',
                  }}
                >
                  +{membersCount - 5}
                </div>
              )}
            </div>

            <p className="mt-4 text-sm" style={{ color: 'var(--slate)' }}>
              <span className="font-display font-semibold" style={{ color: 'var(--ink)' }}>
                {membersCount}
              </span>{' '}
              orang aktif di workspace ini
            </p>
          </div>

          <Link href="/dashboard/team" className="relative z-10">
            <Button
              variant="outline"
              className="mt-5 h-10 w-full rounded-none border-[var(--ink)] text-xs font-medium transition-colors hover:bg-[var(--ink)] hover:text-white"
            >
              <Users className="mr-2 h-3.5 w-3.5" />
              Manage Team
            </Button>
          </Link>
        </Card>
      </StaggerItem>

      {/* Recent websites — color-tiled cards */}
      <StaggerItem>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold" style={{ color: 'var(--ink)' }}>
            Recent Websites
          </h3>
          {recentWebsites.length > 0 && (
            <Link
              href="/dashboard/websites"
              className="font-data flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase hover:text-[var(--signal)]"
              style={{ color: 'var(--slate)' }}
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>

        {recentWebsites.length === 0 ? (
          <Card
            className="relative flex flex-col items-center justify-center rounded-none border-2 bg-[var(--paper)] py-14 text-center"
            style={{ borderColor: 'var(--ink)', boxShadow: '4px 4px 0px var(--ink)' }}
          >
            <CornerMarks />
            <Globe className="mb-3 h-8 w-8" style={{ color: 'var(--signal)' }} />
            <p className="font-display font-medium" style={{ color: 'var(--ink)' }}>
              No websites found.
            </p>
            <p className="mt-1 text-sm" style={{ color: 'var(--slate)' }}>
              Create your first website to get started.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recentWebsites.map((website, i) => {
              const [from, to] = tileGradients[i % tileGradients.length];
              return (
                <Link
                  key={website.id}
                  href={`/dashboard/websites/${website.id}/pages`}
                  className="group relative block overflow-hidden border-2 bg-[var(--paper)] transition-transform hover:-translate-y-1"
                  style={{ borderColor: 'var(--ink)', boxShadow: '4px 4px 0px var(--ink)' }}
                >
                  <div
                    className="h-20 w-full"
                    style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
                  />
                  <div className="p-4">
                    <p
                      className="font-display truncate font-semibold"
                      style={{ color: 'var(--ink)' }}
                    >
                      {website.name}
                    </p>
                    <p
                      className="font-data mt-1 text-[10px] tracking-wider"
                      style={{ color: 'var(--slate)' }}
                    >
                      Updated{' '}
                      {formatDistanceToNow(new Date(website.updatedAt), { addSuffix: true })}
                    </p>
                    <span
                      className="mt-3 inline-flex items-center gap-1 text-xs font-medium opacity-0 transition-opacity group-hover:opacity-100"
                      style={{ color: 'var(--signal)' }}
                    >
                      Manage <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </StaggerItem>
    </StaggerContainer>
  );
}
