"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/shared/ui/input";

// PRD Requirement: If Algolia credentials/infrastructure are not configured, 
// implement the integration cleanly without fake search results and clearly report 
// the required environment configuration.

export function AlgoliaSearch() {
  const [query, setQuery] = useState("");
  
  const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
  const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_API_KEY;
  const indexName = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME;

  const isConfigured = Boolean(appId && apiKey && indexName);

  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder={isConfigured ? "Search documentation..." : "Search unavailable (Configure Algolia)"}
        className="w-full bg-muted/50 pl-9 border-none focus-visible:ring-1"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        disabled={!isConfigured}
      />
      {!isConfigured && query && (
        <div className="absolute top-full mt-2 w-full p-4 bg-background border rounded-md shadow-md text-sm text-destructive z-50">
          <strong>Environment Configuration Required:</strong>
          <ul className="list-disc ml-4 mt-2 text-muted-foreground text-xs">
            <li>NEXT_PUBLIC_ALGOLIA_APP_ID</li>
            <li>NEXT_PUBLIC_ALGOLIA_API_KEY</li>
            <li>NEXT_PUBLIC_ALGOLIA_INDEX_NAME</li>
          </ul>
        </div>
      )}
    </div>
  );
}
