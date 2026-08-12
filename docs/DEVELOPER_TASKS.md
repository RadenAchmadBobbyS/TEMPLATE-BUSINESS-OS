# Developer Tasks & Jira Backlog

**Overview**: This document breaks down the massive Enterprise SaaS ecosystem into atomic, assignable developer tasks. It is formatted to be easily imported into Jira, Trello, Linear, or Notion.

---

## Module 1: Core Infrastructure & DevOps

### Task ID: INF-001
- **Title**: Setup Docker & PM2 Architecture
- **Description**: Containerize the Next.js application using a multi-stage Alpine Dockerfile. Configure PM2 for cluster mode to utilize all CPU cores.
- **Dependencies**: None
- **Priority**: P0 (Critical)
- **Complexity**: Medium
- **Estimated Hours**: 4
- **Acceptance Criteria**: Running `docker compose up` spins up PostgreSQL, Redis, and a PM2-managed Next.js instance on port 3000.
- **Suggested Git Branch Name**: `feat/inf-001-docker-setup`
- **Suggested Commit Message**: `feat: initialize multi-stage docker and PM2 cluster configuration`

### Task ID: INF-002
- **Title**: Initialize Database Migration CI/CD
- **Description**: Configure GitHub Actions to run Prisma schema validation, generate artifacts, and apply migrations securely to the staging database.
- **Dependencies**: INF-001
- **Priority**: P0 (Critical)
- **Complexity**: Low
- **Estimated Hours**: 3
- **Acceptance Criteria**: Pushing to `main` automatically runs `npx prisma migrate deploy` in the CI pipeline without errors.
- **Suggested Git Branch Name**: `feat/inf-002-db-migrations-ci`
- **Suggested Commit Message**: `feat: setup github actions for automated prisma migrations`

---

## Module 2: Identity & Multi-Tenancy

### Task ID: IDN-001
- **Title**: Implement Auth.js & User Registration
- **Description**: Integrate NextAuth (Auth.js) using the Prisma adapter. Configure Email/Password credentials and Google OAuth providers.
- **Dependencies**: INF-002
- **Priority**: P0 (Critical)
- **Complexity**: Medium
- **Estimated Hours**: 6
- **Acceptance Criteria**: A user can register, log in, and establish an active Next.js session stored securely in Redis.
- **Suggested Git Branch Name**: `feat/idn-001-user-auth`
- **Suggested Commit Message**: `feat: implement Auth.js with credentials and Google OAuth`

### Task ID: IDN-002
- **Title**: Build Workspace Switcher & RBAC Middleware
- **Description**: Create the UI for users to create and switch between multiple Workspaces. Implement Edge Middleware to verify standard RBAC roles (Owner, Admin, Viewer).
- **Dependencies**: IDN-001
- **Priority**: P0 (Critical)
- **Complexity**: High
- **Estimated Hours**: 8
- **Acceptance Criteria**: A user can toggle between "Acme Corp" and "Personal Site", with API endpoints correctly denying access if the user lacks permissions for that specific `workspaceId`.
- **Suggested Git Branch Name**: `feat/idn-002-workspace-rbac`
- **Suggested Commit Message**: `feat: implement multi-tenant workspace routing and RBAC middleware`

---

## Module 3: Visual Builder Engine

### Task ID: BLD-001
- **Title**: Scaffold Drag-and-Drop Canvas UI
- **Description**: Initialize the Zustand state store. Build the central iframe/canvas interface allowing users to drag `Section` and `Text` primitives from a sidebar into the viewport.
- **Dependencies**: IDN-002
- **Priority**: P0 (Critical)
- **Complexity**: High
- **Estimated Hours**: 12
- **Acceptance Criteria**: Components can be reordered on the canvas, and the underlying JSON tree state updates accordingly.
- **Suggested Git Branch Name**: `feat/bld-001-dnd-canvas`
- **Suggested Commit Message**: `feat: scaffold core drag-and-drop builder canvas and Zustand store`

### Task ID: BLD-002
- **Title**: Implement JSON Tree Database Persistence
- **Description**: Wire the Canvas "Save" button to the API. Serialize the Zustand JSON tree and update the `PAGE_VERSION` table in PostgreSQL.
- **Dependencies**: BLD-001
- **Priority**: P1 (High)
- **Complexity**: Medium
- **Estimated Hours**: 5
- **Acceptance Criteria**: Refreshing the browser successfully re-hydrates the Canvas UI from the saved database JSON tree.
- **Suggested Git Branch Name**: `feat/bld-002-canvas-persistence`
- **Suggested Commit Message**: `feat: connect builder canvas to PAGE_VERSION database persistence`

---

## Module 4: Dynamic Theming & Media

### Task ID: THM-001
- **Title**: Global CSS Variable Orchestration
- **Description**: Create a Sidebar panel allowing users to define global colors and typography. Inject these as `--var` CSS tokens into the Canvas DOM at runtime.
- **Dependencies**: BLD-001
- **Priority**: P1 (High)
- **Complexity**: Medium
- **Estimated Hours**: 6
- **Acceptance Criteria**: Changing "Primary Color" in the UI instantly updates the color of all Button components on the canvas.
- **Suggested Git Branch Name**: `feat/thm-001-global-css-vars`
- **Suggested Commit Message**: `feat: implement dynamic CSS variable orchestration for global themes`

### Task ID: MED-001
- **Title**: Direct-to-S3 Image Upload Flow
- **Description**: Create the Media Library UI. Implement the API to generate pre-signed S3 URLs, allowing browsers to upload images directly to the bucket.
- **Dependencies**: IDN-002
- **Priority**: P1 (High)
- **Complexity**: Medium
- **Estimated Hours**: 8
- **Acceptance Criteria**: A user can upload a 5MB image, see it in their Media Library, and the S3 key is saved to the `ASSET` database table.
- **Suggested Git Branch Name**: `feat/med-001-s3-direct-upload`
- **Suggested Commit Message**: `feat: implement presigned URL generation and direct-to-S3 uploads`

---

## Module 5: Publishing & Edge Routing

### Task ID: PUB-001
- **Title**: Construct Publishing Background Queue
- **Description**: Set up Redis/BullMQ. When a user clicks "Publish", queue a job that locks the Draft JSON tree, copies it to the Published JSON tree, and triggers an Edge Cache purge.
- **Dependencies**: BLD-002
- **Priority**: P0 (Critical)
- **Complexity**: High
- **Estimated Hours**: 10
- **Acceptance Criteria**: Clicking "Publish" returns an instant success toast, while the background worker safely compiles the site without blocking the API.
- **Suggested Git Branch Name**: `feat/pub-001-bullmq-publishing`
- **Suggested Commit Message**: `feat: build BullMQ background worker for asynchronous publishing`

### Task ID: PUB-002
- **Title**: Next.js Catch-All Routing & ISR
- **Description**: Build the public-facing `app/[...slug]/page.tsx` route. It must parse the hostname, fetch the correct Published JSON tree from the DB, and render it using Incremental Static Regeneration.
- **Dependencies**: PUB-001
- **Priority**: P0 (Critical)
- **Complexity**: High
- **Estimated Hours**: 8
- **Acceptance Criteria**: Navigating to `testsite.platform.com` successfully renders the compiled React UI matching the builder's published JSON tree.
- **Suggested Git Branch Name**: `feat/pub-002-isr-catchall-routing`
- **Suggested Commit Message**: `feat: implement ISR edge routing and dynamic component rendering`
