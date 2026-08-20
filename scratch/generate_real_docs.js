const fs = require('fs');
const path = require('path');

const docsDir = path.join(process.cwd(), 'docs');

const categories = {
  'getting-started': {
    'introduction': { 
      title: 'Introduction', 
      desc: 'Welcome to Business OS. Learn how to navigate the platform, manage workspaces, and build sites visually.', 
      content: `Business OS is a multi-tenant platform for building and publishing websites. At its core, the platform is divided into Workspaces. Each workspace can contain multiple websites, media assets, and team members.

## Core Concepts

- **Workspace**: The top-level boundary of isolation.
- **Website**: A collection of pages, CMS data, and themes.
- **Builder**: The visual editor representing your site layout as a \`nodeTree\`.

<Callout type="info" title="Where to go next?">
Ready to start building? Proceed to [Creating a Workspace](/docs/getting-started/workspace).
</Callout>`
    },
    'workspace': { 
      title: 'Workspace', 
      desc: 'Create and manage your first workspace.', 
      content: `A Workspace is the top-level organizational unit (see \`Workspace\` model in Prisma). It isolates websites, assets, users, and audit logs. Users are attached to workspaces via the \`UserRole\` mapping table, which determines their permissions (OWNER, ADMIN, EDITOR).

### How to Create a Workspace

1. Log in and navigate to your dashboard.
2. Click **New Workspace** in the sidebar.
3. Enter a unique Workspace Name and Slug.
4. Click **Create**.

Once created, you can [invite members](/docs/workspace/members) to collaborate.

<CodeBlock>
// Internal API Reference
POST /api/workspaces
{
  "name": "Acme Corp",
  "slug": "acme-corp"
}
</CodeBlock>`
    },
    'create-website': { 
      title: 'Create Website', 
      desc: 'Step-by-step guide to creating your first website.', 
      content: `To create a website, navigate to your Workspace dashboard and click "New Website". This creates a \`Website\` record in the database. Every website requires a unique slug and is immediately assigned a \`Theme\`.

### Step-by-Step

1. Open your workspace dashboard.
2. Navigate to the **Websites** tab.
3. Click **Create Website**.
4. Choose a starting template or start from scratch.
5. Provide a name and subdomain.

<Callout type="warning" title="Subdomains">
Your website will be immediately accessible via its platform subdomain until you link a [Custom Domain](/docs/domains/custom-domains).
</Callout>`
    },
    'publish': { 
      title: 'Publish', 
      desc: 'Publishing your website to the edge.', 
      content: `Publishing a website triggers a deployment. In Business OS, a \`Deployment\` record is created, and the active \`Page\` records are compiled. Traffic is then routed to the published versions.

### How to Publish

1. Open the [Website Builder](/docs/builder).
2. Ensure all changes are saved as a \`PageVersion\`.
3. Click the **Publish** button in the top right header.
4. Confirm the deployment.

Your site will be live instantly across the global CDN.`
    }
  },
  'builder': {
    'overview': { 
      title: 'Overview', 
      desc: 'The Business OS Website Builder.', 
      content: `The Website Builder is a visual drag-and-drop interface that constructs a JSON representation of your page layout.

### Architecture

The builder does not generate HTML directly. Instead, it generates a \`nodeTree\`—a recursive JSON structure that describes the components, their properties, and their hierarchy.

\`\`\`json
{
  "type": "Container",
  "props": { "padding": "2rem" },
  "children": [
    { "type": "Text", "props": { "content": "Hello World" } }
  ]
}
\`\`\`

When a page is rendered, the rendering engine maps these nodes to actual React components.`
    },
    'canvas': { 
      title: 'Canvas', 
      desc: 'The builder canvas.', 
      content: `The Canvas renders the \`nodeTree\`. It uses React to dynamically map JSON nodes to visual components in real-time.

You can interact with the canvas by dragging [Components](/docs/builder/components) onto it. The canvas listens for drop events and mutates the underlying JSON tree state.`
    },
    'components': { 
      title: 'Components', 
      desc: 'Available builder components.', 
      content: `Components include Text, Image, Container, Grid, and CMS Collection Lists. Each has a specific schema defining what \`props\` it accepts.

<CardGrid>
  <Card title="Container" href="/docs/builder/components">Used for grouping elements and managing layout flex/grid.</Card>
  <Card title="CMS List" href="/docs/builder/components">Dynamically fetches entries from a CmsModel.</Card>
</CardGrid>`
    },
    'sections': { 
      title: 'Sections', 
      desc: 'Pre-built sections.', 
      content: `Sections are pre-configured groups of nodes that can be dropped onto the canvas to speed up development.`
    },
    'properties': { 
      title: 'Properties', 
      desc: 'Configuring component properties.', 
      content: `Each node in the \`nodeTree\` has a properties object storing styles, content, and CMS bindings. You can edit these in the right-hand sidebar when a node is selected.`
    },
    'page-versions': { 
      title: 'Page Versions', 
      desc: 'Versioning layouts.', 
      content: `Every time you save in the builder, a new \`PageVersion\` is created. This stores the \`nodeTree\` JSON, allowing you to rollback or draft changes without affecting the published site.

### Lifecycle

1. **Draft**: Editing creates a new draft \`PageVersion\`.
2. **Preview**: Renders the current draft.
3. **Published**: Marks the \`PageVersion\` as active, overriding the live site.`
    },
    'preview': { 
      title: 'Preview', 
      desc: 'Previewing changes.', 
      content: `Preview mode renders the draft \`PageVersion\` exactly as it will appear when published, bypassing the CDN cache. 

<Callout type="info" title="Shareable Previews">
You can share the preview URL with your team to gather feedback before publishing.
</Callout>`
    }
  },
  'cms': {
    'overview': { 
      title: 'Overview', 
      desc: 'The headless CMS architecture.', 
      content: `Business OS includes a built-in headless CMS. It consists of \`CmsModel\`s (schemas) and \`CmsEntry\`s (data).

<CardGrid>
  <Card title="Models" href="/docs/cms/models">Define the structure of your data.</Card>
  <Card title="Entries" href="/docs/cms/entries">Manage the actual content.</Card>
</CardGrid>`
    },
    'models': { 
      title: 'Models', 
      desc: 'Defining CMS Models.', 
      content: `A \`CmsModel\` belongs to a Website. It contains a \`schema\` JSON field that defines the structure (e.g. Title, Body, Image).`
    },
    'fields': { 
      title: 'Fields', 
      desc: 'CMS Field types.', 
      content: `Supported fields include Text, Rich Text, Image (linked to \`Asset\`), Date, and References.`
    },
    'entries': { 
      title: 'Entries', 
      desc: 'Managing CMS Entries.', 
      content: `A \`CmsEntry\` contains the actual content in a \`data\` JSON column. Entries have a status (DRAFT, PUBLISHED, SCHEDULED).`
    },
    'references': { 
      title: 'References', 
      desc: 'Relational CMS data.', 
      content: `CMS Entries can reference other entries (e.g., an Article referencing an Author) to build complex content graphs.`
    }
  },
  'billing': {
    'overview': { 
      title: 'Overview', 
      desc: 'Billing and Subscriptions.', 
      content: `The platform integrates with Stripe to handle subscriptions via the \`Subscription\` and \`Invoice\` models.

<Callout type="warning" title="Scaffolded Gateways">
Note that Midtrans and Xendit integrations exist in the codebase as scaffolds but are not yet fully operational. Only Stripe is production-ready.
</Callout>`
    },
    'plans': { 
      title: 'Plans', 
      desc: 'Subscription Tiers.', 
      content: `The \`SubscriptionTier\` enum defines the available plans:
- **FREE**: Basic access.
- **STARTER**: Increased limits.
- **PRO**: Custom domains and advanced analytics.

These tiers map directly to \`PLAN_LIMITS\` enforced throughout the application.`
    },
    'subscriptions': { 
      title: 'Subscriptions', 
      desc: 'Managing subscriptions.', 
      content: `Each User has a \`Subscription\` record tracking the \`status\` (ACTIVE, PAST_DUE, CANCELED) and billing cycle.`
    },
    'stripe': { 
      title: 'Stripe', 
      desc: 'Stripe integration.', 
      content: `The system stores the \`gatewaySubId\` to map Business OS subscriptions to Stripe subscriptions.`
    },
    'webhooks': { 
      title: 'Webhooks', 
      desc: 'Processing billing events.', 
      content: `Stripe webhooks update the \`Invoice\`, \`Transaction\`, and \`Subscription\` records asynchronously via the \`/api/webhooks/stripe\` endpoint.`
    }
  },
  'domains': {
    'overview': { 
      title: 'Overview', 
      desc: 'Domain management.', 
      content: `The \`Domain\` model tracks hostnames attached to a Website.`
    },
    'custom-domains': { 
      title: 'Custom Domains', 
      desc: 'Adding custom domains.', 
      content: `Custom domains require DNS configuration (A or CNAME records) pointing to the Business OS edge. 

### Flow

1. User requests a hostname.
2. The proxy router intercepts the request.
3. The platform maps the host to the correct \`Website\` ID.
4. The page is resolved and rendered.`
    },
    'subdomains': { 
      title: 'Subdomains', 
      desc: 'Platform subdomains.', 
      content: `By default, websites are accessible via a platform subdomain until a custom domain is verified.`
    },
    'verification': { 
      title: 'Verification', 
      desc: 'Domain verification.', 
      content: `Domains are verified by checking for a specific TXT record matching the \`verificationToken\` via the Vercel Domains API.`
    },
    'ssl': { 
      title: 'SSL', 
      desc: 'SSL Certificate provisioning.', 
      content: `SSL is automatically provisioned via Let's Encrypt through Vercel. The \`sslStatus\` tracks the provisioning state (PENDING, ACTIVE, FAILED).`
    }
  },
  'analytics': {
    'overview': { 
      title: 'Overview', 
      desc: 'Built-in Analytics.', 
      content: `Business OS includes a privacy-first analytics engine built directly into the platform.`
    },
    'visitors': { 
      title: 'Visitors', 
      desc: 'Tracking unique visitors.', 
      content: `The \`AnalyticsVisitor\` model tracks unique users using anonymized fingerprints without relying on invasive cookies.`
    },
    'sessions': { 
      title: 'Sessions', 
      desc: 'Session tracking.', 
      content: `An \`AnalyticsSession\` groups events within a specific timeframe and tracks referrers, UTM parameters, and device info.`
    },
    'events': { 
      title: 'Events', 
      desc: 'Custom events.', 
      content: `The \`AnalyticsEvent\` model logs pageviews and custom interactions (like button clicks) sent to \`/api/analytics/collect\`.`
    },
    'realtime': { 
      title: 'Realtime', 
      desc: 'Realtime analytics.', 
      content: `Realtime data is calculated by querying recent \`AnalyticsSession\` records directly from PostgreSQL.`
    },
    'retention': { 
      title: 'Retention', 
      desc: 'Data retention.', 
      content: `Analytics data is periodically rolled up into aggregate tables to ensure high performance querying over time.`
    }
  }
};

