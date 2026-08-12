# Dynamic Theme Engine Specification

**Overview**: The Dynamic Theme Engine is the global styling orchestrator of the Website Builder. It allows users to define universal design tokens once and have them cascade across every single component on their canvas instantaneously.

---

## 1. Core Token Architecture
The engine relies on mapping human-readable JSON configurations to standard CSS Variables injected into the DOM root (`:root`).

- **Theme Variables (JSON)**: The database stores a `Theme` entity containing a serialized JSON object representing every token.
- **CSS Variables Injection**: A Next.js Provider parses this JSON and injects a dynamic `<style>` tag into the `<head>` of the published site and the builder's iframe. (e.g., `--color-primary: 220 90% 56%;`).
- **Tailwind Integration**: TailwindCSS is configured to consume these exact CSS variables via its `tailwind.config.ts`. For example, `bg-primary` maps to `hsl(var(--color-primary))`. This ensures complete compatibility with Tailwind's utility classes and opacity modifiers (e.g., `bg-primary/50`).

## 2. Global Style Configurations
Users can globally define the following attributes which cascade downwards:

- **Color System**: HSL definitions for Primary, Secondary, Accent, Background, Surface, Muted, and Text.
- **Brand Color**: The absolute anchor color used for prominent CTAs. Changing this instantly recalibrates lighter/darker shades (e.g., hover states) programmatically.
- **Typography**: Selection of Google Fonts or custom font uploads. Defined globally for `Heading` (H1-H6) and `Body` (p, span, li).
- **Spacing**: A global scaling factor (e.g., `1.0x`, `1.2x`). If set to 1.2x, the standard `8px` grid expands to `9.6px`, stretching all layouts proportionately.
- **Radius**: Global border radius (Sharp `0px`, Subtle `4px`, Rounded `8px`, Pill `9999px`). 
- **Shadow**: Global drop-shadow intensities (None, Soft, Medium, Hard).
- **Border**: Global border thickness (0px, 1px, 2px) and default border color (e.g., `--border-muted`).
- **Animation**: Global transition defaults. Modifying this changes the global `--transition-timing-function` (e.g., switching from `linear` to a bouncy `spring`).

## 3. Component-Specific Styling Overrides
While global tokens dictate the baseline, the engine allows specific global overrides for macro-components:

- **Button Style**: Default paddings, hover transformations (e.g., scale-up or color-shift), and default shadow mappings.
- **Card Style**: Background surface color, border radius override, and default inner padding.
- **Navbar Style**: Sticky vs Static positioning, blur effects (glassmorphism), logo height constraints.
- **Footer Style**: Column layouts, deep dark background overrides.
- **Input Style**: Outline vs Filled designs, focus ring thickness (`ring-2` vs `ring-4`).
- **Table Style**: Zebra striping toggles, header typography weight.

## 4. Theme Modes
- **Dark Mode**: The JSON configuration holds two distinct sets of color tokens (`light` and `dark`). When the user toggles dark mode (or respects OS `prefers-color-scheme`), the wrapper class `.dark` is applied to the `<body>`, immediately swapping the underlying CSS variables. Components do not need to re-render; the browser repaints instantly.

## 5. Theme Operations & Management
- **Preset Theme**: Curated JSON templates (e.g., "Minimalist", "Corporate Blue", "Neon Cyberpunk") available in a single click.
- **Custom Theme**: Users can duplicate a Preset and modify individual tokens.
- **Theme Export**: Downloads the current Theme JSON string to the user's local machine.
- **Theme Import**: Uploads a previously exported JSON file, instantly parsing and applying it to the canvas.
- **Theme Marketplace**: A community hub where designers can publish their custom Theme JSONs for free or for purchase.

## 6. Versioning & Resilience
- **Theme Versioning**: Every time a user clicks "Save Theme", a new record is created in the `ThemeVersion` table linked to the core `Theme` ID.
- **Theme History**: A visual sidebar listing every saved iteration (e.g., "v1.0 (Live)", "v1.1 (Draft) - Changed Primary to Red").
- **Theme Rollback**: Clicking a past history state instantly re-injects that JSON into the canvas.
- **Theme Preview**: Hovering over a Theme Version or a Preset Theme temporarily applies the CSS variables to the canvas without saving, allowing the user to "try before they buy."

## 7. Dynamic Component Application (How it Works)
**How themes affect every component dynamically:**

1. **The Component**: A user drags a Button onto the canvas. The engine renders: `<button className="bg-primary rounded-btn shadow-global">Submit</button>`.
2. **The Connection**: These Tailwind classes do not contain hardcoded hex codes or pixel values. `bg-primary` maps to `var(--color-primary)`. `rounded-btn` maps to `var(--radius-global)`.
3. **The Theme Change**: The user opens the Theme Panel and changes the Global Radius from "Sharp" to "Rounded".
4. **The Resolution**: The Next.js Provider instantly updates the `<style>` block in the DOM: `--radius-global: 8px;`.
5. **The Paint**: The browser instantly repaints the Button (and every Input, Card, and Image using `rounded-btn`) with 8px corners. **Zero React state changes or re-renders are required.** This guarantees 60fps performance regardless of how many thousands of nodes exist on the canvas.
