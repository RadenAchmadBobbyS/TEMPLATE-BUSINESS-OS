import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';
import { getTemplates, getCategories, getIndustries } from '@/core/templates/queries';
import { GridBackdrop, CornerMarks } from '@/shared/ui/blueprint';
import { Badge } from '@/shared/ui/badge';
import { PublicTemplateFilters } from '@/core/public/components/PublicTemplateFilters';

// ─── Type ────────────────────────────────────────────────────────────────────
type Template = {
  id: string;
  slug?: string | null;
  name: string;
  requiredTier: string;
  category: { name: string };
  industry: { name: string };
  defaultTree?: any;
};

// ─── Template Card ────────────────────────────────────────────────────────────
function TemplateCard({ template }: { template: Template }) {
  const slug = template.slug || template.id;
  const thumbnail =
    (template.defaultTree as any)?.metadata?.thumbnail ||
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop';

  return (
    <Link
      href={`/templates/${slug}`}
      className="group block overflow-hidden"
      style={{ textDecoration: 'none' }}
    >
      <div
        className="relative overflow-hidden border-2 transition-all duration-200 group-hover:-translate-y-1"
        style={{
          borderColor: 'var(--ink)',
          boxShadow: '4px 4px 0 var(--ink)',
          backgroundColor: 'var(--paper)',
        }}
      >
        {/* Preview image */}
        <div
          className="relative aspect-[16/10] overflow-hidden border-b-2"
          style={{ borderColor: 'var(--ink)' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbnail}
            alt={`${template.name} preview`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
          <div
            className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
          >
            <span
              className="border-2 px-4 py-2 text-sm font-medium"
              style={{
                borderColor: 'var(--paper)',
                backgroundColor: 'var(--ink)',
                color: 'var(--paper)',
              }}
            >
              View Template →
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="mb-2 flex items-start justify-between gap-2">
            <h3
              className="font-display truncate text-base leading-snug font-semibold"
              style={{ color: 'var(--ink)' }}
            >
              {template.name}
            </h3>
            {template.requiredTier !== 'FREE' && (
              <Badge
                className="font-data shrink-0 rounded-none border text-[10px]"
                style={{
                  borderColor: 'var(--amber)',
                  backgroundColor: 'transparent',
                  color: 'var(--amber)',
                }}
              >
                {template.requiredTier}
              </Badge>
            )}
          </div>
          <p className="font-data text-xs" style={{ color: 'var(--slate)' }}>
            {template.industry.name} · {template.category.name}
          </p>
        </div>
      </div>
    </Link>
  );
}

async function TemplateGrid({
  search,
  categoryId,
  industryId,
  tier,
}: {
  search?: string;
  categoryId?: string;
  industryId?: string;
  tier?: any; // SubscriptionTier
}) {
  const templates = await getTemplates({ search, categoryId, industryId, tier });

  if (templates.length === 0) {
    return (
      <div
        className="relative border-2 border-dashed p-16 text-center"
        style={{ borderColor: 'var(--line)' }}
      >
        <CornerMarks />
        <Search className="mx-auto mb-4 h-8 w-8" style={{ color: 'var(--slate)' }} />
        <h3 className="font-display mb-1 text-lg font-semibold" style={{ color: 'var(--ink)' }}>
          No templates found
        </h3>
        <p className="text-sm" style={{ color: 'var(--slate)' }}>
          Try different filters or search keywords.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {templates.map((t) => (
        <TemplateCard key={t.id} template={t} />
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export const dynamic = 'force-dynamic';

export default async function PublicTemplatesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const search = typeof params.search === 'string' ? params.search : undefined;
  const categoryId = typeof params.category === 'string' ? params.category : undefined;
  const industryId = typeof params.industry === 'string' ? params.industry : undefined;
  const tier = typeof params.tier === 'string' ? params.tier : undefined;

  const [categories] = await Promise.all([getCategories()]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--paper)', color: 'var(--ink)' }}>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden border-b-2"
        style={{ borderColor: 'var(--ink)' }}
      >
        <GridBackdrop className="opacity-[0.3]" />
        <div className="relative mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-6 sm:pt-28 sm:pb-20 lg:px-8">
          <div className="max-w-3xl">
            <span
              className="font-data mb-4 flex items-center gap-2 text-xs"
              style={{ color: 'var(--signal)' }}
            >
              <span className="h-1.5 w-1.5" style={{ backgroundColor: 'var(--amber)' }} />
              TEMPLATE MARKETPLACE
            </span>
            <h1
              className="font-display mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
              style={{ color: 'var(--ink)' }}
            >
              Website Templates
            </h1>
            <p
              className="mb-10 max-w-2xl text-lg leading-relaxed"
              style={{ color: 'var(--slate)' }}
            >
              Browse professionally designed templates for every industry. Each template is fully
              customizable in the Business OS visual builder — no code required.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: 'var(--ink)', color: 'var(--paper)' }}
            >
              Start building free <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Filters + Grid ───────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Suspense fallback={null}>
          <PublicTemplateFilters categories={categories} />
        </Suspense>

        <div className="mt-10">
          <Suspense
            fallback={
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[4/3] animate-pulse border-2"
                    style={{ borderColor: 'var(--line)', backgroundColor: 'var(--line)' }}
                  />
                ))}
              </div>
            }
          >
            <TemplateGrid
              search={search}
              categoryId={categoryId}
              industryId={industryId}
              tier={tier as any}
            />
          </Suspense>
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────────────────── */}
      <section
        className="border-t-2 py-20"
        style={{ borderColor: 'var(--ink)', backgroundColor: 'var(--ink)' }}
      >
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2
            className="font-display mb-4 text-3xl font-bold tracking-tight"
            style={{ color: 'var(--paper)' }}
          >
            Ready to build your website?
          </h2>
          <p
            className="mb-8 text-base"
            style={{ color: 'color-mix(in srgb, var(--paper) 70%, transparent)' }}
          >
            Sign up free and choose a template to get started in minutes.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5"
            style={{ backgroundColor: 'var(--signal)', color: '#fff' }}
          >
            Get Started Free <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
