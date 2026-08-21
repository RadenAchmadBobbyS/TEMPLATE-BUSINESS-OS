import { EmptyState } from '@/shared/ui/empty-state';
import { PublicTemplateCard } from './PublicTemplateCard';
import { StaggerContainer, StaggerItem, FadeIn } from '@/shared/ui/motion';

type Template = {
  id: string;
  slug?: string | null;
  name: string;
  requiredTier: string;
  category: { name: string };
  industry: { name: string };
  defaultTree?: any;
};

export function PublicTemplateList({ templates }: { templates: Template[] }) {
  if (templates.length === 0) {
    return (
      <FadeIn>
        <EmptyState
          title="No templates found"
          description="Try adjusting your search or category filters."
        />
      </FadeIn>
    );
  }

  return (
    <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {templates.map((template) => (
        <StaggerItem key={template.id}>
          <PublicTemplateCard template={template} />
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
