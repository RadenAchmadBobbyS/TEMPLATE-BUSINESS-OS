import { Suspense } from 'react';
import { Upload } from 'lucide-react';
import { getTemplates, getCategories } from '@/core/templates/queries';
import { TemplateList } from '@/core/templates/components/TemplateList';
import { TemplateFilters } from '@/core/templates/components/TemplateFilters';
import { RecentlyUsedCarousel } from '@/core/templates/components/RecentlyUsedCarousel';
import { ImportTemplateModal } from '@/core/templates/components/ImportTemplateModal';
import { LoadingState } from '@/shared/ui/loading-state';
import { Button } from '@/shared/ui/button';
import { StaggerContainer, StaggerItem } from '@/shared/ui/motion';
import { PageHeader, btnOutline } from '@/shared/ui/blueprint';

async function TemplatesData({ search, categoryId }: { search?: string; categoryId?: string }) {
  const templates = await getTemplates({ search, categoryId });
  return <TemplateList templates={templates} />;
}

export default async function TemplatesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const search = typeof params.search === 'string' ? params.search : undefined;
  const categoryId = typeof params.category === 'string' ? params.category : undefined;

  const categories = await getCategories();

  return (
    <StaggerContainer className="space-y-6">
      <StaggerItem>
        <PageHeader
          eyebrow="LIBRARY"
          title="Template Library"
          description="Browse, manage, and install pre-built templates for your websites."
          actions={
            <ImportTemplateModal>
              <Button variant="outline" className={btnOutline}>
                <Upload className="mr-2 h-4 w-4" />
                Import JSON
              </Button>
            </ImportTemplateModal>
          }
        />
      </StaggerItem>

      <StaggerItem>
        <RecentlyUsedCarousel />
      </StaggerItem>

      <StaggerItem>
        <TemplateFilters categories={categories} />
      </StaggerItem>

      <StaggerItem>
        <Suspense fallback={<LoadingState message="Loading templates..." />}>
          <TemplatesData search={search} categoryId={categoryId} />
        </Suspense>
      </StaggerItem>
    </StaggerContainer>
  );
}
