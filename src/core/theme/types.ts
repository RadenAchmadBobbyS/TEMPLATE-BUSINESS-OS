export type ThemeColors = {
  primary: string; // e.g., "221.2 83.2% 53.3%"
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  border: string;
  muted: string;
  mutedForeground: string;
};

export type ThemeTypography = {
  fontFamily: string; // e.g., "Inter, sans-serif"
  headingFontFamily: string;
};

export type ThemeConfig = {
  colors: ThemeColors;
  typography: ThemeTypography;
  radius: string; // e.g., "0.5rem"
};

export type ThemeState = {
  config: ThemeConfig;
  updateColor: (key: keyof ThemeColors, value: string) => void;
  updateTypography: (key: keyof ThemeTypography, value: string) => void;
  updateRadius: (value: string) => void;
  setTheme: (config: ThemeConfig) => void;
  resetTheme: () => void;
};
