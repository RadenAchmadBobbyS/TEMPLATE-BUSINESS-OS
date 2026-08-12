# Engineering Roadmap & Implementation Backlog

**Overview**: This document acts as the definitive engineering backlog, synthesizing all 29 architectural specifications into a structured 5-Phase execution plan. It is designed to guide developers linearly from foundational infrastructure to advanced enterprise scalability.

---

## Phase 1 (MVP) - Foundation & Core Builder

**Objective**: Establish the base infrastructure, user identity, multi-tenancy, and a functional drag-and-drop Page Builder with basic edge routing.

### Milestone 1.1: Core Infrastructure & Identity
- **Objective**: Setup the Next.js foundation, Database, and Auth.
- **Features Included**: Docker/PM2 Setup, Prisma configuration, NextAuth (Auth.js) Email/OAuth logins, Multi-Tenant Workspace tables.
- **Dependencies**: None.
- **Estimated Complexity**: Low
- **Priority**: Critical (P0)
- **Deliverables**: Deployed DB, User Registration flow, Workspace Switcher UI.
- **Acceptance Criteria**: A user can register, create an isolated Workspace, and log in securely.

### Milestone 1.2: The Canvas & Builder Engine (V1)
- **Objective**: Implement the visual JSON tree editor.
- **Features Included**: Axiom Design System tokens, Drag-and-drop components (Section, Grid, Text, Button), Canvas state management (Zustand/Redux), JSON serialization.
- **Dependencies**: Milestone 1.1
- **Estimated Complexity**: High
- **Priority**: Critical (P0)
- **Deliverables**: The Builder UI (`/builder/{id}`) capable of constructing static pages.
- **Acceptance Criteria**: A user can drag components onto a canvas, edit text, save, and the DB stores the `PAGE_VERSION` JSON tree.

### Milestone 1.3: Static Edge Rendering & Basic Publishing
- **Objective**: Serve the JSON tree as a public website.
- **Features Included**: Next.js App Router Catch-all (`[...slug]`), Incremental Static Regeneration (ISR), Platform Subdomains (`[uuid].platform.com`), Basic Publishing Queue.
- **Dependencies**: Milestone 1.2
- **Estimated Complexity**: Medium
- **Priority**: Critical (P0)
- **Deliverables**: Public-facing websites.
- **Acceptance Criteria**: Clicking "Publish" successfully translates the JSON tree into cached React DOM at a public subdomain URL.

---

## Phase 2 - Dynamic Ecosystem & Commerce

**Objective**: Introduce dynamic data structures (Headless CMS), recurring revenue mechanics (Billing), and styling abstractions (Theme Engine).

### Milestone 2.1: Headless CMS Engine
- **Objective**: Decouple data from design.
- **Features Included**: Custom Schemas (Collections), Field Types (Text, Rich Text, Image, Reference), CMS Data Grid UI, Dynamic Route mapping in the Builder.
- **Dependencies**: Milestone 1.3
- **Estimated Complexity**: High
- **Priority**: High (P1)
- **Deliverables**: Fully functioning CMS dashboard and dynamic page generation (e.g., `/blog/[slug]`).
- **Acceptance Criteria**: Users can create a "Blog" schema, add 3 posts, and render them dynamically on the public site using a single Builder template.

### Milestone 2.2: Theme Engine & Asset Library
- **Objective**: Global aesthetic control and media management.
- **Features Included**: S3 direct-upload via Presigned URLs, Edge Image Optimization (WebP), CSS Variable orchestration (Colors, Typography).
- **Dependencies**: Milestone 2.1
- **Estimated Complexity**: Medium
- **Priority**: High (P1)
- **Deliverables**: Media Library UI, Global Theme Editor panel in the Builder.
- **Acceptance Criteria**: Changing the "Brand Color" in the Theme Engine instantly reflects across all components on the Canvas.

