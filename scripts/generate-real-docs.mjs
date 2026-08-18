import fs from 'fs';
import path from 'path';

// Define the factual content for each page based on actual codebase audit
const docsContent = {
  "getting-started/introduction": {
    title: "Introduction",
    description: "Welcome to Business OS.",
    content: `## What is Business OS?

Business OS is a B2B SaaS platform template that provides workspace management, website publishing, media libraries, analytics, billing, and support ticketing in one unified system.

## Where is it?
The core dashboard is accessible at \`/dashboard\`.

## What can the user do?
- Manage workspaces
- Build and publish websites
- Track analytics
- Handle support tickets
- Manage subscriptions via Stripe/Midtrans/Xendit

## How does it work?
The system is built on Next.js App Router and Prisma. Multi-tenancy is handled via the \`Workspace\` model, where users access resources based on their assigned \`Role\`.
`
  },
  "getting-started/quickstart": {
    title: "Quickstart",
    description: "Get up and running with Business OS.",
    content: `## Quickstart

Follow these steps to deploy your first workspace and website.

1. **Create an account** via the \`/register\` page.
2. **Create a Workspace** via \`/dashboard/workspaces/new\`.
3. **Navigate to Websites** via \`/dashboard/websites\` and click "Create Website".
4. **Publish** your website via the Builder interface (\`/builder/[websiteId]/[pageId]\`).
`
  },
  "core-concepts/workspaces": {
    title: "Workspaces",
    description: "Learn how multi-tenancy and workspaces operate.",
    content: `## What is a Workspace?
A workspace is the top-level boundary for multi-tenancy. All websites, media assets, and forms belong to a workspace.

## Where is it?
- List: \`/dashboard/workspaces\`
- Creation: \`/dashboard/workspaces/new\`
- Settings: \`/dashboard/settings/workspace\`

## What can the user do?
- Create multiple workspaces.
- Invite users via \`WorkspaceInvitation\` (Route: \`/dashboard/invitations\`).
- Assign roles to members.
- Archive a workspace (\`/dashboard/workspaces/archived\`).

## Permissions
Access is governed by the \`UserRole\` model mapping a \`User\` to a \`Workspace\`.
Roles implemented in the schema:
- \`OWNER\`
- \`ADMIN\`
- \`EDITOR\`
`
  },
  "core-concepts/roles-and-permissions": {
    title: "Roles & Permissions",
    description: "Understanding the RBAC system.",
    content: `## Roles
The following roles are verified in the \`prisma.schema\`:

1. **OWNER**: Full access to delete the workspace and manage billing.
2. **ADMIN**: Can invite users and manage all resources within the workspace.
3. **EDITOR**: Can edit pages, models, and assets, but cannot manage users or billing.

## How does it work?
Authorization checks occur via Server Actions and API Routes middleware, verifying the user's session against the \`UserRole\` table for the requested \`workspaceId\`.
`
  },
  "website-builder/overview": {
    title: "Builder Overview",
    description: "Visual drag-and-drop page builder architecture.",
    content: `## What is the Builder?
The Website Builder allows visual editing of pages and sections using a drag-and-drop canvas.

## Where is it?
The builder UI is located at \`/builder/[websiteId]/[pageId]\`.

## How does it work?
1. The builder maintains a state tree (\`nodeTree\`).
2. Changes are saved as a \`PageVersion\` in PostgreSQL (stored as JSON).
3. The public rendering engine (\`/p/[websiteSlug]/[[...slug]]\`) reads the published \`PageVersion\` and dynamically renders the React DOM.

<Callout type="info">
The actual rendering happens dynamically based on the JSON \`nodeTree\` structure.
</Callout>
`
  },
  "website-builder/page-versions": {
    title: "Page Versions",
    description: "Version control for pages.",
    content: `## What is a Page Version?
Every time a page is saved in the builder, a new \`PageVersion\` record is created. The \`Page\` model keeps a reference to \`publishedVersionId\`.

## How does it work?
\`\`\`prisma
model PageVersion {
  id            String   @id @default(uuid()) @db.Uuid
  pageId        String   @db.Uuid
  versionNumber Int
  nodeTree      Json 
  createdAt     DateTime @default(now())
}
\`\`\`
When a user clicks "Publish" in the Builder, the \`Page.publishedVersionId\` is updated to the current \`PageVersion.id\`.
`
  },
  "cms/overview": {
    title: "CMS Overview",
    description: "Headless content management system.",
    content: `## What is the CMS?
The CMS allows users to define custom data models and create dynamic entries for their websites.

## Where is it?
- Models List: \`/dashboard/websites/[websiteId]/cms\`
- Model Details: \`/dashboard/websites/[websiteId]/cms/[modelId]\`
- Entry Editor: \`/dashboard/websites/[websiteId]/cms/[modelId]/[entryId]\`

## How does it work?
The CMS relies on two primary database tables:
1. \`CmsModel\`: Defines the schema (e.g., Blog Post, Product) as JSON.
2. \`CmsEntry\`: Stores the actual content instances using the \`CmsEntryStatus\` (DRAFT, PUBLISHED, SCHEDULED).
`
  },
  "media/library": {
    title: "Media Library",
    description: "Centralized asset management.",
    content: `## What is the Media Library?
The Media Library manages all uploaded assets (images, videos, documents) for a Workspace.

## Where is it?
- UI: \`/dashboard/media\`

## How does it work?
Assets are uploaded directly to cloud storage (AWS S3) using pre-signed URLs.

\`\`\`prisma
model Asset {
  id          String    @id
  workspaceId String    
  url         String
  type        AssetType
  s3Key       String    @unique
  fileHash    String
}
\`\`\`

## Features
- **Folders**: Assets can be organized into \`Folder\` hierarchies.
- **Favorites**: Users can favorite assets via the \`UserAssetFavorite\` model.
- **Tags**: Assets support tagging via \`AssetTag\`.
`
  },
  "seo/overview": {
    title: "SEO Engine",
    description: "Search Engine Optimization capabilities.",
    content: `## What is the SEO Engine?
Business OS supports metadata, Open Graph, Twitter Cards, and schema injections natively per page.

## Where is it?
- Page SEO Settings: \`/dashboard/websites/[websiteId]/pages/[pageId]/seo\`
- Redirects: \`/dashboard/websites/[websiteId]/redirects\`

## How does it work?
SEO Metadata is stored in the \`Page.seoMetadata\` JSON column.

During public rendering at \`/p/[websiteSlug]\`, the server component dynamically generates the Next.js \`Metadata\` object based on this JSON.

### Sitemap & Robots
Dynamic generation is supported:
- \`/api/websites/[websiteId]/-/robots.txt\`
- \`/api/websites/-/-/sitemap.xml\`
`
  },
  "domains-hosting/custom-domains": {
    title: "Custom Domains",
    description: "Routing and domain management.",
    content: `## Custom Domains
Users can attach custom domains to their Websites.

## Where is it?
- UI: \`/dashboard/websites/[websiteId]/domains\`

## How does it work?
The \`Domain\` model stores hostnames and verification statuses.
1. User adds a domain.
2. The platform queries DNS records for verification.
3. Once verified, \`isVerified\` becomes true.
4. Edge routing middleware inspects the \`Host\` header and rewrites the URL to the internal \`/p/_custom_domain_/[hostname]\` structure.

<Callout type="info">
The implementation relies on Vercel Domains API for SSL and infrastructure routing if deployed on Vercel.
</Callout>
`
  },
  "analytics/overview": {
    title: "Analytics",
    description: "Native traffic and event analytics.",
    content: `## What is Analytics?
Business OS tracks visitors, sessions, pageviews, and events natively without third-party scripts.

## Where is it?
- Dashboard: \`/dashboard/websites/[websiteId]/analytics\`
- Ingestion API: \`/api/analytics/collect\`

## How does it work?
Client-side tracking scripts send beacons to \`/api/analytics/collect\`. The data is processed and stored in PostgreSQL:
- \`AnalyticsVisitor\`
- \`AnalyticsSession\`
- \`AnalyticsEvent\`
- \`PageAnalytics\` (Aggregated daily metrics via \`date\`)

<Callout type="warning">
Currently, analytics ingestion is handled directly by PostgreSQL. High-velocity deployments may require moving this to Redis or ClickHouse in the future.
</Callout>
`
  },
  "forms/overview": {
    title: "Forms & Submissions",
    description: "Website forms integration.",
    content: `## What is Forms?
Users can create forms in the Builder and collect submissions.

## Where is it?
- Form Management: \`/dashboard/websites/[websiteId]/forms\`
- Submission List: \`/dashboard/websites/[websiteId]/forms/[formId]\`

## How does it work?
1. The \`Form\` model stores field configurations as JSON.
2. The published website renders the form dynamically.
3. Submissions are sent via API and stored in the \`FormSubmission\` model as JSON \`data\`.
`
  },
  "billing/overview": {
    title: "Billing & Subscriptions",
    description: "SaaS monetization system.",
    content: `## What is Billing?
The billing engine supports tiered subscriptions (FREE, STARTER, PRO, BUSINESS, ENTERPRISE).

## Where is it?
- Workspace Billing: \`/dashboard/billing\`
- Admin Metrics: \`/admin/billing\`

## Providers Supported
The codebase verifies support for:
- **Stripe** (\`/api/webhooks/stripe\`)
- **Midtrans** (\`/api/webhooks/midtrans\`)
- **Xendit** (\`/api/webhooks/xendit\`)

## How does it work?
1. A \`Subscription\` record is tied to the \`User\`.
2. Payment provider webhooks trigger updates to the subscription \`status\` (e.g., TRIALING, ACTIVE, PAST_DUE).
3. Entitlements limit resources (e.g., max websites) based on the \`SubscriptionTier\`.
`
  },
  "support/center": {
    title: "Support Center",
    description: "Ticketing system.",
    content: `## What is the Support Center?
A built-in helpdesk for users to submit bug reports and feature requests.

## Where is it?
- User UI: \`/dashboard/support\`
- Admin UI: \`/admin/support\`

## How does it work?
1. User creates a \`Ticket\` with a \`TicketCategory\` and \`TicketPriority\`.
2. Admins triage and reply via \`TicketReply\`.
3. The system supports \`isInternalNote\` for admin-only collaboration.
`
  },
  "administration/overview": {
    title: "Administration",
    description: "Super admin dashboard.",
    content: `## Super Admin
The platform includes a dedicated Super Admin area for global management.

## Where is it?
- Base Route: \`/admin\`
- Users: \`/admin/users\`
- Workspaces: \`/admin/workspaces\`
- Websites: \`/admin/websites\`
- Support: \`/admin/support\`

## Impersonation
Super admins can impersonate users for troubleshooting.
- API: \`/api/admin/v1/users/[userId]/impersonate\`
- Revert: \`/api/admin/v1/users/stop-impersonation\`

<Callout type="warning">
Impersonation creates a specialized \`Session\` with \`impersonatedBy\` set to the Admin's UUID to maintain audit integrity.
</Callout>
`
  },
  "developer/overview": {
    title: "Developer Overview",
    description: "Architecture and APIs.",
    content: `## Architecture
The application is built on Next.js 15+ App Router using React Server Components.

### Directory Structure
- \`src/app\`: Routing layer and page components.
- \`src/core\`: Domain-specific business logic (e.g., \`/builder\`, \`/analytics\`).
- \`src/shared\`: Reusable UI components, utilities, and libraries.

### Database
Prisma ORM over PostgreSQL. Migrations are stored in \`prisma/migrations\`.

### Authentication
Authentication is handled by Better Auth, verifying sessions via middleware and Server Actions.
`
  },
  "configuration/environment-variables": {
    title: "Environment Variables",
    description: "System configuration.",
    content: `## Environment Variables

The following variables are discovered in the project configuration:

### Database
- \`DATABASE_URL\`: PostgreSQL connection string.

### Authentication
- \`BETTER_AUTH_SECRET\`: Secret for session signing.

### Storage (AWS S3)
- \`AWS_ACCESS_KEY_ID\`
- \`AWS_SECRET_ACCESS_KEY\`
- \`AWS_REGION\`
- \`AWS_S3_BUCKET\`

### Email
- \`RESEND_API_KEY\`

### Payments
- \`STRIPE_SECRET_KEY\`
- \`STRIPE_WEBHOOK_SECRET\`
- \`MIDTRANS_SERVER_KEY\`
- \`XENDIT_SECRET_KEY\`

### Search
- \`NEXT_PUBLIC_ALGOLIA_APP_ID\`
- \`NEXT_PUBLIC_ALGOLIA_API_KEY\`
- \`NEXT_PUBLIC_ALGOLIA_INDEX_NAME\`
`
  }
};