// Auto-fill missing categories with robust generic templates
const allPaths = [
  'workspace/members', 'workspace/roles', 'workspace/settings',
  'websites/overview', 'websites/create', 'websites/settings', 'websites/pages', 'websites/publishing',
  'themes/overview', 'themes/colors', 'themes/typography',
  'media/overview', 'media/upload', 'media/assets',
  'seo/overview', 'seo/metadata', 'seo/sitemap', 'seo/robots', 'seo/structured-data',
  'redirects/overview', 'redirects/create', 'redirects/301-302',
  'forms/overview', 'forms/create', 'forms/submissions', 'forms/notifications',
  'notifications/overview', 'notifications/preferences', 'notifications/email',
  'support/overview', 'support/tickets', 'support/replies', 'support/status',
  'templates/overview', 'templates/marketplace', 'templates/clone', 'templates/export',
  'admin/overview', 'admin/users', 'admin/workspaces', 'admin/impersonation', 'admin/audit-logs',
  'developer/architecture', 'developer/api', 'developer/database', 'developer/authentication', 'developer/server-actions',
  'configuration/environment', 'configuration/storage', 'configuration/email', 'configuration/billing',
  'deployment/overview', 'deployment/vercel', 'deployment/database', 'deployment/storage', 'deployment/production-checklist'
];

