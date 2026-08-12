import React from "react";
import { ThemeConfig } from "../types";
import { generateThemeCSS } from "../utils";

/**
 * A Server Component that injects a static style tag.
 * Safe to use anywhere without client-side hydration.
 */
export function ServerThemeInjector({ 
  theme, 
  selector = ":root",
  children
}: { 
  theme: ThemeConfig;
  selector?: string;
  children?: React.ReactNode;
}) {
  const css = generateThemeCSS(theme, selector);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      {children}
    </>
  );
}
