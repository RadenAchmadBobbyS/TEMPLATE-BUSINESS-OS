"use client";

import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/shared/ui/dialog";
import { useRouter } from "next/navigation";
import { docsNavigation } from "../navigation";
import Link from "next/link";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export function AlgoliaSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  
  const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
  const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_API_KEY;
  const indexName = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME;
  const isConfigured = Boolean(appId && apiKey && indexName);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Simple local search fallback
  const allItems = docsNavigation.flatMap((section) => 
    section.items.map(item => ({
      ...item,
      category: section.title
    }))
  );

  const searchResults = query
    ? allItems.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-between bg-muted/50 text-muted-foreground border border-input rounded-md px-3 py-2 text-sm hover:bg-muted/80 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          <span>Search documentation...</span>
        </div>
        <div className="hidden sm:flex h-5 border rounded items-center justify-center bg-background/50 text-[10px] font-medium px-1.5">
          <span className="text-xs mr-0.5">⌘</span>K
        </div>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-popover gap-0 border-border">
          <VisuallyHidden>
             <DialogTitle>Search Documentation</DialogTitle>
             <DialogDescription>Search for guides and references</DialogDescription>
          </VisuallyHidden>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              autoFocus
              className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Search documentation..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="text-[10px] border px-1.5 py-0.5 rounded text-muted-foreground bg-muted/50 font-medium">ESC</div>
          </div>
          
          <div className="max-h-[300px] overflow-y-auto p-2">
            {!isConfigured && query.length > 0 && searchResults.length === 0 && (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No results found for "{query}".
              </div>
            )}

            {!isConfigured && searchResults.map((result) => (
              <button
                key={result.href}
                onClick={() => {
                  setOpen(false);
                  router.push(result.href);
                }}
                className="w-full flex flex-col items-start gap-1 p-2 rounded-md hover:bg-primary/10 transition-colors text-left"
              >
                <div className="flex items-center gap-2 w-full">
                  <span className="font-medium text-foreground">{result.title}</span>
                </div>
                <span className="text-xs text-muted-foreground">{result.category}</span>
              </button>
            ))}

            {isConfigured && (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Algolia search integration is configured but not yet implemented in UI.
              </div>
            )}
            
            {!query && (
               <div className="py-6 text-center text-sm text-muted-foreground">
                 Type a search term to find documentation.
               </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
