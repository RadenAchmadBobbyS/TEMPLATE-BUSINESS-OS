import { create } from "zustand";
import { ThemeState, ThemeConfig } from "./types";

export const defaultTheme: ThemeConfig = {
  colors: {
    primary: "221.2 83.2% 53.3%", // Blue
    background: "0 0% 100%",
    foreground: "222.2 84% 4.9%",
    card: "0 0% 100%",
    cardForeground: "222.2 84% 4.9%",
    border: "214.3 31.8% 91.4%",
    muted: "210 40% 96.1%",
    mutedForeground: "215.4 16.3% 46.9%",
  },
  typography: {
    fontFamily: "Inter, sans-serif",
    headingFontFamily: "Inter, sans-serif",
  },
  radius: "0.5rem",
};

export const useThemeStore = create<ThemeState>((set) => ({
  config: defaultTheme,

  updateColor: (key, value) => set((state) => ({
    config: {
      ...state.config,
      colors: {
        ...state.config.colors,
        [key]: value,
      }
    }
  })),

  updateTypography: (key, value) => set((state) => ({
    config: {
      ...state.config,
      typography: {
        ...state.config.typography,
        [key]: value,
      }
    }
  })),

  updateRadius: (value) => set((state) => ({
    config: {
      ...state.config,
      radius: value,
    }
  })),

  setTheme: (config) => set({ config }),
  
  resetTheme: () => set({ config: defaultTheme }),
}));
