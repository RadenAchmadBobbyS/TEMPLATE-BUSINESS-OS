import { ThemeConfig } from "./types";

/**
 * Deterministically generates CSS variables for a given ThemeConfig.
 * 
 * @param config The validated ThemeConfig
 * @param selector The CSS selector where the variables will be attached (e.g. ":root" or ".theme-root")
 * @returns A raw CSS string
 */
export function generateThemeCSS(config: ThemeConfig, selector: string = ":root"): string {
  // Use generic fallbacks in case something is undefined
  const c = config?.colors || {};
  const t = config?.typography || {};
  const r = config?.radius || "0.5rem";

  return `
    ${selector} {
      --primary: ${c.primary};
      --background: ${c.background};
      --foreground: ${c.foreground};
      --card: ${c.card};
      --card-foreground: ${c.cardForeground};
      --border: ${c.border};
      --muted: ${c.muted};
      --muted-foreground: ${c.mutedForeground};
      
      --radius: ${r};
      
      --font-sans: ${t.fontFamily};
      --font-heading: ${t.headingFontFamily};
      
      font-family: var(--font-sans);
    }
    
    ${selector} h1, ${selector} h2, ${selector} h3, ${selector} h4, ${selector} h5, ${selector} h6 {
      font-family: var(--font-heading);
    }
  `;
}
