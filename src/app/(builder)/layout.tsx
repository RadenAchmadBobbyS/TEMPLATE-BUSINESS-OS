import { Providers } from "@/app/providers";
import { TooltipProvider } from "@/shared/ui/tooltip";

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // We use a clean layout for the builder to take up 100vh, bypassing the dashboard sidebar
  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-background text-foreground">
      <Providers attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </Providers>
    </div>
  );
}
