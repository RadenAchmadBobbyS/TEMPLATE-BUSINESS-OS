import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowRight, ExternalLink, ArrowUpRight } from 'lucide-react';
import { getShowcaseWebsites } from '@/core/public/queries';

// ─── Types ────────────────────────────────────────────────────────────────────
type ShowcaseWebsite = {
  id: string;
  name: string;
  slug: string;
  domain: string | null;
  description: string | null;
  settings: any;
};

const CATEGORIES = [
  { label: 'All', value: 'all' },
  { label: 'E-commerce', value: 'ecommerce' },
  { label: 'Portfolio', value: 'portfolio' },
  { label: 'Marketing', value: 'marketing' },
  { label: 'Blog', value: 'blog' },
  { label: 'SaaS', value: 'saas' },
];

const STATS = [
  { value: '100+', label: 'Templates', sub: 'ready to use' },
  { value: '4', label: 'Plans', sub: 'free to business' },
  { value: '∞', label: 'Pages', sub: 'per website (Business)' },
];

// ─── Theme-aware variables handled via var(--...) ─────────────────────────────

// ─── Website card ─────────────────────────────────────────────────────────────
function ShowcaseCard({ site, featured = false }: { site: ShowcaseWebsite; featured?: boolean }) {
  const thumbnail = (site.settings as any)?.metadata?.thumbnail ?? null;
  const visitUrl = site.domain ? `https://${site.domain}` : null;
  const category = (site.settings as any)?.metadata?.category ?? 'General';

  return (
    <div
      className={`group relative flex flex-col overflow-hidden border-2 transition-all duration-200 hover:-translate-y-1 ${featured ? 'sm:col-span-2' : ''}`}
      style={{
        borderColor: 'var(--ink)',
        backgroundColor: 'var(--paper)',
        boxShadow: '4px 4px 0 var(--ink)',
      }}
    >
      {/* Thumbnail */}
      <div
        className={`relative overflow-hidden border-b-2 ${featured ? 'aspect-[16/8]' : 'aspect-[4/3]'}`}
        style={{ borderColor: 'var(--line)', backgroundColor: 'var(--line)' }}
      >
        {thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnail}
            alt={site.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          /* Browser chrome mockup */
          <div
            className="flex h-full w-full items-center justify-center p-4"
            style={{ backgroundColor: 'var(--paper)' }}
          >
            <div
              className="w-full max-w-xs border-2 shadow-sm"
              style={{ borderColor: 'var(--line)', backgroundColor: 'var(--paper)' }}
            >
              <div
                className="flex items-center gap-1.5 border-b-2 px-3 py-2"
                style={{ borderColor: 'var(--line)' }}
              >
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: '#ff5f57' }} />
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: '#febc2e' }} />
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: '#28c840' }} />
                <div
                  className="ml-2 flex-1 px-2 py-0.5 text-[9px] truncate"
                  style={{ backgroundColor: 'var(--line)', color: 'var(--slate)' }}
                >
                  {site.domain ?? `${site.slug}.businessos.app`}
                </div>
              </div>
              <div className="space-y-2 p-3">
                <div className="h-2 w-3/4" style={{ backgroundColor: 'var(--slate)' }} />
                <div className="h-2 w-full" style={{ backgroundColor: 'var(--line)' }} />
                <div className="h-2 w-2/3" style={{ backgroundColor: 'var(--line)' }} />
                <div className="mt-3 h-5 w-1/3" style={{ backgroundColor: 'var(--ink)' }} />
              </div>
            </div>
          </div>
        )}

        {visitUrl && (
          <div
            className="absolute inset-0 flex items-end p-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)' }}
          >
            <a
              href={visitUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 border-2 px-3 py-1.5 text-xs font-medium"
              style={{ borderColor: '#fff', backgroundColor: '#000', color: '#fff' }}
              onClick={(e) => e.stopPropagation()}
            >
              Visit Site <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <p
            className="font-display truncate text-sm font-semibold"
            style={{ color: 'var(--ink)' }}
          >
            {site.name}
          </p>
          <p className="font-data truncate text-[11px]" style={{ color: 'var(--slate)' }}>
            {category}
            {site.domain && ` · ${site.domain}`}
          </p>
        </div>
        {visitUrl && (
          <a
            href={visitUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--slate)' }}
          >
            <ArrowUpRight className="h-4 w-4" />
          </a>
        )}
      </div>
    </div>
  );
}

// ─── Placeholder card ─────────────────────────────────────────────────────────
function PlaceholderCard({ featured = false, idx = 0 }: { featured?: boolean; idx?: number }) {
  const palettes = [
    { accent: '#3b82f6' },
    { accent: '#16a34a' },
    { accent: '#f97316' },
    { accent: '#8b5cf6' },
    { accent: '#ec4899' },
  ];
  const p = palettes[idx % palettes.length];
  const names = [
    'Studio Portfolio',
    'E-commerce Store',
    'Agency Site',
    'SaaS Landing',
    'Blog Platform',
  ];
  const cats = ['Portfolio', 'E-commerce', 'Agency', 'SaaS', 'Blog', 'Branding'];

  return (
    <div
      className={`relative flex flex-col overflow-hidden border-2 ${featured ? 'sm:col-span-2' : ''}`}
      style={{
        borderColor: 'var(--ink)',
        backgroundColor: 'var(--paper)',
        boxShadow: '4px 4px 0 var(--ink)',
        opacity: 0.5,
      }}
    >
      <div
        className={`relative border-b-2 ${featured ? 'aspect-[16/8]' : 'aspect-[4/3]'}`}
        style={{ borderColor: 'var(--ink)', backgroundColor: 'var(--paper)' }}
      >
        <div className="flex h-full flex-col gap-2 p-4">
          <div className="mb-2 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: '#ff5f57' }} />
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: '#febc2e' }} />
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: '#28c840' }} />
          </div>
          <div className="h-2.5 w-1/2" style={{ backgroundColor: p.accent, opacity: 0.7 }} />
          <div className="h-1.5 w-full" style={{ backgroundColor: 'var(--line)' }} />
          <div className="h-1.5 w-3/4" style={{ backgroundColor: 'var(--line)' }} />
          <div className="mt-auto h-6 w-1/3" style={{ backgroundColor: p.accent }} />
        </div>
      </div>
      <div className="px-4 py-3">
        <p className="font-display text-sm font-semibold" style={{ color: 'var(--ink)' }}>
          {names[idx % names.length]}
        </p>
        <p className="font-data text-[11px]" style={{ color: 'var(--slate)' }}>
          {cats[idx % cats.length]}
        </p>
      </div>
    </div>
  );
}

