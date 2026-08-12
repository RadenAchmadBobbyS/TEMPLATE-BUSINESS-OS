import { z } from "zod";

// A permissive but safe regex for CSS color values (hex, rgb, hsl, named colors, css variables)
// We avoid allowing semicolons, braces, or script tags.
const safeCssString = z.string().regex(/^[^;{}<>\n\r]+$/, "Invalid characters in CSS value");

export const themeColorsSchema = z.object({
  primary: safeCssString,
  background: safeCssString,
  foreground: safeCssString,
  card: safeCssString,
  cardForeground: safeCssString,
  border: safeCssString,
  muted: safeCssString,
  mutedForeground: safeCssString,
});

export const themeTypographySchema = z.object({
  fontFamily: safeCssString,
  headingFontFamily: safeCssString,
});

export const themeConfigSchema = z.object({
  colors: themeColorsSchema,
  typography: themeTypographySchema,
  radius: safeCssString,
});

export type ValidatedThemeConfig = z.infer<typeof themeConfigSchema>;
