# Page Builder & Routing Specification

**Overview**: The Page Builder governs how individual pages are instantiated, routed, protected, and ultimately rendered to the end-user. It bridges the visual drag-and-drop canvas (Builder Engine) with the structural navigation and SEO requirements of a production-grade website.

---

## 1. Page Scaffolding (Templates)
When a user clicks "Create New Page," they can start from a blank slate or utilize pre-configured macro-layouts:
- **Blank Page**: An empty canvas with only the global Theme Provider attached.
- **Landing Page**: Highly optimized, un-nested route (e.g., `/campaign`) lacking global headers/footers to maximize conversion rates.
- **Business Page**: Standard corporate layouts (e.g., `/about`, `/services`) that automatically inherit the global Header and Footer components.
- **Portfolio / Case Study**: Grid-heavy layouts optimized for high-resolution imagery.
- **Blog**: Dynamic template (`/blog/[slug]`) bound to the CMS, featuring reading progress bars and social sharing blocks.
- **Store**: E-commerce layouts (`/product/[id]`) bound to the Products CMS, featuring image carousels and "Add to Cart" interactions.
- **Legal**: Text-heavy, minimalist layouts for `/privacy` and `/terms` with automatic "Last Updated" timestamp bindings.
- **Contact**: Pre-configured with a secure Form component, map embed, and reCAPTCHA integration.
- **Pricing**: Pre-configured with dynamic pricing tables and a billing toggle (Monthly/Annually).

## 2. Advanced Routing Engine
The routing layer is built on top of Next.js App Router mechanics, abstracting the complexity away from the user.
- **Custom Route**: Users can define arbitrary static paths (e.g., setting a page to `/our-story/2026`).
- **Nested Route**: Visual folder structures in the Page Panel map to URLs (e.g., placing `Team` inside `About` generates `/about/team`).
- **Dynamic Route**: Pages tied to a CMS collection. A single canvas design for `/blog/[slug]` generates hundreds of static pages at build time based on the database entries.
- **Protected Route**: Pages hidden behind authentication. The user toggles "Requires Login" and selects allowed Roles (from the CMS RBAC). Unauthenticated users are intercepted by Edge Middleware and redirected to `/login`.
- **Search Page**: A dedicated `/search` route that connects to an internal Algolia or Postgres Full-Text Search index, rendering dynamic query results.
- **404 (Not Found)**: A customizable error page. Users can drag-and-drop a fun, branded 404 layout.
- **500 (Server Error)**: A fallback static page rendered if the database or edge function completely fails.

## 3. SEO & Machine-Readable Data
Every page includes a dedicated SEO Panel to strictly manage metadata and search indexing.
- **Open Graph & Twitter Card**: Users upload specific 1200x630 images and descriptions. The engine injects `<meta property="og:image" content="..." />` and `twitter:card` tags into the document `<head>`.
- **Canonical URL**: Automatically generated based on the primary custom domain to prevent duplicate content penalties, with manual override capabilities.
- **Breadcrumb**: Automatically generated JSON-LD Schema based on the Nested Route hierarchy, helping Google display rich search results.
- **Structured Data**: Built-in Schema.org JSON-LD generators (e.g., `Article` schema for blogs, `Product` schema for store pages).
- **Sitemap**: An XML file (`/sitemap.xml`) generated dynamically at the Edge, indexing all published static and dynamic routes.
- **RSS**: An XML feed (`/feed.xml`) automatically generated for any CMS Collection marked as "Syndicatable" (like Blogs or Podcasts).

---

## 4. The Complete Rendering Process
When an end-user visits a published website (e.g., `https://www.customer-site.com/blog/hello-world`), the system executes the following flow:

### Phase 1: Edge Interception & Routing
1. **Request Hits CDN**: The request reaches the Cloudflare/Vercel Edge CDN.
2. **Middleware Evaluation**: Next.js Edge Middleware inspects the hostname (`www.customer-site.com`). It queries the Edge Cache to map the domain to a specific `WorkspaceID` and `WebsiteID` in our database.
3. **Protection Check**: The Middleware checks if the requested path is a **Protected Route**. If yes, it validates the JWT cookie. If unauthorized, it returns a 302 redirect.

### Phase 2: Data Fetching (Server Components)
4. **Route Match**: The Next.js App Router matches the path (`/blog/[slug]`).
5. **Fetch VDOM**: The server fetches the Page's JSON Virtual DOM tree from PostgreSQL (via Prisma).
6. **Fetch CMS Data**: Recognizing it as a **Dynamic Route**, the server extracts the `[slug]` parameter, queries the CMS for the specific Blog entry, and retrieves the dynamic data (Title, Content, Author).
7. **Hydrate VDOM**: The engine traverses the JSON VDOM tree, injecting the CMS data into the mapped UI nodes (e.g., mapping `Blog.Title` into the `<H1>` node).

### Phase 3: Compilation & SEO Injection
8. **Theme Application**: The global **Theme Engine** JSON is fetched, compiling the dynamic CSS variables (`--primary-color`) into a `<style>` block.
9. **SEO Assembly**: The **SEO Metadata** (Open Graph, Canonical URL, JSON-LD Structured Data) is compiled into the document `<head>`.
10. **React Render**: Next.js React Server Components (RSC) render the fully hydrated VDOM tree into static HTML.

### Phase 4: Delivery & Caching
11. **Response**: The raw HTML string is sent to the user's browser.
12. **Edge Cache (ISR)**: The resulting HTML is cached at the CDN Edge (using Incremental Static Regeneration). The next million visitors hitting `/blog/hello-world` will receive the cached HTML in <50ms without hitting our PostgreSQL database.
13. **Client Hydration**: The browser paints the HTML. React loads the minimal JavaScript required for interactive components (like Carousels or Forms), avoiding heavy client-side rendering.