// ─── Showcase grid ────────────────────────────────────────────────────────────
async function ShowcaseGrid() {
  const sites = await getShowcaseWebsites();

  if (sites.length === 0) {
    return (
      <div className="relative">
        <div
          className="absolute -bottom-4 -right-4 left-0 top-0 z-10 flex items-center justify-center"
          style={{
            background:
              'linear-gradient(to bottom, transparent 0%, color-mix(in srgb, var(--paper) 90%, transparent) 45%, var(--paper) 100%)',
          }}
        >
          <div
            className="relative border-2 px-8 py-6 text-center"
            style={{
              borderColor: 'var(--ink)',
              backgroundColor: 'var(--paper)',
              boxShadow: '6px 6px 0 var(--ink)',
            }}
          >
            <p
              className="font-data mb-2 text-xs tracking-widest uppercase"
              style={{ color: 'var(--signal)' }}
            >
              Coming Soon
            </p>
            <p className="font-display mb-1 text-xl font-bold" style={{ color: 'var(--ink)' }}>
              Showcase is being curated
            </p>
            <p className="mb-5 text-sm" style={{ color: 'var(--slate)' }}>
              Build your own and be among the first featured.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: 'var(--signal)', color: '#fff' }}
            >
              Start Building Free <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <div className="pointer-events-none grid grid-cols-1 gap-6 select-none sm:grid-cols-2 lg:grid-cols-3">
          <PlaceholderCard featured idx={0} />
          {[1, 2, 3, 4].map((i) => (
            <PlaceholderCard key={i} idx={i} />
          ))}
        </div>
      </div>
    );
  }

  const [featured, ...rest] = sites;
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {featured && <ShowcaseCard site={featured} featured />}
      {rest.map((site) => (
        <ShowcaseCard key={site.id} site={site} />
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ShowcasePage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--paper)', color: 'var(--ink)' }}>
      {/* ═══════════════════════════════════════════════════════════════════
          HERO — theme-aware
      ═══════════════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: 'var(--paper)', borderBottom: '2px solid var(--line)' }}
      >
        {/* Grid overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              'linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Hero content */}
        <div className="relative mx-auto max-w-7xl px-4 pt-8 pb-14 sm:px-6 sm:pt-12 sm:pb-20 lg:px-8">
          <div className="max-w-3xl">
            <span
              className="font-data mb-5 inline-flex items-center gap-2 text-xs"
              style={{ color: 'var(--amber)' }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: 'var(--amber)' }}
              />
              SHOWCASE
            </span>
            <h1
              className="font-display mb-5 text-4xl leading-[1.1] font-bold tracking-tight sm:text-5xl lg:text-[3.5rem]"
              style={{ color: 'var(--ink)' }}
            >
              The platform for when
              <br />
              <span style={{ color: 'var(--amber)' }}>your business matters.</span>
            </h1>
            <p
              className="mb-10 max-w-xl text-base leading-relaxed"
              style={{ color: 'var(--slate)' }}
            >
              Discover websites, landing pages, and digital products built by businesses and
              agencies using Business OS — the visual builder for serious teams.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5"
                style={{ backgroundColor: 'var(--ink)', color: 'var(--paper)' }}
              >
                Start Building Free <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/templates"
                className="inline-flex items-center gap-2 border-2 px-6 py-3 text-sm font-medium transition-transform hover:-translate-y-0.5"
                style={{ borderColor: 'var(--line)', color: 'var(--slate)' }}
              >
                Browse Templates
              </Link>
            </div>
          </div>
        </div>

        {/* Preview strip */}
        <div style={{ borderTop: '1px solid var(--line)' }}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="overflow-x-auto">
              <div className="flex min-w-max gap-4 py-5">
                {[
                  { label: 'Portfolio', accent: '#3b82f6' },
                  { label: 'E-commerce', accent: '#16a34a' },
                  { label: 'Agency', accent: '#ea580c' },
                  { label: 'SaaS', accent: '#8b5cf6' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="relative shrink-0 cursor-pointer overflow-hidden transition-all hover:scale-[1.02]"
                    style={{
                      width: '200px',
                      height: '130px',
                      border: '1px solid var(--line)',
                      backgroundColor: 'var(--paper)',
                    }}
                  >
                    <div className="space-y-1.5 p-3">
                      <div className="mb-2 flex gap-1">
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: '#ff5f57' }}
                        />
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: '#febc2e' }}
                        />
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: '#28c840' }}
                        />
                      </div>
                      <div
                        className="h-1.5 w-1/2"
                        style={{ backgroundColor: item.accent, opacity: 0.7 }}
                      />
                      <div
                        className="h-1.5 w-full"
                        style={{ backgroundColor: 'var(--line)' }}
                      />
                      <div
                        className="h-1.5 w-3/4"
                        style={{ backgroundColor: 'var(--line)' }}
                      />
                      <div className="mt-3 h-5 w-2/5" style={{ backgroundColor: item.accent }} />
                    </div>
                    <div
                      className="font-data absolute bottom-2.5 left-3 text-[10px] font-semibold"
                      style={{ color: 'var(--slate)' }}
                    >
                      {item.label} ↗
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          STATS BAR — theme-aware
      ═══════════════════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: 'var(--paper)', borderBottom: '2px solid var(--line)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className="px-6 py-8 text-center"
                style={{ borderRight: i < STATS.length - 1 ? '1px solid var(--line)' : 'none' }}
              >
                <p
                  className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl"
                  style={{ color: 'var(--ink)' }}
                >
                  {s.value}
                </p>
                <p
                  className="font-display mt-1 text-sm font-semibold"
                  style={{ color: 'var(--ink)' }}
                >
                  {s.label}
                </p>
                <p className="font-data mt-0.5 text-xs" style={{ color: 'var(--slate)' }}>
                  {s.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          GALLERY — theme-aware (light/dark)
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {/* Category chips */}
        <div className="mb-10 flex items-center gap-2 overflow-x-auto pb-2">
          {CATEGORIES.map((cat, i) => (
            <span
              key={cat.value}
              className="font-data shrink-0 cursor-pointer border-2 px-4 py-1.5 text-xs font-medium transition-all hover:-translate-y-0.5"
              style={
                i === 0
                  ? {
                      borderColor: 'var(--ink)',
                      backgroundColor: 'var(--ink)',
                      color: 'var(--paper)',
                    }
                  : {
                      borderColor: 'var(--line)',
                      color: 'var(--slate)',
                      backgroundColor: 'transparent',
                    }
              }
            >
              {cat.label}
            </span>
          ))}
        </div>

        {/* Grid */}
        <Suspense
          fallback={
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className={`aspect-[4/3] animate-pulse border-2 ${i === 0 ? 'sm:col-span-2' : ''}`}
                  style={{ borderColor: 'var(--line)', backgroundColor: 'var(--line)' }}
                />
              ))}
            </div>
          }
        >
          <ShowcaseGrid />
        </Suspense>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          CTA BAND — theme-aware
      ═══════════════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden py-16"
        style={{
          backgroundColor: 'var(--paper)',
          borderTop: '2px solid var(--line)',
          borderBottom: '2px solid var(--line)',
        }}
      >
        {/* Grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              'linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <span className="font-data mb-3 block text-xs" style={{ color: 'var(--amber)' }}>
                BUILD LIKE THE BEST
              </span>
              <h2
                className="font-display mb-3 text-3xl font-bold tracking-tight"
                style={{ color: 'var(--ink)' }}
              >
                Template your next project
                <br />
                <span style={{ color: 'var(--amber)' }}>on Business OS.</span>
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--slate)' }}>
                Choose from 100+ professionally designed templates and customize every pixel in the
                visual builder — no code required.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5"
                style={{ backgroundColor: 'var(--signal)', color: '#fff' }}
              >
                Start Building Free <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/templates"
                className="inline-flex items-center justify-center gap-2 border px-6 py-3 text-sm font-medium transition-transform hover:-translate-y-0.5"
                style={{ borderColor: 'var(--line)', color: 'var(--slate)' }}
              >
                Browse Templates
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          PLATFORM LOGOS — theme-aware
      ═══════════════════════════════════════════════════════════════════ */}
      <section
        className="py-10"
        style={{ borderBottom: '1px solid var(--line)', backgroundColor: 'var(--paper)' }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p
            className="font-data mb-8 text-center text-xs tracking-widest uppercase"
            style={{ color: 'var(--slate)' }}
          >
            Powered by the best frameworks & infrastructure
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10">
            {['Next.js', 'Vercel', 'Prisma', 'Tailwind CSS', 'Stripe', 'Algolia'].map((name) => (
              <span
                key={name}
                className="font-display text-sm font-bold opacity-30"
                style={{ color: 'var(--ink)' }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          BOTTOM CTA — theme-aware
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24" style={{ backgroundColor: 'var(--paper)' }}>
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2
            className="font-display mb-4 text-4xl font-bold tracking-tight"
            style={{ color: 'var(--ink)' }}
          >
            A powerful platform for building
            <br />
            <span style={{ color: 'var(--signal)' }}>high-performance business websites.</span>
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-base" style={{ color: 'var(--slate)' }}>
            Join teams using Business OS to build, deploy, and scale their web presence — from a
            single landing page to a multi-site agency operation.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: 'var(--ink)', color: 'var(--paper)' }}
            >
              Start Building Free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/plans"
              className="inline-flex items-center gap-2 border-2 px-8 py-3 text-sm font-medium transition-transform hover:-translate-y-0.5"
              style={{ borderColor: 'var(--ink)', color: 'var(--ink)' }}
            >
              View Plans
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
