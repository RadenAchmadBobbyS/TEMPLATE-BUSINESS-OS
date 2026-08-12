# Complete Engineering Checklist

**Overview**: This checklist guarantees that every line of code merging into `main` upholds the rigorous standards of an enterprise SaaS platform serving millions of users. It must be strictly followed by all engineering teams across all feature domains.

---

## 1. Development Lifecycle Checklists

### 🔲 Before Development
- [ ] Review the PRD and corresponding Architectural Specifications in `/docs`.
- [ ] Verify the exact API boundaries and database tables affected.
- [ ] Create a feature branch using standard naming conventions (`feat/feature-name`, `fix/bug-name`).
- [ ] Ensure local Docker environments (Postgres, Redis) are running and synced via `prisma db push`.

### 🔲 During Development
- [ ] Adhere to Feature-Driven Domain-Driven Design (DDD) in `src/core/`.
- [ ] Enforce strict TypeScript types; no `any` or `ts-ignore` exceptions allowed.
- [ ] Separate UI presentation logic (`src/shared/ui`) from complex business logic.
- [ ] Run `npm run format` (Prettier) frequently to ensure code consistency.

### 🔲 Before Merge (Pull Request)
- [ ] Self-review the diff to remove dead code, console logs, and commented-out blocks.
- [ ] Verify that 100% of the GitHub Actions CI Pipeline passes (Linting, Typechecking).
- [ ] Request a code review from a lead engineer (minimum 1 approval required).
- [ ] Ensure the PR description explicitly lists the Issue ID being resolved.

### 🔲 Before Release (Staging)
- [ ] Merge `feature` into `main` (automatically deploys to the Staging Environment).
- [ ] Run the end-to-end (E2E) Playwright suite against Staging.
- [ ] Verify that database migrations (`npx prisma migrate deploy`) ran successfully in the cloud without locking critical tables.

### 🔲 Before Production (Live)
- [ ] Confirm the Staging environment passes UAT (User Acceptance Testing).
- [ ] Verify that environment variables (e.g., API keys) for Production are properly configured in AWS Secrets Manager / Vercel.
- [ ] Trigger the Production deployment swap. Monitor the Datadog dashboard for 10 minutes post-deploy for any 5xx error spikes.

---

## 2. Specialized Checklists

### 🔒 Security Checklist
- [ ] **Auth Validation**: Ensure all API routes check for valid JWTs/Sessions.
- [ ] **RBAC Enforcement**: Verify that the user has the correct permissions (e.g., `ADMIN`) for destructive actions.
- [ ] **Input Sanitization**: Use Zod schemas for 100% of incoming API payloads to prevent SQL Injection and XSS.
- [ ] **Data Isolation**: Verify the `workspaceId` is explicitly enforced in database queries to prevent cross-tenant data leaks.
- [ ] **Secret Management**: Ensure no API keys or database strings are accidentally committed to Git.

### ⚡ Performance Checklist
- [ ] **Server Components**: Maximize React Server Components (RSC); use `"use client"` exclusively on interactive leaf nodes.
- [ ] **Database Queries**: Optimize Prisma queries. Avoid N+1 query problems using `include`.
- [ ] **Asset Optimization**: Ensure images use `next/image` with proper `sizes` and `priority` props.
- [ ] **Bundle Size**: Verify no massive, unnecessary third-party libraries (e.g., `moment.js`) are bloating the client bundle.

### 🔍 SEO Checklist
- [ ] **Metadata**: Ensure pages dynamically export the `metadata` object (Titles < 60 chars, Descriptions < 160 chars).
- [ ] **Semantics**: Verify proper HTML hierarchy (only one `<h1>` per page).
- [ ] **JSON-LD**: Confirm that structured data is correctly injected into the `<head>` where applicable.
- [ ] **Sitemap/Robots**: Ensure new static routes are accounted for in `sitemap.xml`.

### ♿ Accessibility (a11y) Checklist
- [ ] **Keyboard Navigation**: Verify that all interactive elements are reachable via `Tab`.
- [ ] **ARIA Labels**: Ensure buttons without text (e.g., icon buttons) have descriptive `aria-label` attributes.
- [ ] **Color Contrast**: Verify text meets WCAG AA contrast ratios (4.5:1).
- [ ] **Alt Text**: Ensure all informative `<Image>` tags possess descriptive `alt` text.

### 🧪 Testing Checklist
- [ ] **Unit Tests (Vitest/Jest)**: Write tests for all complex business logic, helper utilities, and Zod schemas.
- [ ] **Integration Tests**: Verify API endpoints communicate correctly with a test database.
- [ ] **E2E Tests (Playwright/Cypress)**: Automate critical user flows (e.g., User Login -> Create Website -> Publish).
