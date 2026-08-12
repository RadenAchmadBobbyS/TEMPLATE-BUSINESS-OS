# Production Folder Structure & Code Conventions

**Overview**: To support the massive scope of the Enterprise Website Builder SaaS and prevent "spaghetti code," the codebase strictly adheres to **Feature-Driven Domain-Driven Design (DDD)**. Instead of grouping files by technical type (e.g., placing all API routes in one folder and all UI components in another), we group by **Domain/Feature** (e.g., `auth`, `builder`, `billing`).

---

## 1. Directory Tree (Next.js App Router)

```text
/
├── prisma/                 # Database Layer
│   ├── schema.prisma       # Global Prisma Schema (Already Validated)
│   ├── migrations/         # Generated SQL migrations
│   └── seed.ts             # Database seeding scripts
│
├── public/                 # Static Assets
│   ├── images/             # Global system icons/logos
│   └── fonts/              # Local font files
│
├── src/                    # Primary Source Code
│   ├── app/                # Next.js Routing Layer (Strictly UI & Endpoints)
│   │   ├── (auth)/         # Route Group: Login, Register
│   │   ├── (dashboard)/    # Route Group: Customer Dashboard (/workspaces)
│   │   ├── (builder)/      # Route Group: The Visual Canvas Editor (/builder)
│   │   ├── api/            # REST API Route Handlers
│   │   │   └── v1/         # Versioned endpoints
│   │   └── layout.tsx      # Global Root Layout
│   │
│   ├── core/               # Domain-Driven Feature Modules (The Business Logic)
│   │   ├── auth/           # Domain: Authentication & Identity
│   │   │   ├── components/ # Login forms, Auth wrappers
│   │   │   ├── services.ts # Business logic (e.g., registerUser)
│   │   │   ├── hooks.ts    # Custom React hooks (e.g., useUser)
│   │   │   ├── schemas.ts  # Zod validation schemas
│   │   │   └── types.ts    # Domain-specific TypeScript interfaces
│   │   │
│   │   ├── builder/        # Domain: The Website Builder Engine
│   │   ├── billing/        # Domain: Subscriptions & Payments
│   │   ├── cms/            # Domain: Headless CMS
│   │   ├── media/          # Domain: Asset Library
│   │   └── publishing/     # Domain: Deployment & DNS
│   │
│   ├── shared/             # Global Shared Resources (Used across domains)
│   │   ├── ui/             # shadcn/ui generic components (Button, Input, Modal)
│   │   ├── hooks/          # Generic hooks (useDebounce, useWindowSize)
│   │   ├── lib/            # Core singletons (prisma.ts, redis.ts)
│   │   ├── utils/          # Pure helper functions (formatDate.ts, cn.ts)
│   │   └── constants/      # Global enums and config (ROUTES, PLAN_LIMITS)
│   │
│   ├── providers/          # Global Context Providers (ThemeProvider, QueryProvider)
│   └── styles/             # Global CSS
│       └── globals.css     # Tailwind imports and CSS Variables
│
├── .env                    # Environment Variables (Ignored in Git)
├── .eslintrc.json          # Linting rules
├── docker-compose.yml      # Local dev environment (Redis, Postgres)
├── Dockerfile              # Production multi-stage image
├── next.config.mjs         # Next.js configuration
├── tailwind.config.ts      # Tailwind & Axiom Design System tokens
└── tsconfig.json           # Strict TypeScript configuration
```

---

## 2. Explanation of Layers & Folders

### A. The Routing Layer (`src/app`)
- **Purpose**: Strictly for mapping URLs to UI components or API endpoints.
- **Rule**: `page.tsx` and `route.ts` files should contain **zero complex business logic**. They should immediately import and call a Service or Component from `src/core/`.

### B. The Domain Layer (`src/core/`)
- **Purpose**: Feature isolation. The `billing` domain should not reach into the internal files of the `builder` domain. If domains need to communicate, they do so through exported Services.
- **Services (e.g., `core/auth/services.ts`)**: This is the Data Access Layer (Repositories) and Business Logic. E.g., `export async function verifyUserLogin() { ... }`. Database queries happen here, NEVER directly in UI components.
- **State Management**: Zustand stores are placed within their respective domains (e.g., `core/builder/store.ts`).
- **Types & Schemas**: Every domain defines its own Zod validation (`schemas.ts`) and TypeScript interfaces (`types.ts`).

### C. The Shared Layer (`src/shared/`)
- **Purpose**: Reusable primitives.
- **UI**: Pure presentational components. This is where all generic `shadcn/ui` components live. They know nothing about the business logic.
- **Lib**: The singletons required to connect to external systems (e.g., the exported `PrismaClient` instance).

---

## 3. Strict Coding Conventions

### A. Naming Conventions
- **Folders**: `kebab-case` (e.g., `date-picker`).
- **Components**: `PascalCase` (e.g., `Button.tsx`, `LoginForm.tsx`).
- **Hooks**: `camelCase` starting with `use` (e.g., `useDebounce.ts`).
- **Services & Utils**: `camelCase` (e.g., `formatCurrency.ts`).
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_UPLOAD_SIZE`).

### B. Import Conventions
- We utilize TypeScript Path Aliases to prevent "relative import hell" (`../../../../utils.ts`).
- **Alias Definitions** (in `tsconfig.json`):
  - `@/app/*` -> `src/app/*`
  - `@/core/*` -> `src/core/*`
  - `@/shared/*` -> `src/shared/*`
- **Import Order**: 
  1. React/Next.js core libraries.
  2. Third-party NPM packages.
  3. `@/shared/...` primitives.
  4. `@/core/...` domain logic.
  5. Relative imports (e.g., `./styles.css`).

### C. Server vs. Client Boundary
- By default, all components are React Server Components (RSC).
- The `"use client"` directive is explicitly added *only* to the lowest possible leaf nodes in the component tree that require interactivity (e.g., a specific `core/auth/components/SubmitButton.tsx` instead of making the entire page a Client Component). This maximizes SEO and load speeds.
