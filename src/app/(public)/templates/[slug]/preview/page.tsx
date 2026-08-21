import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getTemplate } from '@/core/templates/queries';
import { PublicTemplatePreview, PublicBuilderNode } from '@/core/public/components/PublicTemplatePreview';
import { toRenderableRoot } from '@/core/builder/tree-normalizer';

export default async function TemplatePreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const template = await getTemplate(slug);

  if (!template) notFound();

  // Parse defaultTree to find the renderable root
  const defaultPage =
    (template.defaultTree as any)?.pages?.find((p: any) => p.slug === '/') ||
    (template.defaultTree as any)?.pages?.[0];
  const rootNode = toRenderableRoot(
    defaultPage?.nodeTree || template.defaultTree
  ) as PublicBuilderNode | null;

  return (
    <div className="relative min-h-screen bg-background">
      {/* Floating Action Button */}
      <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
        <Link
          href={`/templates/${slug}`}
          className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl"
          style={{
            backgroundColor: 'var(--ink)',
            color: 'var(--paper)',
            border: '1px solid var(--line)',
          }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Template
        </Link>
      </div>

      {/* Render the Template Full Screen */}
      <div className="min-h-screen">
        <PublicTemplatePreview node={rootNode} fullScreen />
      </div>
    </div>
  );
}
