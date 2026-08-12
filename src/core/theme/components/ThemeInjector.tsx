"use client";

import { useThemeStore } from "@/core/theme/store";
import { generateThemeCSS } from "../utils";

export function ThemeInjector({ children, selector = ".theme-preview-wrapper" }: { children: React.ReactNode, selector?: string }) {
  const { config } = useThemeStore();

  const css = generateThemeCSS(config, selector);

  return (
    <div className={selector.replace(".", "") + " h-full w-full"}>
      <style suppressHydrationWarning dangerouslySetInnerHTML={{ __html: css }} />
      {children}
    </div>
  );
}
