"use client";

import { useEffect, useRef } from "react";
import { useThemeStore } from "@/core/theme/store";
import { ThemeConfig } from "@/core/theme/types";

export function ThemeStoreInitializer({ initialTheme }: { initialTheme: ThemeConfig }) {
  const initialized = useRef(false);
  const setTheme = useThemeStore((s) => s.setTheme);

  useEffect(() => {
    if (!initialized.current) {
      setTheme(initialTheme);
      initialized.current = true;
    }
  }, [initialTheme, setTheme]);

  return null;
}