### Milestone 2.3: Subscriptions & Payment Gateways
- **Objective**: Monetize the platform.
- **Features Included**: Stripe/Midtrans integration, Plan Tiers (Free, Pro, Enterprise), Webhook processing, Quota enforcements (Storage/Bandwidth).
- **Dependencies**: Milestone 1.1
- **Estimated Complexity**: High
- **Priority**: Critical (P0)
- **Deliverables**: Billing Dashboard, Subscription state machine, gated features.
- **Acceptance Criteria**: Users must enter a credit card to upgrade to Pro; Webhooks successfully mark subscriptions active or past-due.

---

## Phase 3 - Scale & External Routing

**Objective**: Enable users to bring their own domains and achieve maximum SEO and performance.

### Milestone 3.1: Custom Domains & SSL
- **Objective**: Platform routing for BYOD (Bring Your Own Domain).
- **Features Included**: Domain verification (TXT polling), SSL provisioning (Let's Encrypt), Edge Middleware routing, HTTPS/WWW redirects.
- **Dependencies**: Milestone 1.3
- **Estimated Complexity**: High
- **Priority**: High (P1)
- **Deliverables**: Domains Dashboard, working custom URLs.
- **Acceptance Criteria**: A user can map `www.acme.com`, pass DNS verification, and visit their site securely via HTTPS.

### Milestone 3.2: SEO Engine & Redirects
- **Objective**: Make sites discoverable.
- **Features Included**: JSON-LD generation, automated `sitemap.xml`, 301/302 Redirect Manager, Meta tag editors, 404 tracking.
- **Dependencies**: Milestone 3.1
- **Estimated Complexity**: Medium
- **Priority**: High (P1)
- **Deliverables**: SEO Sidebar in Builder, Redirect Dashboard.
- **Acceptance Criteria**: Sitemaps are automatically generated; mapping a 301 redirect successfully forwards traffic at the Edge in <10ms.

---

## Phase 4 - Analytics & Engagement

**Objective**: Provide users with deep insights and establish background queuing for mass communication.

### Milestone 4.1: High-Velocity Analytics
- **Objective**: Cookieless traffic tracking and visual heatmaps.
- **Features Included**: Edge beacon tracking, Redis streams ingestion, ClickHouse/Postgres OLAP architecture, Heatmap iframe overlays.
- **Dependencies**: Milestone 3.1
- **Estimated Complexity**: High
- **Priority**: Medium (P2)
- **Deliverables**: Analytics Dashboard with Visitors/Sessions charts.
- **Acceptance Criteria**: Visiting a live site instantly registers a pageview in the real-time dashboard without utilizing tracking cookies.

### Milestone 4.2: Notification System & Support Center
- **Objective**: User communication and ticket triage.
- **Features Included**: Email templates (SES/SendGrid), WebSockets for In-App toasts, Ticketing system with SLAs, Super Admin triage view.
- **Dependencies**: Milestone 1.1
- **Estimated Complexity**: Medium
- **Priority**: Medium (P2)
- **Deliverables**: Notification Bell UI, Support Dashboard, Intercom/Zendesk HMAC integration.
- **Acceptance Criteria**: Failing a deployment automatically fires an In-App toast and a fallback Email to the user.

---

## Phase 5 - Enterprise Ecosystem

**Objective**: Finalize the platform for mass B2B adoption and template marketplaces.

### Milestone 5.1: Template Engine & Marketplace
- **Objective**: Allow users to start from pre-built foundations.
- **Features Included**: Template cloning, Marketplace UI, Industry categorizations, Website exporting.
- **Dependencies**: Milestone 1.2, 2.1
- **Estimated Complexity**: Medium
- **Priority**: Medium (P2)
- **Deliverables**: Template selection during onboarding.
- **Acceptance Criteria**: Clicking a template generates a fully populated website (JSON trees + CMS data) instantly.

### Milestone 5.2: Documentation & Super Admin Panel
- **Objective**: Internal platform governance.
- **Features Included**: MDX-powered public Docs, Algolia search, User impersonation (Admin), Global revenue dashboards.
- **Dependencies**: Phase 1-4 Complete
- **Estimated Complexity**: Low
- **Priority**: Medium (P2)
- **Deliverables**: `admin.platform.com` and `docs.platform.com`.
- **Acceptance Criteria**: Support staff can securely impersonate a user via temporary JWT; Developers can search the API docs instantly via CMD+K.
