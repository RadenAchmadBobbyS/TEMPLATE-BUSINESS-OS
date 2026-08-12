"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { Search, LayoutGrid, List as ListIcon, Loader2 } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

export function WebsiteFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [isPending, setIsPending] = useState(false);

  const view = searchParams.get("view") || "grid";
  const sort = searchParams.get("sort") || "createdAt_desc";

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      if (search !== (searchParams.get("search") || "")) {
        updateQueryParams({ search: search || null, page: "1" });
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [search, searchParams]);

  const updateQueryParams = useCallback(
    (params: Record<string, string | null>) => {
      setIsPending(true);
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      
      Object.entries(params).forEach(([key, value]) => {
        if (value === null) {
          current.delete(key);
        } else {
          current.set(key, value);
        }
      });
      
      const searchStr = current.toString();
      const query = searchStr ? `?${searchStr}` : "";
      
      router.push(`${pathname}${query}`);
      
      // Simulate transition finish
      setTimeout(() => setIsPending(false), 200);
    },
    [pathname, router, searchParams]
  );

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full mb-6 items-center justify-between">
      <div className="relative w-full sm:w-[300px]">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search websites..."
          className="pl-9 w-full bg-background"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {isPending && (
          <Loader2 className="absolute right-2.5 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      <div className="flex items-center gap-4 w-full sm:w-auto">
        <Select 
          value={sort} 
          onValueChange={(val: string) => updateQueryParams({ sort: val, page: "1" })}
        >
          <SelectTrigger className="w-[180px] bg-background">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt_desc">Newest First</SelectItem>
            <SelectItem value="createdAt_asc">Oldest First</SelectItem>
            <SelectItem value="name_asc">Name (A-Z)</SelectItem>
            <SelectItem value="name_desc">Name (Z-A)</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center rounded-md border bg-background p-1">
          <Button
            variant="ghost"
            size="icon"
            className={`h-7 w-7 rounded-sm ${view === "grid" ? "bg-muted shadow-sm" : ""}`}
            onClick={() => updateQueryParams({ view: "grid" })}
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="sr-only">Grid View</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`h-7 w-7 rounded-sm ${view === "list" ? "bg-muted shadow-sm" : ""}`}
            onClick={() => updateQueryParams({ view: "list" })}
          >
            <ListIcon className="h-4 w-4" />
            <span className="sr-only">List View</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
