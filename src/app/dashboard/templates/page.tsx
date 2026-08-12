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
import { getActiveWorkspace } from '@/core/workspaces/server-context';
import { getWorkspacePlan } from '@/core/billing/entitlements';
import { SubscriptionTier } from '@prisma/client';

async function TemplatesData({
  search,
  categoryId,
  tier,
  industryId,
  userTier,
}: {
  search?: string;
  categoryId?: string;
  tier?: string;
  industryId?: string;
  userTier: SubscriptionTier;
}) {
  const templates = await getTemplates({
    search,
    categoryId,
    tier: tier as SubscriptionTier,
    industryId,
  });
  return <TemplateList templates={templates} userTier={userTier} />;
}

export default async function TemplatesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const search = typeof params.search === 'string' ? params.search : undefined;
  const categoryId = typeof params.category === 'string' ? params.category : undefined;
  const tier = typeof params.tier === 'string' ? params.tier : undefined;
  const industryId = typeof params.industry === 'string' ? params.industry : undefined;

  const categories = await getCategories();

  const active = await getActiveWorkspace();
  let userTier: SubscriptionTier = 'FREE';
  if (active) {
    const plan = await getWorkspacePlan(active.workspace.id);
    userTier = plan.tier;
  }

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
        <RecentlyUsedCarousel userTier={userTier} />
      </StaggerItem>

      <StaggerItem>
        <TemplateFilters categories={categories} />
      </StaggerItem>

      <StaggerItem>
        <Suspense fallback={<LoadingState message="Loading templates..." />}>
          <TemplatesData
            search={search}
            categoryId={categoryId}
            tier={tier}
            industryId={industryId}
            userTier={userTier}
          />
        </Suspense>
      </StaggerItem>
    </StaggerContainer>
  );
}
