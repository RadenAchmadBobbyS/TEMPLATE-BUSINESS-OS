import fs from 'fs';
import path from 'path';

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

const docsDir = path.join(process.cwd(), 'docs');

// Create base directory if it doesn't exist
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
}

let createdCount = 0;

docsNavigation.forEach((section) => {
  section.items.forEach((item) => {
    const relativePath = item.href.replace('/docs/', '') + '.mdx';
    const filePath = path.join(docsDir, relativePath);
    const dirName = path.dirname(filePath);

    if (!fs.existsSync(dirName)) {
      fs.mkdirSync(dirName, { recursive: true });
    }

    if (!fs.existsSync(filePath)) {
      const content = `---
title: "${item.title}"
description: "Documentation for ${item.title}."
section: "${section.title}"
---

<Callout type="info">
This documentation page describes the **${item.title}** functionality in Business OS.
</Callout>

## Overview

Welcome to the documentation for ${item.title}. This section covers the core concepts, usage, and configuration.

### What you'll learn

- How ${item.title.toLowerCase()} works in Business OS
- Step-by-step usage
- Configuration options

## Main Concept

Business OS provides robust support for ${item.title.toLowerCase()}. Below are the details on how it integrates into the platform.

\`\`\`typescript
// Example configuration for ${item.title.replace(/\\s+/g, '')}
const config = {
  enabled: true,
  feature: "${item.title}"
};
\`\`\`

## Common Problems

If you encounter issues, please verify your environment configuration and check the [Support](/docs/support/center) documentation.

<CardGrid>
  <Card title="Related Topic" href="#">
    Explore related documentation.
  </Card>
  <Card title="API Reference" href="/docs/developer/overview">
    View the developer API.
  </Card>
</CardGrid>
`;
      fs.writeFileSync(filePath, content, 'utf8');
      createdCount++;
    }
  });
});

console.log(`Created \${createdCount} MDX files successfully.`);
