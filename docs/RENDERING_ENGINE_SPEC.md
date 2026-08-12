# Rendering Engine Specification

**Overview**: The Rendering Engine is the hyper-optimized delivery layer of the platform. Its sole objective is to guarantee a Lighthouse Performance Score > 95 and perfect Core Web Vitals across all published enterprise sites, regardless of CMS data complexity or visual density.

---

## 1. Rendering Strategies
The engine heavily leverages the Next.js App Router to apply the mathematically optimal rendering strategy on a per-route and per-component basis.

- **SSG (Static Site Generation)**: Used for the vast majority of non-dynamic pages (e.g., `/about`, `/terms`). At build time, the Virtual DOM is compiled into raw HTML. Zero database calls occur at runtime.
- **ISR (Incremental Static Regeneration)**: Used for CMS-backed pages (e.g., `/blog/[slug]`). Pages are statically generated, but if a CMS record is updated, the engine rebuilds the page in the background (using `revalidateTag` or Webhooks). Users always see instant cached HTML, while the cache self-heals behind the scenes.
- **SSR (Server-Side Rendering)**: Used strictly for highly dynamic or protected routes where data cannot be cached (e.g., `/dashboard` or user-specific shopping carts). HTML is generated on the server at request time.
- **CSR (Client-Side Rendering)**: Avoided for initial page loads. CSR is restricted entirely to interactive micro-components embedded deep within the page (e.g., a "Like" button or a filtering dropdown) loaded via the `"use client"` directive.

## 2. Advanced React Architecture
- **Streaming & Suspense**: The engine utilizes React Suspense boundaries. During SSR, critical above-the-fold HTML is streamed instantly to the browser. Heavy components (e.g., below-the-fold CMS queries) are wrapped in `<Suspense fallback={<Skeleton />}>` and streamed in chunks as the database resolves them.
- **Partial Rendering**: Next.js App Router allows partial rendering on navigation. When a user clicks a link, only the page segment that changes is re-rendered; global layouts (Headers/Footers) are preserved in memory, drastically reducing TTFB (Time to First Byte).
- **Incremental Rendering**: Achieved through ISR. Massive sites (10,000+ pages) do not build all at once. The engine builds the top 100 pages, and incrementally renders the rest on-demand upon first visit, caching them permanently thereafter.
- **Edge Rendering**: For personalized marketing pages (e.g., geo-targeted content), the rendering engine runs on Vercel Edge Functions (Cloudflare Workers) nearest to the user, compiling HTML in <10ms without hitting US-East databases.

## 3. Asset & CSS Optimization
- **Static Optimization**: The engine automatically detects pages that lack dynamic data requirements and strictly compiles them to pure static HTML/CSS files, bypassing Node.js servers entirely.
- **Image Optimization**: All images (user uploads & template assets) route through the `next/image` API. 
  - Converts JPEGs/PNGs to WebP/AVIF formats automatically.
  - Dynamically resizes images based on the requester's device viewport (`srcset`).
- **Lazy Loading**: Native browser lazy loading (`loading="lazy"`) is applied to every image and iframe below the fold.
- **Asset Loading**: Third-party scripts (e.g., Google Analytics, Intercom) use the Next.js `<Script>` tag with `strategy="worker"` (Partytown) or `strategy="lazyOnload"` to prevent them from blocking the main thread.
- **Critical CSS**: TailwindCSS generates highly atomic utility classes. The engine extracts the exact CSS used on the page and inlines it into the `<head>`, eliminating render-blocking CSS files.
- **Dynamic CSS**: For Theme Engine variables (e.g., custom brand colors), dynamic variables are injected into an inline `<style>` tag, cascading efficiently without triggering massive CSS object model (CSSOM) recalculations.

## 4. Hydration & SEO
- **Hydration**: React hydration is minimized. Because 90% of the builder components are React Server Components (RSC), they transmit zero JavaScript to the client. Only components with interactivity (`"use client"`) undergo hydration, keeping the JS bundle minuscule.
- **SEO Rendering**: Bots (Googlebot, Bing) receive 100% pre-compiled HTML. Because all OpenGraph metadata, JSON-LD structured data, and CMS content is injected server-side via RSC, SEO indexing is flawless and does not rely on Google executing JavaScript.

## 5. Caching & Delivery
- **Caching**: Multi-layered. 
  - *Data Cache*: Prisma queries wrapped in React `cache()` to prevent duplicate DB calls in the same render cycle.
  - *Full Route Cache*: The compiled HTML payload is stored persistently across deployments unless explicitly revalidated.
- **CDN**: Cloudflare/Vercel Edge Network. Assets and HTML are replicated across 300+ global edge nodes, ensuring a user in Tokyo gets the same 20ms response time as a user in New York.

## 6. Performance Metrics
All architectural decisions above enforce one non-negotiable metric:
- **Target Lighthouse Score**: strictly **>95** across Performance, Accessibility, Best Practices, and SEO for all generated websites.
- **Core Web Vitals**:
  - **LCP (Largest Contentful Paint)**: < 2.5s (Achieved via Server Components, Critical CSS, and Image Optimization).
  - **FID / INP (Interaction to Next Paint)**: < 100ms (Achieved by stripping JS payload via RSC and deferring third-party scripts).
  - **CLS (Cumulative Layout Shift)**: < 0.1 (Achieved by enforcing strict `width` and `height` attributes on all images and pre-reserving space for Suspense boundaries).
