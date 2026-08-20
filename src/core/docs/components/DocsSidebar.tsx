"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { docsNavigation } from "../navigation";
import { cn } from "@/shared/utils";
import { ChevronRight } from "lucide-react";

export function DocsSidebar() {
  const pathname = usePathname();
  
  // Track expanded state for all categories
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // On mount and pathname change, auto-expand the active category
  useEffect(() => {
    const newExpanded = { ...expanded };
    docsNavigation.forEach((category) => {
      const isActiveCategory = category.items.some((item) => pathname === item.href) || pathname === category.href;
      if (isActiveCategory) {
        newExpanded[category.title] = true;
      }
    });
    setExpanded(newExpanded);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const toggleCategory = (title: string) => {
    setExpanded((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <div className="w-full py-6 pr-6">
      <nav className="space-y-4">
        {docsNavigation.map((category) => {
          const isExpanded = expanded[category.title];
          const isActiveCategory = category.items.some((item) => pathname === item.href) || pathname === category.href;

          return (
            <div key={category.title} className="flex flex-col">
              <button
                onClick={() => toggleCategory(category.title)}
                className={cn(
                  "flex items-center justify-between w-full font-semibold text-sm py-2 px-3 rounded-md transition-colors",
                  isActiveCategory ? "text-primary" : "text-foreground hover:bg-muted"
                )}
              >
                <span className="tracking-tight">{category.title}</span>
                <ChevronRight
                  className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    isExpanded ? "rotate-90 text-foreground" : "text-muted-foreground"
                  )}
                />
              </button>

              <div
                className={cn(
                  "overflow-hidden transition-all duration-200 ease-in-out",
                  isExpanded ? "max-h-[1000px] opacity-100 mt-1" : "max-h-0 opacity-0"
                )}
              >
                <ul className="space-y-1 pl-3 border-l ml-4 border-border/50">
                  {category.items.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className={cn(
                            "block text-sm py-1.5 px-3 rounded-md transition-colors",
                            isActive
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
                          {link.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          );
        })}
      </nav>
    </div>
  );
}
