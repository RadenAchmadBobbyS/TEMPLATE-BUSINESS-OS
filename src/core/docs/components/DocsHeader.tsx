"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Menu, X } from "lucide-react";
import { AlgoliaSearch } from "./AlgoliaSearch";
import { DocsSidebar } from "./DocsSidebar";
import { usePathname } from "next/navigation";

export function DocsHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="h-14 border-b flex items-center px-4 md:px-6 gap-4 sticky top-0 bg-background/95 backdrop-blur z-50">
        <button 
          className="md:hidden flex items-center justify-center p-2 -ml-2 text-muted-foreground hover:text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link href="/docs" className="flex items-center gap-2 font-bold text-lg hover:opacity-80 transition-opacity">
          <BookOpen className="h-5 w-5 text-primary" />
          <span className="hidden sm:inline">Business OS Docs</span>
          <span className="sm:hidden">Docs</span>
        </Link>
        
        <div className="flex-1" />
        
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground mr-4">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <Link href="/templates" className="hover:text-foreground transition-colors">Templates</Link>
          <Link href="/showcase" className="hover:text-foreground transition-colors">Showcase</Link>
        </nav>
        
        <div className="w-full max-w-sm hidden sm:block">
          <AlgoliaSearch />
        </div>
      </header>

      {/* Mobile Search - only visible on small screens when menu is open or just below header */}
      <div className="sm:hidden px-4 py-2 border-b bg-background sticky top-14 z-40 flex flex-col gap-3">
        <nav className="flex items-center gap-4 text-sm font-medium text-muted-foreground overflow-x-auto pb-1">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <Link href="/templates" className="hover:text-foreground transition-colors">Templates</Link>
          <Link href="/showcase" className="hover:text-foreground transition-colors">Showcase</Link>
        </nav>
        <AlgoliaSearch />
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-[104px] z-40 bg-background md:hidden overflow-y-auto">
          <div className="p-4">
            <DocsSidebar />
          </div>
        </div>
      )}
    </>
  );
}
