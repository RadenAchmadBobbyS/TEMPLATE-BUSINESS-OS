import { DocsSidebar } from "@/core/docs/components/DocsSidebar";
import { TableOfContents } from "@/core/docs/components/TableOfContents";
import { DocsHeader } from "@/core/docs/components/DocsHeader";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DocsHeader />
      <div className="flex-1 mx-auto w-full max-w-[1400px]">
        <div className="flex items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[250px_minmax(0,1fr)]">
          <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block px-4">
            <DocsSidebar />
          </aside>
          
          <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_250px] w-full min-w-0 px-4 md:px-8">
            <div className="mx-auto w-full min-w-0 max-w-3xl">
              {children}
            </div>
            <div className="hidden xl:block">
              <div className="sticky top-14 h-[calc(100vh-3.5rem)] pt-8 overflow-y-auto">
                <TableOfContents />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
