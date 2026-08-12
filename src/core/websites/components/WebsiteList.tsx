import { Globe, Plus } from 'lucide-react';
import { EmptyState } from '@/shared/ui/empty-state';
import { WebsiteCard } from './WebsiteCard';
import { CreateWebsiteModal } from './CreateWebsiteModal';
import { Button } from '@/shared/ui/button';
import { FadeIn, StaggerContainer, StaggerItem } from '@/shared/ui/motion';
import { btnPrimary } from '@/shared/ui/blueprint';

type Website = {
  id: string;
  name: string;
  domain: string | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export function WebsiteList({
  websites,
  view = 'grid',
}: {
  websites: Website[];
  view?: 'grid' | 'list';
}) {
  if (websites.length === 0) {
    return (
      <FadeIn>
        <EmptyState
          icon={Globe}
          title="No websites found"
          description="Try adjusting your filters, or create your first website to get started."
          action={
            <CreateWebsiteModal>
              <Button
                className={btnPrimary}
                style={{ backgroundColor: 'var(--signal)', color: '#fff' }}
              >
                <Plus className="mr-2 h-4 w-4" />
                New Website
              </Button>
            </CreateWebsiteModal>
          }
        />
      </FadeIn>
    );
  }

  const containerClass =
    view === 'grid'
      ? 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      : 'flex w-full flex-col gap-3';

  return (
    <StaggerContainer className={containerClass}>
      {websites.map((website) => (
        <StaggerItem key={website.id}>
          <WebsiteCard website={website} view={view} />
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
