"use client";

import { ThemeInjector } from "./ThemeInjector";

export function LivePreview() {
  return (
    <div className="flex-1 bg-muted/30 flex items-center justify-center p-8 overflow-auto relative">
      <ThemeInjector>
        <div className="w-full max-w-4xl bg-[hsl(var(--background))] text-[hsl(var(--foreground))] rounded-[var(--radius)] shadow-lg overflow-hidden border border-[hsl(var(--border))] transition-all duration-300">
          
          {/* Navbar Mock */}
          <div className="h-16 border-b border-[hsl(var(--border))] px-6 flex items-center justify-between">
            <span className="font-bold text-lg">Brand</span>
            <div className="flex gap-4 text-sm font-medium">
              <span>Home</span>
              <span className="text-[hsl(var(--muted-foreground))]">Features</span>
              <span className="text-[hsl(var(--muted-foreground))]">Pricing</span>
            </div>
            <button className="px-4 py-2 bg-[hsl(var(--primary))] text-white rounded-[var(--radius)] text-sm font-medium hover:opacity-90">
              Get Started
            </button>
          </div>

          {/* Hero Mock */}
          <div className="p-12 text-center space-y-6">
            <h1 className="text-4xl font-extrabold tracking-tight">
              Design beautiful interfaces
            </h1>
            <p className="text-[hsl(var(--muted-foreground))] max-w-lg mx-auto">
              Change the colors, border radii, and typography in the configuration panel and watch this UI instantly update via CSS variables.
            </p>
            <div className="flex justify-center gap-4">
              <button className="px-6 py-3 bg-[hsl(var(--primary))] text-white rounded-[var(--radius)] font-medium shadow-sm hover:opacity-90">
                Primary Action
              </button>
              <button className="px-6 py-3 bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] rounded-[var(--radius)] font-medium border border-[hsl(var(--border))] hover:bg-[hsl(var(--border))]">
                Secondary Action
              </button>
            </div>
          </div>

          {/* Cards Mock */}
          <div className="bg-[hsl(var(--muted))] p-12 border-t border-[hsl(var(--border))]">
            <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] p-6 rounded-[var(--radius)] shadow-sm border border-[hsl(var(--border))]">
                <h3 className="font-bold mb-2">Card Style</h3>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  This card inherits its border radius and background color dynamically from the theme store.
                </p>
              </div>
              <div className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] p-6 rounded-[var(--radius)] shadow-sm border border-[hsl(var(--border))]">
                <h3 className="font-bold mb-2">CSS Variables</h3>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  No React re-renders are required for styling. Raw CSS variables are pushed to a style tag.
                </p>
              </div>
            </div>
          </div>
          
        </div>
      </ThemeInjector>
    </div>
  );
}
