export type NavItem = {
  title: string;
  href: string;
};

export type NavSection = {
  title: string;
  href: string;
  items: NavItem[];
};

export const docsNavigation: NavSection[] = [
  {
    title: "Getting Started",
    href: "/docs/getting-started",
    items: [
      { title: "Introduction", href: "/docs/getting-started/introduction" },
      { title: "Workspace", href: "/docs/getting-started/workspace" },
      { title: "Create Website", href: "/docs/getting-started/create-website" },
      { title: "Publish", href: "/docs/getting-started/publish" },
    ],
  },
  {
    title: "Workspace",
    href: "/docs/workspace",
    items: [
      { title: "Overview", href: "/docs/workspace/overview" },
      { title: "Members", href: "/docs/workspace/members" },
      { title: "Roles", href: "/docs/workspace/roles" },
      { title: "Settings", href: "/docs/workspace/settings" },
    ],
  },
  {
    title: "Websites",
    href: "/docs/websites",
    items: [
      { title: "Overview", href: "/docs/websites/overview" },
      { title: "Create", href: "/docs/websites/create" },
      { title: "Settings", href: "/docs/websites/settings" },
      { title: "Pages", href: "/docs/websites/pages" },
      { title: "Publishing", href: "/docs/websites/publishing" },
    ],
  },
  {
    title: "Builder",
    href: "/docs/builder",
    items: [
      { title: "Overview", href: "/docs/builder/overview" },
      { title: "Canvas", href: "/docs/builder/canvas" },
      { title: "Components", href: "/docs/builder/components" },
      { title: "Sections", href: "/docs/builder/sections" },
      { title: "Properties", href: "/docs/builder/properties" },
      { title: "Page Versions", href: "/docs/builder/page-versions" },
      { title: "Preview", href: "/docs/builder/preview" },
    ],
  },
  {
    title: "CMS",
    href: "/docs/cms",
    items: [
      { title: "Overview", href: "/docs/cms/overview" },
      { title: "Models", href: "/docs/cms/models" },
      { title: "Fields", href: "/docs/cms/fields" },
      { title: "Entries", href: "/docs/cms/entries" },
      { title: "References", href: "/docs/cms/references" },
    ],
  },
  {
    title: "Themes",
    href: "/docs/themes",
    items: [
      { title: "Overview", href: "/docs/themes/overview" },
      { title: "Colors", href: "/docs/themes/colors" },
      { title: "Typography", href: "/docs/themes/typography" },
    ],
  },
  {
    title: "Media",
    href: "/docs/media",
    items: [
      { title: "Overview", href: "/docs/media/overview" },
      { title: "Upload", href: "/docs/media/upload" },
      { title: "Assets", href: "/docs/media/assets" },
    ],
  },
  {
    title: "SEO",
    href: "/docs/seo",
    items: [
      { title: "Overview", href: "/docs/seo/overview" },
      { title: "Metadata", href: "/docs/seo/metadata" },
      { title: "Sitemap", href: "/docs/seo/sitemap" },
      { title: "Robots", href: "/docs/seo/robots" },
      { title: "Structured Data", href: "/docs/seo/structured-data" },
    ],
  },
  {
    title: "Domains",
    href: "/docs/domains",
    items: [
      { title: "Overview", href: "/docs/domains/overview" },
      { title: "Custom Domains", href: "/docs/domains/custom-domains" },
      { title: "Subdomains", href: "/docs/domains/subdomains" },
      { title: "Verification", href: "/docs/domains/verification" },
      { title: "SSL", href: "/docs/domains/ssl" },
    ],
  },
  {
    title: "Redirects",
    href: "/docs/redirects",
    items: [
      { title: "Overview", href: "/docs/redirects/overview" },
      { title: "Create", href: "/docs/redirects/create" },
      { title: "301 & 302", href: "/docs/redirects/301-302" },
    ],
  },
  {
    title: "Analytics",
    href: "/docs/analytics",
    items: [
      { title: "Overview", href: "/docs/analytics/overview" },
      { title: "Visitors", href: "/docs/analytics/visitors" },
      { title: "Sessions", href: "/docs/analytics/sessions" },
      { title: "Events", href: "/docs/analytics/events" },
      { title: "Realtime", href: "/docs/analytics/realtime" },
      { title: "Retention", href: "/docs/analytics/retention" },
    ],
  },
  {
    title: "Forms",
    href: "/docs/forms",
    items: [
      { title: "Overview", href: "/docs/forms/overview" },
      { title: "Create", href: "/docs/forms/create" },
      { title: "Submissions", href: "/docs/forms/submissions" },
      { title: "Notifications", href: "/docs/forms/notifications" },
    ],
  },
  {
    title: "Billing",
    href: "/docs/billing",
    items: [
      { title: "Overview", href: "/docs/billing/overview" },
      { title: "Plans", href: "/docs/billing/plans" },
      { title: "Subscriptions", href: "/docs/billing/subscriptions" },
      { title: "Stripe", href: "/docs/billing/stripe" },
      { title: "Webhooks", href: "/docs/billing/webhooks" },
    ],
  },
  {
    title: "Notifications",
    href: "/docs/notifications",
    items: [
      { title: "Overview", href: "/docs/notifications/overview" },
      { title: "Preferences", href: "/docs/notifications/preferences" },
      { title: "Email", href: "/docs/notifications/email" },
    ],
  },
  {
    title: "Support",
    href: "/docs/support",
    items: [
      { title: "Overview", href: "/docs/support/overview" },
      { title: "Tickets", href: "/docs/support/tickets" },
      { title: "Replies", href: "/docs/support/replies" },
      { title: "Status", href: "/docs/support/status" },
    ],
  },
  {
    title: "Templates",
    href: "/docs/templates",
    items: [
      { title: "Overview", href: "/docs/templates/overview" },
      { title: "Marketplace", href: "/docs/templates/marketplace" },
      { title: "Clone", href: "/docs/templates/clone" },
      { title: "Export", href: "/docs/templates/export" },
    ],
  },
  {
    title: "Admin",
    href: "/docs/admin",
    items: [
      { title: "Overview", href: "/docs/admin/overview" },
      { title: "Users", href: "/docs/admin/users" },
      { title: "Workspaces", href: "/docs/admin/workspaces" },
      { title: "Impersonation", href: "/docs/admin/impersonation" },
      { title: "Audit Logs", href: "/docs/admin/audit-logs" },
    ],
  },
  {
    title: "Developer",
    href: "/docs/developer",
    items: [
      { title: "Architecture", href: "/docs/developer/architecture" },
      { title: "API", href: "/docs/developer/api" },
      { title: "Database", href: "/docs/developer/database" },
      { title: "Authentication", href: "/docs/developer/authentication" },
      { title: "Server Actions", href: "/docs/developer/server-actions" },
    ],
  },
  {
    title: "Configuration",
    href: "/docs/configuration",
    items: [
      { title: "Environment", href: "/docs/configuration/environment" },
      { title: "Storage", href: "/docs/configuration/storage" },
      { title: "Email", href: "/docs/configuration/email" },
      { title: "Billing", href: "/docs/configuration/billing" },
    ],
  },
  {
    title: "Deployment",
    href: "/docs/deployment",
    items: [
      { title: "Overview", href: "/docs/deployment/overview" },
      { title: "Vercel", href: "/docs/deployment/vercel" },
      { title: "Database", href: "/docs/deployment/database" },
      { title: "Storage", href: "/docs/deployment/storage" },
      { title: "Production Checklist", href: "/docs/deployment/production-checklist" },
    ],
  },
];
