import { ImageIcon, ExternalLink, ArrowRight } from "lucide-react";
import { GridBackdrop, CornerMarks, PageHeader } from "@/shared/ui/blueprint";
import { Reveal, StaggerContainer, StaggerItem } from "@/shared/ui/motion";
import { Button } from "@/shared/ui/button";
import Link from "next/link";

export default function ShowcasePage() {
  return (
    <div className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <Reveal>
          <PageHeader
            eyebrow="SHOWCASE"
            title="Built with Business OS"
            description="Explore websites, agencies, and businesses powered by the Business OS platform."
            actions={
              <Button asChild>
                <Link href="/register">
                  Start Building <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            }
          />
        </Reveal>

        {/* Empty State / Coming Soon */}
        <Reveal delay={0.2} className="mt-16">
          <div className="relative border border-dashed border-ink/20 bg-muted/10 p-16 text-center">
            <CornerMarks />
            <GridBackdrop className="opacity-50" />
            
            <div className="relative z-10 flex flex-col items-center justify-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center border border-ink bg-paper">
                <ImageIcon className="h-6 w-6 text-ink" />
              </div>
              <h3 className="font-display text-2xl font-semibold mb-2">Showcase launching soon</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-8">
                We're currently curating the best websites built on Business OS. Check back soon to see incredible examples of visual building and headless CMS capabilities.
              </p>
              
              <div className="flex gap-4">
                <Button variant="outline" asChild>
                  <Link href="/templates">
                    Browse Templates
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/docs/builder">
                    Learn about Builder
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>

      </div>
    </div>
  );
}
