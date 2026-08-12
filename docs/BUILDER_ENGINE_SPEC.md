# Website Builder Engine Specification
**Status**: Production Ready Blueprint
**Inspirations**: Figma (Canvas/Zoom/Pan), Webflow (Flex/Grid semantics), Framer (Animations/Components).

---

## 1. Internal Architecture (Engine Core)
The Builder Engine operates strictly on a **Virtual DOM (VDOM) JSON Tree**. 
- **State Management**: Built on `Zustand` for lightning-fast, boilerplate-free state updates, combined with `Immer` for immutable tree mutations.
- **Data Structure**: A deeply nested JSON tree where each node possesses a unique `uuid`, `type` (e.g., div, image, custom component), `props` (e.g., src, text), and `styles` (CSS-in-JS or Tailwind classes).
- **Rendering Pipeline**: The React engine recursively loops through the JSON tree, passing `props` and dynamically generating React components wrapped in a `ForwardRef` to allow bounding-box calculations.

## 2. The Canvas
- **Canvas**: The main viewport. Runs entirely within an `<iframe>` to guarantee that the builder’s UI CSS (Tailwind) does not bleed into or conflict with the user's custom website CSS.
- **Infinite Canvas**: The workspace extends infinitely. Uses CSS `transform: matrix()` on a wrapper `div` to handle pan and zoom without triggering expensive DOM reflows.
- **Zoom**: Controlled via `CMD/CTRL + Scroll` or Pinch-to-zoom. Matrix scaling from `10%` to `400%`.
- **Pan**: Spacebar + Drag. Modifies the X/Y translation values of the matrix transform.
- **Snap**: Nodes automatically snap to edges and centers of parent containers and sibling nodes during absolute positioning, utilizing a tolerance threshold of `5px`.
- **Guideline**: Static user-placed rulers (X/Y axis) that generate magnetic snapping points.
- **Smart Guide**: Ephemeral pink lines (`--axiom-accent`) that appear momentarily when an element aligns perfectly with another element's center or edge during drag operations.

## 3. Interaction & Selection
- **Selection**: Clicking a node triggers a Raycast calculation (since elements might be nested/overlapping). An SVG overlay draws a 1px blue border bounding box over the selected element.
- **Multi Selection**: `Shift + Click` or dragging a marquee box. Calculates bounding box intersection. Wraps all selected nodes in a virtual grouped bounding box.
- **Duplicate**: `CMD/CTRL + D`. Deep-clones the JSON node, issues a new `uuid`, and appends it to the parent array.
- **Copy / Paste**: Serializes the JSON node to the OS clipboard (`navigator.clipboard`) allowing pasting between different browser tabs.
- **Grouping**: `CMD/CTRL + G`. Wraps selected nodes into a new `div` node in the JSON tree.
- **Ungroup**: `CMD/CTRL + Shift + G`. Removes the parent wrapper and hoists children to the grandparent node.

## 4. State & Visibility Control
- **Lock**: Sets `locked: true` on the JSON node. Prevents selection via canvas click (can only be selected via Layer Panel) and prevents drag-and-drop.
- **Hide**: Sets `hidden: true` (CSS `display: none`). Removes element from the visual flow but retains it in the JSON tree.

## 5. Layout Primitives (Nodes)
- **Frame**: Inherited from Figma. Absolute positioning bounding box used strictly for fixed-layout sections or initial web-design prototyping.
- **Section**: Semantic `<section>` tag. 100% width, used for vertical stacking of macro layouts.
- **Container**: Max-width constraints (e.g., `1200px`) centered automatically (`margin: 0 auto`).
- **Columns / Rows**: Abstractions over Flexbox. Preset properties (`flex-direction: row/column`).
- **Grid**: True CSS Grid (`display: grid`). Allows visual drawing of grid tracks and areas via the canvas.
- **Flex**: True CSS Flexbox. Drag-and-drop elements within a flex parent reorders the array indices in the JSON tree.
- **Absolute**: Removes element from normal document flow. X/Y coordinates map directly to `top`/`left` CSS properties based on the nearest relative parent.
- **Relative**: Standard document flow, acts as a coordinate anchor for absolute children.
- **Nested Component**: A pointer node. Instead of deeply storing the JSON, it stores a `componentId`. The engine fetches the master component tree and renders it. Edits to the master update all instances.

## 6. History & Persistence
- **Undo / Redo**: Managed via a state history stack. Every mutation pushes a deep clone of the tree (or a JSON patch) to the `past` array. Max depth: 50.
- **History**: Visual ledger in the UI showing recent actions ("Moved Text", "Changed Color"). Allows jumping back multiple states instantly.
- **History Manager**: Long-term version control (e.g., "V1.2 - Pre-Launch"). Stored in PostgreSQL, allowing full rollbacks of the entire site.
- **Autosave**: Fires 2000ms after the last DOM mutation.
- **Realtime Save**: Utilizes WebSockets (or Next.js Server Actions with optimistic UI) to sync the JSON tree to the DB seamlessly without blocking the main thread.

## 7. Editor Panels (The UI Chrome)
- **Layer Panel**: Left sidebar. A recursive tree view matching the JSON VDOM exactly. Allows drag-and-drop reordering.
- **Outline Panel**: Filtered view of the Layer panel, showing only semantic headers (H1-H6) and major Sections for quick document navigation.
- **Component Tree**: Displays Master components (Symbols). Dragging from this panel instantiates a Nested Component on the canvas.
- **Properties Panel**: Right sidebar. Highly contextual. Only shows CSS controls (Typography, Spacing, Borders) relevant to the currently selected node's `type`.
- **Assets Panel**: Left sidebar tab. Connects to S3. Displays uploaded images, SVGs, and Lottie files. Supports drag-and-drop directly onto the canvas.
- **Media Panel**: For managing global media queries (Desktop, Tablet, Mobile Breakpoints).
- **Animation Panel**: Right sidebar tab. Assigns Framer Motion directives (`initial`, `animate`, `exit`) to the node. E.g., Scroll-triggered fade-ins.
- **Interaction Panel**: Assigns JavaScript event listeners. E.g., `onClick -> Open Modal`, `onHover -> Play Lottie`.
- **Theme Panel**: Global CSS Variables manager. Defines `--primary-color`, global typography scales, and border radii.
- **CMS Panel**: Bottom drawer or Left sidebar. Binds UI nodes to database fields. (e.g., binding a Text node to `Post.Title`).
- **SEO Panel**: Right sidebar tab (active when Page root is selected). Controls `<title>`, `<meta>`, OpenGraph images, and canonical tags.
- **Publishing Panel**: Top right. Controls domain routing, staging/production environments, and triggers the Vercel SSG build pipeline.

## 8. Keyboard Shortcuts (Kinetics)
- `Space + Drag`: Pan Canvas
- `Z + Click / Drag`: Zoom to marquee
- `CMD/CTRL + Scroll`: Zoom
- `CMD/CTRL + Z`: Undo
- `CMD/CTRL + Shift + Z`: Redo
- `V`: Pointer Tool
- `T`: Text Node Tool
- `F`: Frame/Section Tool
- `CMD/CTRL + G`: Group Selection
- `CMD/CTRL + L`: Lock Element
- `CMD/CTRL + Shift + H`: Hide Element
- `Option/Alt + Drag`: Quick Duplicate