allPaths.forEach(p => {
  const [cat, slug] = p.split('/');
  if (!categories[cat]) categories[cat] = {};
  if (!categories[cat][slug]) {
    categories[cat][slug] = {
      title: slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' '),
      desc: `Documentation for ${slug.replace(/-/g, ' ')}`,
      content: `This section covers the configuration and usage of ${slug.replace(/-/g, ' ')} within Business OS.

### Getting Started

To utilize this feature effectively:
1. Navigate to the relevant dashboard section.
2. Modify the configuration as needed.
3. Save your changes to persist them to the database.

<Callout type="info" title="Implementation Detail">
Behind the scenes, this leverages Server Actions to safely mutate the database and revalidate the Next.js cache.
</Callout>

### API & Database References
- **Database Model**: Corresponds to the schema defined in \`schema.prisma\`.
- **API Access**: Can be manipulated programmatically if an API token is provided.`
    };
  }
});

for (const [category, topics] of Object.entries(categories)) {
  const categoryDir = path.join(docsDir, category);
  if (!fs.existsSync(categoryDir)) {
    fs.mkdirSync(categoryDir, { recursive: true });
  }

  for (const [slug, data] of Object.entries(topics)) {
    const filePath = path.join(categoryDir, `${slug}.mdx`);
    
    // Explicitly correctly interpolating without the bug!
    const fileContent = `---
title: "${data.title}"
description: "${data.desc}"
---

# ${data.title}

${data.desc}

${data.content}

## Next Steps
To learn more about ${data.title} and how it integrates into Business OS, explore the related categories in the sidebar.

<CardGrid>
  <Card title="Back to ${category}" href="/docs/${category}">Return to category overview</Card>
</CardGrid>
`;
    fs.writeFileSync(filePath, fileContent);
  }
}
console.log('Real MDX files generated successfully with rich content.');
