import { ShowcaseCard } from './ShowcaseCard';
import { StaggerContainer, StaggerItem, FadeIn } from '@/shared/ui/motion';
import { GridBackdrop, CornerMarks } from '@/shared/ui/blueprint';
import { ImageIcon } from 'lucide-react';

type ShowcaseWebsite = {
  id: string;
  name: string;
  slug: string;
  domain: string | null;
  description: string | null;
  settings: any;
};

export function ShowcaseGrid({ websites }: { websites: ShowcaseWebsite[] }) {
  if (websites.length === 0) {
    return (
      <FadeIn>
        <div className="relative border border-dashed border-ink/20 bg-muted/10 p-16 text-center">
          <CornerMarks />
          <GridBackdrop className="opacity-50" />
          
          <div className="relative z-10 flex flex-col items-center justify-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center border border-ink bg-paper">
              <ImageIcon className="h-6 w-6 text-ink" />
            </div>
            <h3 className="font-display text-2xl font-semibold mb-2">No showcases available yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Showcases will appear here once websites built with Business OS are published. Check back soon to see incredible examples of visual building and headless CMS capabilities.
            </p>
          </div>
        </div>
      </FadeIn>
    );
  }

  return (
    <StaggerContainer className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {websites.map((website) => (
        <StaggerItem key={website.id}>
          <ShowcaseCard website={website} />
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
