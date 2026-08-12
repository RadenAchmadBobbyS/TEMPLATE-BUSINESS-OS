# Axiom Design System Specification
**Version**: 1.0.0-rc.1  
**Philosophy**: Inspired by the frictionless utility of Linear, the creative canvas of Figma/Framer, and the stark edge-native performance of Vercel. Axiom is an original design language built exclusively for high-density, enterprise-grade creator tools.

---

## 1. Design Principles
1. **Content Over Chrome**: UI elements should recede. The user's canvas and data are the heroes.
2. **Predictable Kinetics**: Motion must have physics. Nothing snaps instantaneously; everything glides or springs with purpose.
3. **Hyper-Density without Clutter**: Maximize screen real estate for builder tools using 4px grid alignments.
4. **Keyboard First**: Every single interaction must have a keyboard shortcut equivalent.

## 2. Grid System
- **Core Grid**: 8pt grid system for macro layouts, 4px sub-grid for micro-adjustments within dense panels.
- **Canvas Grid**: Infinite dot-grid background on the builder canvas (dots spaced 16px apart, 1px radius, opacity 10%).

## 3. Spacing
Uses a deterministic `t-shirt` scale mapped to `rem` (assuming 16px root).
- `space-1`: 4px (0.25rem) - Tightly grouped elements (icon + text).
- `space-2`: 8px (0.5rem) - Internal component padding.
- `space-3`: 12px (0.75rem) - Standard container padding.
- `space-4`: 16px (1rem) - Spacing between distinct panel sections.
- `space-6`: 24px (1.5rem) - Macro structural spacing.
- `space-8`: 32px (2rem) - Outer page margins.

## 4. Radius
- `radius-none`: 0px - Deepest structural panels (Inspector, Toolbar edges touching screen bounds).
- `radius-sm`: 4px - Inputs, small buttons, badges.
- `radius-md`: 6px - Standard cards, dropdown menus, modals.
- `radius-lg`: 8px - Floating UI panels, detached toolbars.
- `radius-full`: 9999px - Avatars, pill badges.

## 5. Elevation
Elevation is achieved purely through drop-shadows and subtle borders; background colors rarely change for elevation in light mode, but change drastically in dark mode.

## 6. Typography

The typography system is intentionally stark and readable.

- **Primary Font**: `Space Grotesk` - Used for all UI text, headings, and data labels.
- **Monospace Font**: `IBM Plex Mono` - Used for code, IDs, data grids, and technical metadata.
- **Weight**: 400 (Regular) for body, 500 (Medium) for UI labels/buttons, 600 (SemiBold) for panel headers.
- **Tracking**: `-0.01em` on text above 16px, `0em` on text 14px and below.

## 7. Color Tokens
Using HSL for programmatic manipulation.
- `--axiom-gray-100`: `hsl(0, 0%, 96%)`
- `--axiom-gray-900`: `hsl(0, 0%, 9%)`
- `--axiom-accent`: `hsl(210, 100%, 50%)` (Electric Blue - distinct from standard corporate blues; highly vibrant).

## 8. Semantic Colors
- `primary`: `--axiom-accent` (Blue)
- `success`: `hsl(142, 71%, 45%)` (Mint Green)
- `warning`: `hsl(38, 92%, 50%)` (Amber)
- `danger`: `hsl(348, 83%, 47%)` (Crimson)
- `info`: `hsl(210, 100%, 50%)` (Matches Primary)

## 9. Light Mode
- **Background**: Pure White `#FFFFFF`.
- **Panel Background**: Off-white `#F9FAFB`.
- **Borders**: Extremely subtle `#E5E7EB`.
- **Text**: `#111827` for high-contrast headers, `#4B5563` for secondary labels.

## 10. Dark Mode
- **Background**: True Black `#000000`.
- **Panel Background**: Dark Grey `#0A0A0A`.
- **Borders**: `#27272A`.
- **Text**: `#FAFAFA` (Headers), `#A1A1AA` (Secondary).

## 11. Icon Guidelines
- **System**: Lucide Icons.
- **Stroke**: Strictly `1.5px`.
- **Size**: `16x16` for dense panels, `20x20` for global navigation.
- **Style**: No fills, sharp and geometric.

## 12. Illustration Guidelines
- Minimalist, vector-based, monochromatic with a single pop of `--axiom-accent`. Used exclusively in empty states and onboarding. No human figures; focus on geometric, abstract representations of data and structure.

## 13. Motion Guidelines
- **Duration**: `150ms` for micro-interactions, `300ms` for macro structural shifts.
- **Easing**: Spring physics only. Custom bezier: `cubic-bezier(0.175, 0.885, 0.32, 1.275)` for satisfying, snappy snaps.

## 14. Accessibility
- Minimum contrast ratio of 4.5:1 for all text.
- `aria-label` required on all icon-only buttons.
- Global `prefers-reduced-motion` CSS media query that kills all transition durations instantly.

