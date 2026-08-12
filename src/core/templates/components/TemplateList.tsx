import { EmptyState } from "@/shared/ui/empty-state";
import { TemplateCard } from "./TemplateCard";
import { StaggerContainer, StaggerItem, FadeIn } from "@/shared/ui/motion";

type Template = {
  id: string;
  name: string;
  isPremium: boolean;
  category: { name: string };
  industry: { name: string };
};

export function TemplateList({ templates }: { templates: Template[] }) {
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
          <TemplateCard template={template} />
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
