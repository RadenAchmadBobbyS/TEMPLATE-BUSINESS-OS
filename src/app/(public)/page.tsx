import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Database, Layout as LayoutIcon, Search, Globe, ImageIcon, LineChart, FileText } from 'lucide-react';
import { StaggerContainer, StaggerItem, Reveal } from '@/shared/ui/motion';
import { GridBackdrop, CornerMarks } from '@/shared/ui/blueprint';

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <GridBackdrop />
        <div className="relative mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-6 sm:pt-28 sm:pb-24 lg:px-8">
          <StaggerContainer className="mx-auto max-w-3xl text-center">
            <StaggerItem
              className="mb-6 inline-flex items-center gap-2 border px-3 py-1 text-xs"
              style={{
                borderColor: 'var(--line)',
                color: 'var(--slate)',
                fontFamily: "'IBM Plex Mono', monospace",
              }}
            >
              <span className="h-1.5 w-1.5" style={{ backgroundColor: 'var(--amber)' }} />
              ALL-IN-ONE BUSINESS PLATFORM
            </StaggerItem>
            <StaggerItem>
              <h1 className="font-display text-4xl leading-[1.05] font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Build, manage, publish, and{' '}
                <span style={{ color: 'var(--signal)' }}>grow your business</span> from one
                platform.
              </h1>
            </StaggerItem>
            <StaggerItem>
              <p
                className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed"
                style={{ color: 'var(--slate)' }}
              >
                BusinessOS combines a visual website builder, headless CMS, analytics, SEO tools,
                custom domains, and more — everything you need to establish and grow your online
                presence.
              </p>
            </StaggerItem>
            <StaggerItem className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex h-12 items-center gap-2 px-8 text-sm font-medium transition-transform hover:-translate-y-0.5"
                style={{ backgroundColor: 'var(--signal)', color: '#fff' }}
              >
                Start Building
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/showcase"
                className="inline-flex h-12 items-center gap-2 border px-8 text-sm font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                style={{ borderColor: 'var(--ink)' }}
              >
                Explore Showcase
              </Link>
            </StaggerItem>
          </StaggerContainer>

          {/* Blueprint canvas mockup */}
          <Reveal delay={0.2} className="relative mx-auto mt-16 max-w-5xl">
            <div
              className="relative overflow-hidden border"
              style={{ borderColor: 'var(--ink)', backgroundColor: 'var(--paper)' }}
            >
              <CornerMarks />
              <div
                className="font-data flex h-9 items-center gap-3 border-b px-4"
                style={{ borderColor: 'var(--line)', fontSize: '11px', color: 'var(--slate)' }}
              >
                <span>index.tsx</span>
                <span className="ml-auto flex items-center gap-1" style={{ color: 'var(--amber)' }}>
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: 'var(--amber)' }}
                  />
                  editing
                </span>
              </div>
              <div className="relative flex h-[400px]">
                <div
                  className="hidden w-56 border-r p-4 md:block"
                  style={{ borderColor: 'var(--line)' }}
                >
                  <div
                    className="font-data mb-4 text-[11px] tracking-wider uppercase"
                    style={{ color: 'var(--slate)' }}
                  >
                    Layers
                  </div>
                  {['Header', 'Hero Block', 'Feature Grid', 'CTA', 'Footer'].map((item, i) => (
                    <div
                      key={item}
                      className="mb-2 flex items-center gap-2 border-l-2 px-3 py-2 text-xs"
                      style={{
                        borderColor: i === 1 ? 'var(--signal)' : 'transparent',
                        backgroundColor:
                          i === 1
                            ? 'color-mix(in srgb, var(--signal) 6%, transparent)'
                            : 'transparent',
                        color: i === 1 ? 'var(--ink)' : 'var(--slate)',
                      }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
                <div className="relative flex-1 p-6" style={{ backgroundColor: 'var(--paper)' }}>
                  <GridBackdrop />
                  <div className="relative space-y-3">
                    <div className="flex items-center justify-between">
                      <div
                        className="h-6 w-40"
                        style={{
                          backgroundColor: 'color-mix(in srgb, var(--ink) 8%, transparent)',
                        }}
                      />
                      <div
                        className="font-data flex items-center gap-1.5 border px-2 py-1 text-[10px]"
                        style={{ borderColor: 'var(--line)', color: 'var(--signal)' }}
                      >
                        x:240 y:80
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      {[1, 2, 3, 4].map((i) => (
                         <div
                          key={i}
                          className="h-16 border"
                          style={{
                            borderColor: i === 2 ? 'var(--signal)' : 'var(--line)',
                            borderStyle: i === 2 ? 'dashed' : 'solid',
                            backgroundColor: 'var(--paper)',
                          }}
                        />
                      ))}
                    </div>
                    <div
                      className="h-24 border"
                      style={{ borderColor: 'var(--line)', backgroundColor: 'var(--paper)' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Capabilities */}
      <section className="border-t py-20 sm:py-28" style={{ borderColor: 'var(--line)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="font-data text-xs" style={{ color: 'var(--signal)' }}>
              // PLATFORM CAPABILITIES
            </span>
            <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Everything you need to run your business online
            </h2>
            <p className="mt-4 text-lg" style={{ color: 'var(--slate)' }}>
              Learn more about the core features of Business OS in our documentation.
            </p>
          </div>
          <StaggerContainer
            className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-3"
            style={{ backgroundColor: 'var(--line)' }}
          >
            {[
              {
                icon: LayoutIcon,
                title: 'Website Builder',
                description: 'Drag-and-drop editor with real-time preview.',
                link: '/docs/builder',
              },
              {
                icon: Database,
                title: 'Headless CMS',
                description: 'Create custom content models and schemas.',
                link: '/docs/cms',
              },
              {
                icon: Search,
                title: 'SEO & Domains',
                description: 'Manage metadata, sitemaps, and custom domains.',
                link: '/docs/domains',
              },
              {
                icon: LineChart,
                title: 'Analytics',
                description: 'Track visitors and sessions automatically.',
                link: '/docs/analytics',
              },
              {
                icon: FileText,
                title: 'Forms',
                description: 'Build forms and track user submissions.',
                link: '/docs/forms',
              },
              {
                icon: ImageIcon,
                title: 'Media Library',
                description: 'Upload and manage files, images, and videos.',
                link: '/docs/media',
              },
            ].map((feature) => (
              <StaggerItem
                key={feature.title}
                className="group relative p-6 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                style={{ backgroundColor: 'var(--paper)' }}
              >
                <Link href={feature.link} className="absolute inset-0 z-10">
                  <span className="sr-only">Go to {feature.title}</span>
                </Link>
                <div className="mb-4 flex items-center justify-between">
                  <div
                    className="flex h-10 w-10 items-center justify-center border"
                    style={{ borderColor: 'var(--ink)' }}
                  >
                    <feature.icon className="h-4.5 w-4.5" style={{ color: 'var(--ink)' }} />
                  </div>
                  <ArrowUpRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <h3 className="font-display mb-2 font-semibold group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--slate)' }}>
                  {feature.description}
                </p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Gateway Sections */}
      <section className="border-t py-20 sm:py-28" style={{ borderColor: 'var(--line)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-24">
          
          {/* Showcase Preview */}
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="font-data text-xs" style={{ color: 'var(--signal)' }}>
                // SHOWCASE
              </span>
              <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                See what's possible
              </h2>
              <p className="mt-4 text-lg" style={{ color: 'var(--slate)' }}>
                Explore websites and digital experiences created using the Business OS platform.
              </p>
              <div className="mt-8">
                <Link
                  href="/showcase"
                  className="inline-flex h-12 items-center gap-2 border px-8 text-sm font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                  style={{ borderColor: 'var(--ink)' }}
                >
                  View Showcase
                </Link>
              </div>
            </div>
            <div className="relative border p-8 bg-muted/20" style={{ borderColor: 'var(--ink)' }}>
              <CornerMarks />
              <div className="aspect-video bg-muted border rounded-md flex items-center justify-center" style={{ borderColor: 'var(--line)' }}>
                <ImageIcon className="h-8 w-8 text-muted-foreground opacity-50" />
              </div>
            </div>
          </div>

          {/* Templates Preview */}
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="order-2 lg:order-1 relative border p-8 bg-muted/20" style={{ borderColor: 'var(--ink)' }}>
              <CornerMarks />
              <div className="grid grid-cols-2 gap-4">
                 <div className="aspect-square bg-muted border rounded-md" style={{ borderColor: 'var(--line)' }} />
                 <div className="aspect-square bg-muted border rounded-md" style={{ borderColor: 'var(--line)' }} />
                 <div className="aspect-square bg-muted border rounded-md" style={{ borderColor: 'var(--line)' }} />
                 <div className="aspect-square bg-muted border rounded-md" style={{ borderColor: 'var(--line)' }} />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <span className="font-data text-xs" style={{ color: 'var(--signal)' }}>
                // TEMPLATES
              </span>
              <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Start building instantly
              </h2>
              <p className="mt-4 text-lg" style={{ color: 'var(--slate)' }}>
                Browse our marketplace of professionally designed templates to kickstart your next project.
              </p>
              <div className="mt-8">
                <Link
                  href="/templates"
                  className="inline-flex h-12 items-center gap-2 border px-8 text-sm font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                  style={{ borderColor: 'var(--ink)' }}
                >
                  Browse Templates
                </Link>
              </div>
            </div>
          </div>

          {/* Plans Preview */}
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="font-data text-xs" style={{ color: 'var(--signal)' }}>
                // PRICING
              </span>
              <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Plans that scale with you
              </h2>
              <p className="mt-4 text-lg" style={{ color: 'var(--slate)' }}>
                Whether you're a startup, agency, or enterprise — Business OS adapts to your workflow.
              </p>
              <div className="mt-8">
                <Link
                  href="/plans"
                  className="inline-flex h-12 items-center gap-2 border px-8 text-sm font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                  style={{ borderColor: 'var(--ink)' }}
                >
                  View Plans
                </Link>
              </div>
            </div>
            <div className="relative border p-8 bg-muted/20" style={{ borderColor: 'var(--ink)' }}>
              <CornerMarks />
              <div className="space-y-4">
                 <div className="h-12 border bg-background flex items-center justify-between px-4" style={{ borderColor: 'var(--line)' }}>
                    <span className="font-medium text-sm">STARTER</span>
                    <span className="font-data text-xs text-muted-foreground">3 WEBSITES</span>
                 </div>
                 <div className="h-12 border bg-background flex items-center justify-between px-4" style={{ borderColor: 'var(--signal)' }}>
                    <span className="font-medium text-sm">PRO</span>
                    <span className="font-data text-xs text-muted-foreground">10 WEBSITES</span>
                 </div>
                 <div className="h-12 border bg-background flex items-center justify-between px-4" style={{ borderColor: 'var(--line)' }}>
                    <span className="font-medium text-sm">BUSINESS</span>
                    <span className="font-data text-xs text-muted-foreground">50 WEBSITES</span>
                 </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="border-t py-20 sm:py-28" style={{ borderColor: 'var(--line)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="bg-ink dark:border-line relative overflow-hidden px-8 py-16 text-center sm:px-16 dark:border dark:bg-white/5">
            <GridBackdrop />
            <h2 className="font-display text-paper dark:text-ink relative text-3xl font-semibold tracking-tight sm:text-4xl">
              Ready to start building?
            </h2>
            <p className="text-paper dark:text-slate relative mx-auto mt-4 max-w-xl text-lg opacity-70">
              Join thousands of businesses that use Business OS to create, manage, and grow their
              online presence.
            </p>
            <div className="relative mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/register"
                className="bg-signal inline-flex h-12 items-center gap-2 px-8 text-sm font-medium text-white transition-transform hover:-translate-y-0.5"
              >
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/docs"
                className="border-paper text-paper dark:border-ink dark:text-ink inline-flex h-12 items-center gap-2 border px-8 text-sm font-medium opacity-80 hover:opacity-100"
              >
                Read Documentation
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