const docsDir = path.join(process.cwd(), 'docs');

Object.entries(docsContent).forEach(([slug, data]) => {
  const relativePath = slug + '.mdx';
  const filePath = path.join(docsDir, relativePath);
  const dirName = path.dirname(filePath);

  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName, { recursive: true });
  }

  // Derive section from slug
  const sectionPart = slug.split('/')[0];
  const sectionTitle = sectionPart.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const content = `---
title: "${data.title}"
description: "${data.description}"
section: "${sectionTitle}"
---

${data.content}
`;

  fs.writeFileSync(filePath, content, 'utf8');
});

// For any routes in navigation that aren't specifically filled above, provide a strict [Planned] warning.
const docsNavigation = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "/docs/getting-started/introduction" },
      { title: "Quickstart", href: "/docs/getting-started/quickstart" },
      { title: "Concepts", href: "/docs/getting-started/concepts" },
      { title: "Workspace", href: "/docs/getting-started/workspace" },
      { title: "Creating Your First Website", href: "/docs/getting-started/creating-your-first-website" },
      { title: "Publishing Your First Website", href: "/docs/getting-started/publishing-your-first-website" },
    ],
  },
  {
    title: "Core Concepts",
    items: [
      { title: "Architecture", href: "/docs/core-concepts/architecture" },
      { title: "Workspaces", href: "/docs/core-concepts/workspaces" },
      { title: "Roles & Permissions", href: "/docs/core-concepts/roles-and-permissions" },
      { title: "Websites", href: "/docs/core-concepts/websites" },
      { title: "Pages", href: "/docs/core-concepts/pages" },
      { title: "Page Versions", href: "/docs/core-concepts/page-versions" },
      { title: "Builder Tree", href: "/docs/core-concepts/builder-tree" },
      { title: "Publishing", href: "/docs/core-concepts/publishing" },
    ],
  },
  {
    title: "Website Builder",
    items: [
      { title: "Builder Overview", href: "/docs/website-builder/overview" },
      { title: "Canvas", href: "/docs/website-builder/canvas" },
      { title: "Components", href: "/docs/website-builder/components" },
      { title: "Sections", href: "/docs/website-builder/sections" },
      { title: "Layouts", href: "/docs/website-builder/layouts" },
      { title: "Properties", href: "/docs/website-builder/properties" },
      { title: "Drag & Drop", href: "/docs/website-builder/drag-and-drop" },
      { title: "Preview", href: "/docs/website-builder/preview" },
      { title: "Saving & Versions", href: "/docs/website-builder/saving-and-versions" },
      { title: "Rendering", href: "/docs/website-builder/rendering" },
    ],
  },
  {
    title: "CMS",
    items: [
      { title: "CMS Overview", href: "/docs/cms/overview" },
      { title: "Models", href: "/docs/cms/models" },
      { title: "Fields", href: "/docs/cms/fields" },
      { title: "Entries", href: "/docs/cms/entries" },
      { title: "References", href: "/docs/cms/references" },
      { title: "Dynamic Content", href: "/docs/cms/dynamic-content" },
      { title: "CMS + Builder", href: "/docs/cms/cms-builder" },
    ],
  },
  {
    title: "Themes",
    items: [
      { title: "Theme Overview", href: "/docs/themes/overview" },
      { title: "Colors", href: "/docs/themes/colors" },
      { title: "Typography", href: "/docs/themes/typography" },
      { title: "Spacing", href: "/docs/themes/spacing" },
      { title: "Global Styles", href: "/docs/themes/global-styles" },
      { title: "Live Preview", href: "/docs/themes/live-preview" },
    ],
  },
  {
    title: "Media",
    items: [
      { title: "Media Library", href: "/docs/media/library" },
      { title: "Uploading Files", href: "/docs/media/uploading" },
      { title: "Folders", href: "/docs/media/folders" },
      { title: "Assets", href: "/docs/media/assets" },
      { title: "Replace Assets", href: "/docs/media/replace-assets" },
      { title: "Storage", href: "/docs/media/storage" },
    ],
  },
  {
    title: "SEO",
    items: [
      { title: "SEO Overview", href: "/docs/seo/overview" },
      { title: "Meta Tags", href: "/docs/seo/meta-tags" },
      { title: "Open Graph", href: "/docs/seo/open-graph" },
      { title: "Twitter Cards", href: "/docs/seo/twitter-cards" },
      { title: "JSON-LD", href: "/docs/seo/json-ld" },
      { title: "Sitemap", href: "/docs/seo/sitemap" },
      { title: "Robots", href: "/docs/seo/robots" },
      { title: "Redirects", href: "/docs/seo/redirects" },
      { title: "404 Tracking", href: "/docs/seo/404-tracking" },
    ],
  },
  {
    title: "Domains & Hosting",
    items: [
      { title: "Hosting Overview", href: "/docs/domains-hosting/overview" },
      { title: "Platform Subdomains", href: "/docs/domains-hosting/platform-subdomains" },
      { title: "Custom Domains", href: "/docs/domains-hosting/custom-domains" },
      { title: "DNS Verification", href: "/docs/domains-hosting/dns-verification" },
      { title: "Domain Verification", href: "/docs/domains-hosting/domain-verification" },
      { title: "SSL", href: "/docs/domains-hosting/ssl" },
      { title: "Vercel Integration", href: "/docs/domains-hosting/vercel-integration" },
      { title: "Edge Routing", href: "/docs/domains-hosting/edge-routing" },
    ],
  },
  {
    title: "Analytics",
    items: [
      { title: "Analytics Overview", href: "/docs/analytics/overview" },
      { title: "Visitors", href: "/docs/analytics/visitors" },
      { title: "Sessions", href: "/docs/analytics/sessions" },
      { title: "Pageviews", href: "/docs/analytics/pageviews" },
      { title: "Events", href: "/docs/analytics/events" },
      { title: "Referrers", href: "/docs/analytics/referrers" },
      { title: "UTM Tracking", href: "/docs/analytics/utm-tracking" },
      { title: "Realtime Analytics", href: "/docs/analytics/realtime-analytics" },
      { title: "Heatmap Data", href: "/docs/analytics/heatmap-data" },
    ],
  },
  {
    title: "Forms",
    items: [
      { title: "Forms Overview", href: "/docs/forms/overview" },
      { title: "Creating Forms", href: "/docs/forms/creating-forms" },
      { title: "Form Fields", href: "/docs/forms/form-fields" },
      { title: "Form Submissions", href: "/docs/forms/form-submissions" },
      { title: "Email Notifications", href: "/docs/forms/email-notifications" },
      { title: "Spam Protection", href: "/docs/forms/spam-protection" },
    ],
  },
  {
    title: "Billing",
    items: [
      { title: "Billing Overview", href: "/docs/billing/overview" },
      { title: "Plans", href: "/docs/billing/plans" },
      { title: "Subscriptions", href: "/docs/billing/subscriptions" },
      { title: "Stripe", href: "/docs/billing/stripe" },
      { title: "Midtrans", href: "/docs/billing/midtrans" },
      { title: "Xendit", href: "/docs/billing/xendit" },
      { title: "Invoices", href: "/docs/billing/invoices" },
      { title: "Webhooks", href: "/docs/billing/webhooks" },
      { title: "Entitlements", href: "/docs/billing/entitlements" },
    ],
  },
  {
    title: "Support",
    items: [
      { title: "Support Center", href: "/docs/support/center" },
      { title: "Creating Tickets", href: "/docs/support/creating-tickets" },
      { title: "Ticket Replies", href: "/docs/support/ticket-replies" },
      { title: "Ticket Status", href: "/docs/support/ticket-status" },
      { title: "Admin Support", href: "/docs/support/admin-support" },
    ],
  },
  {
    title: "Notifications",
    items: [
      { title: "Notifications Overview", href: "/docs/notifications/overview" },
      { title: "In-App Notifications", href: "/docs/notifications/in-app" },
      { title: "Email Notifications", href: "/docs/notifications/email" },
      { title: "Notification Preferences", href: "/docs/notifications/preferences" },
    ],
  },
  {
    title: "Templates",
    items: [
      { title: "Template Overview", href: "/docs/templates/overview" },
      { title: "Browsing Templates", href: "/docs/templates/browsing" },
      { title: "Applying Templates", href: "/docs/templates/applying" },
      { title: "Template Preview", href: "/docs/templates/preview" },
      { title: "Template Data", href: "/docs/templates/data" },
      { title: "Exporting Templates", href: "/docs/templates/exporting" },
    ],
  },
  {
    title: "Administration",
    items: [
      { title: "Admin Overview", href: "/docs/administration/overview" },
      { title: "Users", href: "/docs/administration/users" },
      { title: "Workspaces", href: "/docs/administration/workspaces" },
      { title: "Websites", href: "/docs/administration/websites" },
      { title: "Billing Metrics", href: "/docs/administration/billing-metrics" },
      { title: "Support Triage", href: "/docs/administration/support-triage" },
      { title: "Impersonation", href: "/docs/administration/impersonation" },
      { title: "Audit Logs", href: "/docs/administration/audit-logs" },
    ],
  },
  {
    title: "Developer",
    items: [
      { title: "Developer Overview", href: "/docs/developer/overview" },
      { title: "Architecture", href: "/docs/developer/architecture" },
      { title: "Server Actions", href: "/docs/developer/server-actions" },
      { title: "API Routes", href: "/docs/developer/api-routes" },
      { title: "Authentication", href: "/docs/developer/authentication" },
      { title: "Authorization", href: "/docs/developer/authorization" },
      { title: "Webhooks", href: "/docs/developer/webhooks" },
      { title: "Edge Routing", href: "/docs/developer/edge-routing" },
      { title: "Database", href: "/docs/developer/database" },
      { title: "Error Handling", href: "/docs/developer/error-handling" },
    ],
  },
  {
    title: "Configuration",
    items: [
      { title: "Environment Variables", href: "/docs/configuration/environment-variables" },
      { title: "Database Configuration", href: "/docs/configuration/database-configuration" },
      { title: "AWS S3", href: "/docs/configuration/aws-s3" },
      { title: "Resend", href: "/docs/configuration/resend" },
      { title: "Stripe", href: "/docs/configuration/stripe" },
      { title: "Midtrans", href: "/docs/configuration/midtrans" },
      { title: "Xendit", href: "/docs/configuration/xendit" },
      { title: "Vercel", href: "/docs/configuration/vercel" },
      { title: "Algolia", href: "/docs/configuration/algolia" },
    ],
  },
  {
    title: "Deployment",
    items: [
      { title: "Deployment Overview", href: "/docs/deployment/overview" },
      { title: "Production Checklist", href: "/docs/deployment/production-checklist" },
      { title: "Vercel Deployment", href: "/docs/deployment/vercel-deployment" },
      { title: "Docker Deployment", href: "/docs/deployment/docker-deployment" },
      { title: "Database Migration", href: "/docs/deployment/database-migration" },
      { title: "Environment Setup", href: "/docs/deployment/environment-setup" },
      { title: "Domain Setup", href: "/docs/deployment/domain-setup" },
      { title: "Troubleshooting", href: "/docs/deployment/troubleshooting" },
    ],
  },
];

docsNavigation.forEach((section) => {
  section.items.forEach((item) => {
    const slug = item.href.replace('/docs/', '');
    const filePath = path.join(docsDir, slug + '.mdx');
    const dirName = path.dirname(filePath);

    if (!fs.existsSync(dirName)) {
      fs.mkdirSync(dirName, { recursive: true });
    }

    if (!docsContent[slug]) {
      // It's not strictly documented, create a fallback that respects the codebase audit rule.
      const fallbackContent = `---
title: "${item.title}"
description: "Documentation pending codebase audit verification."
section: "${section.title}"
---

# ${item.title}

<Callout type="warning" title="Implementation Status">
This feature (\`${item.title}\`) has either not yet been fully implemented in the codebase or its precise behavior is pending documentation audit. 
Please refer to the source code or roadmap for intended behavior.
</Callout>

## Verification Pending
Documentation will be updated once the implementation footprint (Routes, UI, Database schema, and Server Actions) is fully verified in the \`Business OS\` repository.
`;
      fs.writeFileSync(filePath, fallbackContent, 'utf8');
    }
  });
});

console.log('Codebase-driven documentation generated successfully.');

