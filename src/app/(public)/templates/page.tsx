import { Suspense } from 'react';
import { getTemplates, getCategories } from '@/core/templates/queries';
import { TemplateList } from '@/core/templates/components/TemplateList';
import { TemplateFilters } from '@/core/templates/components/TemplateFilters';
import { LoadingState } from '@/shared/ui/loading-state';
import { PageHeader } from '@/shared/ui/blueprint';
import { StaggerContainer, StaggerItem, Reveal } from '@/shared/ui/motion';

async function TemplatesData({
  search,
  categoryId,
  industryId,
}: {
  search?: string;
  categoryId?: string;
  industryId?: string;
}) {
  const templates = await getTemplates({
    search,
    categoryId,
    industryId,
  });
  
  // Force userTier to 'FREE' since this is the public unauthenticated view.
  // TemplateList will handle this and likely show "Upgrade required" or standard cloning CTAs.
  return <TemplateList templates={templates} userTier="FREE" />;
}

export default async function PublicTemplatesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const search = typeof params.search === 'string' ? params.search : undefined;
  const categoryId = typeof params.category === 'string' ? params.category : undefined;
  const industryId = typeof params.industry === 'string' ? params.industry : undefined;

  const categories = await getCategories();

  return (
    <div className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <StaggerContainer className="space-y-12">
          
          <Reveal>
            <PageHeader
              eyebrow="MARKETPLACE"
              title="Template Library"
              description="Browse pre-built templates to kickstart your next project. All templates are fully customizable in the Visual Builder."
            />
          </Reveal>

          <StaggerItem>
            <TemplateFilters categories={categories} />
          </StaggerItem>

          <StaggerItem>
            <Suspense fallback={<LoadingState message="Loading templates..." />}>
              <TemplatesData
                search={search}
                categoryId={categoryId}
                industryId={industryId}
              />
            </Suspense>
          </StaggerItem>
          
        </StaggerContainer>
      </div>
    </div>
  );
}
