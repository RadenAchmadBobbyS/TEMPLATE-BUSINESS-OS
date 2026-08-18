import { DocsSidebar } from "@/core/docs/components/DocsSidebar";
import { AlgoliaSearch } from "@/core/docs/components/AlgoliaSearch";
import { TableOfContents } from "@/core/docs/components/TableOfContents";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="h-14 border-b flex items-center px-6 gap-6 sticky top-0 bg-background/95 backdrop-blur z-40">
        <Link href="/docs" className="flex items-center gap-2 font-bold text-lg hover:opacity-80 transition-opacity">
          <BookOpen className="h-5 w-5 text-primary" />
          <span>Business OS Docs</span>
        </Link>
        <div className="flex-1" />
        <div className="w-full max-w-sm">
          <AlgoliaSearch />
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden max-w-[1400px] mx-auto w-full">
        <aside className="w-[280px] shrink-0 border-r overflow-y-auto hidden md:block">
          <DocsSidebar />
        </aside>
        <main className="flex-1 overflow-y-auto p-8 lg:p-12">
          <div className="max-w-3xl mx-auto xl:ml-0 xl:mr-[240px]">
            {children}
          </div>
        </main>
        <aside className="w-[240px] shrink-0 overflow-y-auto hidden xl:block fixed top-14 right-0 h-[calc(100vh-3.5rem)] py-8 pr-8 xl:static xl:h-auto xl:py-12 xl:pr-0">
          <TableOfContents />
        </aside>
      </div>
    </div>
  );
}