## 15. Responsive Rules
The Builder UI is strictly Desktop/Tablet only. The generated Canvas previews simulate mobile via CSS iframes. Dashboard/SaaS pages are mobile-first.

## 16. Breakpoints
- `sm`: 640px
- `md`: 768px (Tablet - minimum width for builder interface)
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## 17. Component Tokens
- `--button-h`: 32px (dense)
- `--input-h`: 32px (dense)
- `--panel-w`: 280px (fixed left/right sidebars)

## 18. Shadow Tokens
- `shadow-sm`: `0 1px 2px 0 rgb(0 0 0 / 0.05)`
- `shadow-md`: `0 4px 6px -1px rgb(0 0 0 / 0.1)` (Dropdowns)
- `shadow-lg`: `0 10px 15px -3px rgb(0 0 0 / 0.1)` (Modals)
- `shadow-glow`: `0 0 0 2px var(--axiom-accent)` (Focus rings)

## 19. Animation Tokens
- `--animate-in`: `fade-in slide-in-from-bottom-2`
- `--animate-out`: `fade-out zoom-out-95`

## 20. Theme Tokens
CSS variables scoped to `:root` and `.dark` allowing seamless swapping without React re-renders.

## 21. Container Rules
Max-width for read-only dashboard content is `1200px`. The Builder Canvas is `100vw/100vh` strictly `overflow-hidden`.

## 22. Padding Rules
Use internal padding geometrically relative to radius. A `radius-md` (6px) component must have at least `space-2` (8px) padding to look mathematically sound.

## 23. Margin Rules
Elements do not own their margins. Margins are applied by parent layout components (e.g., `<Stack gap={4}>`).

## 24. Interaction Rules
Every interactive element must have 3 distinct states mapped: `default`, `hover`, and `active` (pressed).

## 25. Focus Rules
Focus states are NOT optional. Use a `shadow-glow` (2px solid electric blue border) with a `2px` offset. Never use standard browser outlines.

## 26. Hover Rules
Hover states in dense panels should alter background color (e.g., to `--axiom-gray-100`) rather than text color, to prevent reading flicker.

## 27. Loading Rules
No spinners for data loading. Use skeleton loaders for structural loads, and top-edge indeterminate progress bars (like YouTube/Linear) for route transitions.

## 28. Skeleton Rules
Skeletons pulse via opacity (not sweeping gradients) from `10%` to `40%`. They must exactly match the bounding box of the data they replace.

## 29. Toast Rules
Bottom-right placement. Max 3 stacked. Auto-dismiss after `4000ms`. Requires a swipe-to-dismiss gesture on touch.

## 30. Notification Rules
Global system notifications appear at top-center. Requires explicit user action to dismiss (e.g., "Deployment Failed").

## 31. Modal Rules
Overlay uses a 50% opacity black background with a `backdrop-blur-sm` (4px). Modals slide up slightly (`translate-y-4`) while fading in.

## 32. Drawer Rules
Used for global settings. Slides in from the right edge. Full height. Darkens the underlying canvas.

## 33. Panel Rules (Left/Right)
Fixed width (280px). Resizable via a `1px` grab handle. Content inside panels must use vertical scroll with an invisible scrollbar until hovered.

## 34. Property Panel Rules (Right Side)
Grid layout specifically. `Label` on the left (gray text, 40% width), `Input` on the right (60% width). Values update on `onBlur` or `Enter`, not `onChange`, to save DB mutations.

## 35. Builder Toolbar Rules (Top Center)
Floating pill (`radius-full`) decoupled from the top edge by 16px. Contains primary creation tools (Add Text, Add Div, Add Image). Casts a heavy `shadow-lg`.

## 36. Canvas Rules
The infinite workspace. Zoomable via CMD+Scroll. Pannable via Spacebar+Drag. Renders an iframe internally to perfectly isolate user CSS from builder UI CSS.

## 37. Selection Rules
When a user clicks a node in the Canvas, draw a 1px solid `--axiom-accent` bounding box around it. Display a floating tag at the top-left of the box showing the HTML tag name (e.g., `div`).

## 38. Layer Rules (Left Side)
Tree view representing the DOM. Drag and drop reordering. Hovering a layer highlights the corresponding Canvas element in a faint blue overlay.

## 39. Inspector Rules
Only shows CSS properties relevant to the selected element. Utilizes collapsible accordions (Layout, Typography, Spacing, Borders).

## 40. Keyboard Shortcut Rules
Global listener attached to the Canvas.
- `V`: Move Tool
- `T`: Text Tool
- `R`: Rectangle/Div Tool
- `CMD/CTRL + Z`: Undo (local Zustand state rewind)
- `CMD/CTRL + D`: Duplicate Node
- `Delete/Backspace`: Remove Node
