"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { docsNavigation } from "../navigation";
import { cn } from "@/shared/utils";

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-full py-6 pr-6">
      <nav className="space-y-8">
        {docsNavigation.map((category) => (
          <div key={category.title}>
            <h4 className="font-semibold text-sm mb-3 text-foreground tracking-tight">{category.title}</h4>
            <ul className="space-y-1">
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
        ))}
      </nav>
    </div>
  );
}
