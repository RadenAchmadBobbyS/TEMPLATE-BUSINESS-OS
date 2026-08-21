import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, Globe, Layers, Tag } from 'lucide-react';
import { getTemplate, getTemplates } from '@/core/templates/queries';
import { Badge } from '@/shared/ui/badge';
import { GridBackdrop, CornerMarks } from '@/shared/ui/blueprint';
import { PublicTemplatePreview, PublicBuilderNode } from '@/core/public/components/PublicTemplatePreview';
import { toRenderableRoot } from '@/core/builder/tree-normalizer';

// ─── Related template mini-card ──────────────────────────────────────────────
function RelatedCard({
  template,
}: {
  template: { id: string; slug?: string | null; name: string; category: { name: string }; industry: { name: string }; defaultTree?: any };
}) {
  const slug = template.slug || template.id;
  const thumbnail =
    (template.defaultTree as any)?.metadata?.thumbnail ||
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop';

  return (
    <Link href={`/templates/${slug}`} className="group block">
      <div
        className="overflow-hidden border-2 transition-transform group-hover:-translate-y-0.5"
        style={{ borderColor: 'var(--ink)', boxShadow: '3px 3px 0 var(--ink)' }}
      >
        <div className="aspect-[16/9] overflow-hidden border-b-2" style={{ borderColor: 'var(--ink)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbnail}
            alt={template.name}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
          />
        </div>
        <div className="p-3" style={{ backgroundColor: 'var(--paper)' }}>
          <p className="font-display text-sm font-semibold truncate" style={{ color: 'var(--ink)' }}>
            {template.name}
          </p>
          <p className="font-data text-[11px] mt-0.5" style={{ color: 'var(--slate)' }}>
            {template.category.name}
          </p>
        </div>
      </div>
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function PublicTemplateDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const template = await getTemplate(slug);

  if (!template) notFound();

  const meta = (template.defaultTree as any)?.metadata || {};
  const thumbnail =
    meta.thumbnail ||
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop';
  const description =
    meta.description ||
    `A professionally designed template for the ${template.industry.name} industry, built for the Business OS visual builder.`;

  // Parse defaultTree to find the renderable root
  const defaultPage =
    (template.defaultTree as any)?.pages?.find((p: any) => p.slug === '/') ||
    (template.defaultTree as any)?.pages?.[0];
  const rootNode = toRenderableRoot(
    defaultPage?.nodeTree || template.defaultTree
  ) as PublicBuilderNode | null;

  const usedComponents = new Set<string>();
  const traverse = (node: any) => {
    if (!node) return;
    if (node.type && !['Container', 'Section', 'Stack', 'Grid', 'Columns', 'Text', 'Spacer'].includes(node.type)) {
       usedComponents.add(node.type);
    }
    if (node.children) {
      node.children.forEach(traverse);
    }
  };
  if (rootNode) traverse(rootNode);

  const platformFeatures: string[] = [
    'Fully editable in Business OS Visual Builder',
    'Responsive layout (desktop, tablet, mobile)',
  ];

  if (usedComponents.has('CmsList')) {
    platformFeatures.push('Dynamic Headless CMS Integration');
  }
  if (usedComponents.has('Navbar') || usedComponents.has('Footer')) {
    platformFeatures.push('Built-in Navigation Components');
  }
  if (usedComponents.has('Feature') || usedComponents.has('Card')) {
    platformFeatures.push('Pre-built Business Sections');
  }

  // Fetch related templates (same category, exclude current)
  const related = await getTemplates({ categoryId: template.categoryId });
  const relatedFiltered = related.filter((t) => t.id !== template.id).slice(0, 3);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--paper)', color: 'var(--ink)' }}>
      {/* ── Breadcrumb bar ────────────────────────────────────────────────── */}
      <div
        className="border-b-2 sticky top-16 z-30 backdrop-blur-md"
        style={{
          borderColor: 'var(--line)',
          backgroundColor: 'color-mix(in srgb, var(--paper) 90%, transparent)',
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-sm">
          <Link href="/templates" className="flex items-center gap-1.5 hover:underline" style={{ color: 'var(--slate)' }}>
            <ArrowLeft className="h-3.5 w-3.5" />
            Templates
          </Link>
          <span style={{ color: 'var(--line)' }}>/</span>
          <span className="font-medium truncate" style={{ color: 'var(--ink)' }}>
            {template.name}
          </span>
        </div>
      </div>

      {/* ── Hero header ───────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b-2" style={{ borderColor: 'var(--ink)' }}>
        <GridBackdrop className="opacity-20" />
        <div className="relative mx-auto max-w-7xl px-4 pt-14 pb-12 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge
              className="font-data text-xs rounded-none border-2"
              style={{ borderColor: 'var(--ink)', backgroundColor: 'transparent', color: 'var(--ink)' }}
            >
              <Tag className="h-3 w-3 mr-1" />
              {template.category.name}
            </Badge>
            <Badge
              className="font-data text-xs rounded-none border-2"
              style={{ borderColor: 'var(--ink)', backgroundColor: 'transparent', color: 'var(--ink)' }}
            >
              <Globe className="h-3 w-3 mr-1" />
              {template.industry.name}
            </Badge>
            {template.requiredTier !== 'FREE' && (
              <Badge
                className="font-data text-xs rounded-none border-2"
                style={{ borderColor: 'var(--amber)', backgroundColor: 'transparent', color: 'var(--amber)' }}
              >
                {template.requiredTier} Plan
              </Badge>
            )}
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end gap-8 justify-between">
            <div className="max-w-2xl">
              <h1
                className="font-display text-4xl sm:text-5xl font-bold tracking-tight mb-4"
                style={{ color: 'var(--ink)' }}
              >
                {template.name}
              </h1>
              <p className="text-lg leading-relaxed" style={{ color: 'var(--slate)' }}>
                {description}
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5"
                style={{ backgroundColor: 'var(--signal)', color: '#fff' }}
              >
                Get Started Free <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Left: Preview + Overview */}
          <div className="lg:col-span-2 space-y-12">

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--ink)' }}>
                  Live Demo
                </h2>
              </div>
              <PublicTemplatePreview 
                node={rootNode} 
                slug={template.slug || template.id}
              />
            </div>

            {/* Overview */}
            <div>
              <h2 className="font-display text-2xl font-bold mb-4" style={{ color: 'var(--ink)' }}>
                Overview
              </h2>
              <div className="space-y-4 text-base leading-relaxed" style={{ color: 'var(--slate)' }}>
                <p>
                  The <strong style={{ color: 'var(--ink)' }}>{template.name}</strong> template is
                  purpose-built for the{' '}
                  <strong style={{ color: 'var(--ink)' }}>{template.industry.name}</strong> industry.
                  It provides a complete starting point with thoughtfully structured sections,
                  consistent typography, and a visual hierarchy designed to engage visitors and
                  drive conversions.
                </p>
                <p>
                  Once you register on Business OS, you can select this template, instantly
                  preview it in the visual builder, and customize every element — colors, fonts,
                  layout, and content — without writing a single line of code.
                </p>
              </div>
            </div>

            {/* What's included */}
            <div>
              <h2 className="font-display text-2xl font-bold mb-6" style={{ color: 'var(--ink)' }}>
                What's included
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {platformFeatures.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm"
                    style={{ color: 'var(--slate)' }}
                  >
                    <span
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center"
                      style={{ backgroundColor: 'color-mix(in srgb, var(--signal) 12%, transparent)' }}
                    >
                      <Check className="h-3 w-3" style={{ color: 'var(--signal)' }} />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: Metadata sidebar */}
          <div className="space-y-6">

            {/* Details */}
            <div
              className="border-2 p-6 space-y-4"
              style={{ borderColor: 'var(--ink)', backgroundColor: 'var(--paper)' }}
            >
              <h3 className="font-display text-base font-bold flex items-center gap-2" style={{ color: 'var(--ink)' }}>
                <Layers className="h-4 w-4" />
                Template Details
              </h3>
              <div className="space-y-3 text-sm">
                {[
                  { label: 'Category', value: template.category.name },
                  { label: 'Industry', value: template.industry.name },
                  { label: 'Required Plan', value: template.requiredTier },
                  { label: 'Platform', value: 'Business OS Builder' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center border-b pb-3" style={{ borderColor: 'var(--line)' }}>
                    <span style={{ color: 'var(--slate)' }}>{label}</span>
                    <span className="font-medium" style={{ color: 'var(--ink)' }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA card */}
            <div
              className="border-2 p-6 space-y-4"
              style={{ borderColor: 'var(--ink)', backgroundColor: 'var(--ink)' }}
            >
              <h3 className="font-display text-base font-bold" style={{ color: 'var(--paper)' }}>
                Use this template
              </h3>
              <p className="text-sm" style={{ color: 'color-mix(in srgb, var(--paper) 65%, transparent)' }}>
                Create a free Business OS account to start building with this template.
              </p>
              <Link
                href="/register"
                className="flex w-full items-center justify-center gap-2 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5"
                style={{ backgroundColor: 'var(--signal)', color: '#fff' }}
              >
                Get Started Free <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="flex w-full items-center justify-center gap-2 py-2 text-sm transition-opacity hover:opacity-80"
                style={{ color: 'color-mix(in srgb, var(--paper) 70%, transparent)' }}
              >
                Already have an account? Sign in
              </Link>
            </div>
          </div>
        </div>

        {/* ── Related templates ─────────────────────────────────────────── */}
        {relatedFiltered.length > 0 && (
          <div className="mt-20 border-t-2 pt-16" style={{ borderColor: 'var(--line)' }}>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--ink)' }}>
                Related templates
              </h2>
              <Link
                href="/templates"
                className="text-sm hover:underline"
                style={{ color: 'var(--slate)' }}
              >
                Browse all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedFiltered.map((t) => (
                <RelatedCard key={t.id} template={t} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
