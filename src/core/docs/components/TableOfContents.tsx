"use client";

import { useEffect, useState } from "react";
import { cn } from "@/shared/utils";

type Heading = {
  id: string;
  text: string;
  level: number;
};

export function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll("main h2, main h3"))
      .map((element) => ({
        id: element.id,
        text: element.textContent || "",
        level: Number(element.tagName.replace("H", "")),
      }))
      .filter((h) => h.id); // Only include headings with IDs

    setHeadings(elements);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0px 0px -80% 0px" }
    );

    elements.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  if (headings.length === 0) return null;

  return (
    <div className="space-y-4">
      <p className="font-semibold text-sm">On This Page</p>
      <ul className="space-y-2 text-sm">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={cn(
              heading.level === 3 ? "pl-4" : "",
            )}
          >
            <a
              href={`#${heading.id}`}
              className={cn(
                "block transition-colors hover:text-foreground",
                activeId === heading.id ? "text-foreground font-medium" : "text-muted-foreground"
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
