# SEO Engine Specification

**Overview**: The SEO Engine is deeply integrated into the rendering pipeline. It automates the generation of machine-readable metadata, handles complex URL redirection, and employs AI to proactively audit and suggest search optimizations, ensuring that every published site achieves maximum organic visibility.

---

## 1. On-Page Metadata & Social Graph

**Supported Elements**: Meta Tags, OpenGraph (OG), Twitter Card, Canonical URL, Robots.

### A. Workflow
1. When a user creates a `Page` or a dynamic `CMS_Entry`, the UI presents an "SEO Settings" panel.
2. The user inputs custom titles, descriptions, and uploads a specific 1200x630 social image.
3. If left blank, the system automatically falls back to generating a title from the `H1` tag and extracting the first paragraph for the description.

### B. Database
- Stored within the `Page` table (for static routes) and `CMS_Entry` table (for dynamic routes) in a dedicated `seo_metadata` JSONB column.

### C. API
- `PUT /api/v1/websites/{id}/pages/{pageId}/seo`: Updates the specific JSONB metadata payload.

### D. Rendering Strategy
- **React Server Components (RSC)**: Metadata is injected directly into the Next.js `generateMetadata()` API during Server-Side Rendering. This ensures bots like Googlebot and Twitterbot parse the `<head>` tags instantly without executing JavaScript.

---

## 2. Structured Data & Indexing

**Supported Elements**: Sitemap, RSS, Schema.org, JSON-LD, Breadcrumb.

### A. Workflow
1. The engine automatically maps CMS data types to standard Schema.org protocols (e.g., A CMS Model named "Products" automatically generates `Product` JSON-LD; "Blog" generates `Article` JSON-LD).
2. As pages are created or nested in folders, Breadcrumb JSON-LD is dynamically calculated based on the URL path.
3. `sitemap.xml` and `feed.xml` (RSS) are updated incrementally upon any publish event.

### B. Database
- `CMS_Model` schema configurations contain a mapping attribute (e.g., `schema_org_type: "Article"`).

### C. API
- `GET /sitemap.xml` and `GET /feed.xml` are native endpoints in the Next.js `app/` directory (e.g., `app/sitemap.ts`) that query the database dynamically.

### D. Rendering Strategy
- **Edge Generation & Caching**: Sitemaps for enterprise sites can be massive. They are generated dynamically via Edge Functions and heavily cached using Incremental Static Regeneration (ISR), refreshing only when a new page is published.

---

## 3. Advanced Contextual SEO

**Supported Elements**: Image SEO, Blog SEO, Product SEO, Business SEO, AI SEO.

### A. Workflow
- **Image SEO**: The Builder Engine enforces mandatory `alt` tags on all `<Image>` components. If missing, the **AI SEO** engine runs a computer vision pass to auto-generate descriptive alt text.
- **Contextual SEO**: Pre-configured JSON-LD templates apply strictly to specific templates. E.g., The "Business" template automatically injects `LocalBusiness` Schema containing coordinates, opening hours, and phone numbers.
- **AI SEO (Generative)**: An integrated LLM evaluates the page content and suggests higher-performing `<title>` tags, H1 variations, and identifies keyword density gaps.

### B. Database
- **AI Credit** consumption is tracked in the `USAGE_RECORD` table every time the AI SEO suggestion API is triggered.

### C. API
- `POST /api/v1/ai/seo-suggest`: Sends the current `Page.node_tree` textual content to an LLM provider and returns structured SEO suggestions.

### D. Rendering Strategy
- Generated JSON-LD payloads are serialized as strings and embedded into the `<script type="application/ld+json">` tag within the document `<head>` during the SSG build step.

---

## 4. Redirects & Link Architecture

**Supported Elements**: Internal Link, Redirect, 404, 301, 302.

### A. Workflow
1. If a user alters the `slug` of an already-published page (e.g., `/old-services` to `/new-services`), the engine automatically creates a `301 Permanent Redirect` rule to preserve SEO juice.
2. Users can manually configure `302 Temporary Redirects` for marketing campaigns.
3. If a visitor hits a missing route, they are served a custom, branded **404 Page** (designed in the Builder Engine) that includes an intelligent **Internal Link** block suggesting related pages based on the failed URL string.

### B. Database
- **Table**: `REDIRECT` (`id`, `website_id`, `source_path`, `destination_path`, `status_code_type`).

### C. API
- `POST /api/v1/websites/{id}/redirects`: Configures manual redirect maps.

### D. Rendering Strategy
- **Edge Middleware**: Next.js Middleware (`middleware.ts`) intercepts the request before it hits the Next.js router. It checks a fast Redis cache for the `source_path`. If a match is found, the Middleware returns a `301` or `302` response in <10ms, avoiding server compute entirely.

---

## 5. Diagnostics & Performance

**Supported Elements**: SEO Audit, Page Speed, Core Web Vitals.

### A. Workflow
1. The user clicks "Run SEO Audit" in the dashboard.
2. A background worker queries the Google PageSpeed Insights (Lighthouse) API against the Staging or Production URL.
3. The engine aggregates the scores (LCP, CLS, FID) and presents a checklist of actionable fixes (e.g., "Compress Hero Image", "Add Meta Description to Page X").

### B. Database
- **Table**: `SEO_AUDIT_LOG` (`id`, `website_id`, `score_json`, `timestamp`).

### C. API
- `POST /api/v1/websites/{id}/seo-audit`: Triggers the background worker and polls for results.

### D. Rendering Strategy
- As defined in the Rendering Architecture, the entire Next.js SSG/ISR pipeline is mathematically optimized to guarantee Core Web Vitals (LCP < 2.5s) right out of the box by strictly minimizing Client-Side JS payloads and deferring non-critical CSS.
