NEW-PR/
├── .env
├── .env.example
├── .github/
│ └── workflows/
│ └── production.yml
├── .gitignore
├── .husky/
│ ├── commit-msg
│ └── pre-commit
├── .prettierrc
├── .vscode/
│ └── settings.json
├── **tests**/
│ ├── integration/
│ │ └── actions/
│ │ └── billing.test.ts
│ └── unit/
│ └── components/
│ └── Button.test.tsx
├── AGENTS.md
├── audit_report.md
├── bun.lock
├── CLAUDE.md
├── commitlint.config.js
├── components.json
├── docker-compose.prod.yml
├── docker-compose.yml
├── Dockerfile
├── docs/
│ ├── ANALYTICS_SPEC.md
│ ├── API_SPEC.md
│ ├── AUTH_SYSTEM_SPEC.md
│ ├── BUILDER_ENGINE_SPEC.md
│ ├── CMS_SPEC.md
│ ├── CUSTOMER_DASHBOARD_SPEC.md
│ ├── DATABASE_MIGRATION_PLAN.md
│ ├── DEPLOYMENT_ARCHITECTURE_SPEC.md
│ ├── DESIGN_SYSTEM.md
│ ├── DEVELOPER_TASKS.md
│ ├── DOCS_WEBSITE_SPEC.md
│ ├── DOMAIN_MANAGEMENT_SPEC.md
│ ├── ENGINEERING_CHECKLIST.md
│ ├── FOLDER_STRUCTURE_SPEC.md
│ ├── INDUSTRY_RESEARCH.md
│ ├── MEDIA_LIBRARY_SPEC.md
│ ├── MULTI_TENANT_SPEC.md
│ ├── NOTIFICATION_SYSTEM_SPEC.md
│ ├── PAGE_BUILDER_SPEC.md
│ ├── PAYMENT_GATEWAY_SPEC.md
│ ├── PRD.md
│ ├── PUBLISHING_SYSTEM_SPEC.md
│ ├── RENDERING_ENGINE_SPEC.md
│ ├── ROADMAP.md
│ ├── SEO_ENGINE_SPEC.md
│ ├── SEO_MANAGEMENT_SPEC.md
│ ├── SOFTWARE_ARCHITECTURE.md
│ ├── STANDARDS.md
│ ├── STORAGE_ARCHITECTURE_SPEC.md
│ ├── SUBSCRIPTION_SPEC.md
│ ├── SUPER_ADMIN_SPEC.md
│ ├── SUPPORT_CENTER_SPEC.md
│ ├── TEMPLATE_ENGINE_SPEC.md
│ ├── THEME_ENGINE_SPEC.md
│ ├── WEBSITE_PUBLISHING_SPEC.md
│ └── templates/
│ └── 01_SAAS_B2B.md
├── e2e/
│ ├── a11y.spec.ts
│ └── auth.spec.ts
├── eslint.config.mjs
├── next.config.ts
├── next-env.d.ts
├── nginx/
│ └── nginx.conf
├── package.json
├── package-lock.json
├── playwright.config.ts
├── postcss.config.mjs
├── prisma/
│ ├── schema.prisma
│ ├── seed.prisma
│ ├── seed.ts
│ └── seed-templates.ts
├── prisma.config.ts
├── public/
│ ├── file.svg
│ ├── globe.svg
│ ├── next.svg
│ ├── vercel.svg
│ └── window.svg
├── README.md
├── scripts/
│ ├── backup.sh
│ ├── check-qa.sh
│ ├── restore.sh
│ ├── test-analytics.ts
│ ├── test-builder-security.ts
│ └── test-builder-store.ts
├── src/
│ ├── app/
│ │ ├── (admin)/
│ │ │ ├── admin/
│ │ │ │ ├── billing/
│ │ │ │ │ └── page.tsx
│ │ │ │ ├── settings/
│ │ │ │ │ └── page.tsx
│ │ │ │ ├── support/
│ │ │ │ │ ├── [ticketId]/
│ │ │ │ │ │ └── page.tsx
│ │ │ │ │ └── page.tsx
│ │ │ │ ├── users/
│ │ │ │ │ └── page.tsx
│ │ │ │ ├── websites/
│ │ │ │ │ └── page.tsx
│ │ │ │ ├── workspaces/
│ │ │ │ │ └── page.tsx
│ │ │ │ └── page.tsx
│ │ │ └── layout.tsx
│ │ │
│ │ ├── (auth)/
│ │ │ ├── forgot-password/
│ │ │ │ └── page.tsx
│ │ │ ├── login/
│ │ │ │ └── page.tsx
│ │ │ ├── register/
│ │ │ │ └── page.tsx
│ │ │ ├── reset-password/
│ │ │ │ └── page.tsx
│ │ │ └── layout.tsx
│ │ │
│ │ ├── (builder)/
│ │ │ ├── builder/
│ │ │ │ └── [websiteId]/
│ │ │ │ └── [pageId]/
│ │ │ │ ├── BuilderClientInitializer.tsx
│ │ │ │ └── page.tsx
│ │ │ └── layout.tsx
│ │ │
│ │ ├── (dashboard)/
│ │ │ ├── billing/
│ │ │ │ └── page.tsx
│ │ │ ├── dashboard/
│ │ │ │ └── page.tsx
│ │ │ ├── error.tsx
│ │ │ ├── invitations/
│ │ │ │ └── page.tsx
│ │ │ ├── layout.tsx
│ │ │ ├── loading.tsx
│ │ │ ├── media/
│ │ │ │ └── page.tsx
│ │ │ ├── settings/
│ │ │ │ └── workspace/
│ │ │ │ └── page.tsx
│ │ │ ├── support/
│ │ │ │ ├── [ticketId]/
│ │ │ │ │ └── page.tsx
│ │ │ │ ├── new/
│ │ │ │ │ └── page.tsx
│ │ │ │ └── page.tsx
│ │ │ ├── templates/
│ │ │ │ └── page.tsx
│ │ │ ├── websites/
│ │ │ │ ├── [websiteId]/
│ │ │ │ │ ├── analytics/
│ │ │ │ │ │ └── page.tsx
│ │ │ │ │ ├── cms/
│ │ │ │ │ │ ├── [modelId]/
│ │ │ │ │ │ │ ├── [entryId]/
│ │ │ │ │ │ │ │ └── page.tsx
│ │ │ │ │ │ │ └── page.tsx
│ │ │ │ │ │ └── page.tsx
│ │ │ │ │ ├── deploy/
│ │ │ │ │ │ └── page.tsx
│ │ │ │ │ ├── domains/
│ │ │ │ │ │ └── page.tsx
│ │ │ │ │ ├── forms/
│ │ │ │ │ ├── [formId]/
│ │ │ │ │ │ └── page.tsx
│ │ │ │ │ ├── navigation/
│ │ │ │ │ │ └── page.tsx
│ │ │ │ │ ├── pages/
│ │ │ │ │ │ ├── [pageId]/
│ │ │ │ │ │ │ └── seo/
│ │ │ │ │ │ │ └── page.tsx
│ │ │ │ │ │ └── page.tsx
│ │ │ │ │ ├── redirects/
│ │ │ │ │ │ └── page.tsx
│ │ │ │ │ ├── settings/
│ │ │ │ │ │ └── page.tsx
│ │ │ │ │ └── theme/
│ │ │ │ │ └── page.tsx
│ │ │ │ └── page.tsx
│ │ │ └── workspaces/
│ │ │ ├── new/
│ │ │ │ └── page.tsx
│ │ │ └── page.tsx
│ │ │
│ │ ├── api/
│ │ │ ├── analytics/
│ │ │ │ └── collect/
│ │ │ │ └── route.ts
│ │ │ ├── auth/
│ │ │ │ └── [...all]/
│ │ │ │ └── route.ts
│ │ │ ├── health/
│ │ │ │ └── route.ts
│ │ │ ├── test-cms/
│ │ │ ├── webhooks/
│ │ │ │ ├── [provider]/
│ │ │ │ │ └── route.ts
│ │ │ │ ├── midtrans/
│ │ │ │ │ └── route.ts
│ │ │ │ └── xendit/
│ │ │ │ └── route.ts
│ │ │ └── websites/
│ │ │ └── [websiteId]/
│ │ │ ├── -/
│ │ │ │ ├── robots.txt/
│ │ │ │ │ └── route.ts
│ │ │ │ └── sitemap.xml/
│ │ │ │ └── route.ts
│ │ │ ├── pages/
│ │ │ │ └── [pageId]/
│ │ │ │ └── seo/
│ │ │ │ └── route.ts
│ │ │ ├── robots.txt/
│ │ │ │ └── route.ts
│ │ │ └── sitemap.xml/
│ │ │ └── route.ts
│ │ │
│ │ ├── builder/
│ │ │ └── [websiteId]/
│ │ ├── globals.css
│ │ ├── layout.tsx
│ │ ├── p/
│ │ │ ├── [websiteSlug]/
│ │ │ │ └── [[...slug]]/
│ │ │ │ └── page.tsx
│ │ │ └── _custom_domain_/
│ │ │ └── [hostname]/
│ │ │ └── [[...slug]]/
│ │ │ └── page.tsx
│ │ ├── page.tsx
│ │ └── providers.tsx
│ │
│ ├── components/
│ │ ├── builder/
│ │ ├── dashboard/
│ │ └── ui/
│ │ └── button.tsx
│ │
│ ├── core/
│ │ ├── admin/
│ │ ├── analytics/
│ │ ├── auth/
│ │ ├── billing/
│ │ ├── builder/
│ │ ├── cms/
│ │ ├── dashboard/
│ │ ├── forms/
│ │ ├── hosting/
│ │ ├── media/
│ │ ├── navigation/
│ │ ├── notifications/
│ │ ├── pages/
│ │ ├── publishing/
│ │ ├── security/
│ │ ├── seo/
│ │ ├── support/
│ │ ├── templates/
│ │ ├── theme/
│ │ ├── websites/
│ │ └── workspaces/
│ │
│ ├── lib/
│ │ ├── auth/
│ │ ├── db/
│ │ ├── payments/
│ │ ├── storage/
│ │ └── utils.ts
│ │
│ ├── middleware.ts
│ │
│ ├── shared/
│ │ ├── hooks/
│ │ │ ├── use-mobile.ts
│ │ │ └── use-toast.ts
│ │ ├── lib/
│ │ │ └── prisma.ts
│ │ ├── ui/
│ │ │ ├── accordion.tsx
│ │ │ ├── alert.tsx
│ │ │ ├── alert-dialog.tsx
│ │ │ ├── avatar.tsx
│ │ │ ├── badge.tsx
│ │ │ ├── breadcrumb.tsx
│ │ │ ├── button.tsx
│ │ │ ├── card.tsx
│ │ │ ├── checkbox.tsx
│ │ │ ├── dialog.tsx
│ │ │ ├── drawer.tsx
│ │ │ ├── dropdown-menu.tsx
│ │ │ ├── empty-state.tsx
│ │ │ ├── error-state.tsx
│ │ │ ├── form.tsx
│ │ │ ├── input.tsx
│ │ │ ├── label.tsx
│ │ │ ├── loading-state.tsx
│ │ │ ├── pagination.tsx
│ │ │ ├── popover.tsx
│ │ │ ├── progress.tsx
│ │ │ ├── scroll-area.tsx
│ │ │ ├── select.tsx
│ │ │ ├── separator.tsx
│ │ │ ├── sheet.tsx
│ │ │ ├── sidebar.tsx
│ │ │ ├── skeleton.tsx
│ │ │ ├── slider.tsx
│ │ │ ├── switch.tsx
│ │ │ ├── table.tsx
│ │ │ ├── tabs.tsx
│ │ │ ├── textarea.tsx
│ │ │ ├── toast.tsx
│ │ │ ├── toaster.tsx
│ │ │ └── tooltip.tsx
│ │ └── utils.ts
│
├── test.js
├── tsc-errors.txt
├── tsconfig.json
├── tsconfig.tsbuildinfo
└── vitest.config.ts
