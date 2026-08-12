# Template Engine Specification

**Overview**: The Template Engine is the distribution and scaffolding core of the SaaS platform. It governs how the 50 foundational industry templates (and future marketplace templates) are stored, versioned, previewed, and mapped onto a user's blank canvas.

---

## 1. The Template Library Foundation
- **10 Industries**: The engine categorizes templates primarily by the Top 10 high-value industries (e.g., SaaS, Healthcare, Real Estate).
- **5 Templates Each**: Each industry contains exactly 5 distinct, highly opinionated architectural blueprints, totaling 50 seed templates.

## 2. Template Metadata & Assets
Every template is stored as a database record (or an S3 JSON object) containing strict metadata:
- **Template Metadata**: Includes `Name`, `Description`, `Author`, `Tags`, and `Industry Category`.
- **Thumbnail & Screenshot**: High-resolution, edge-cached WEBP images. 
  - *Thumbnail*: Used in grid views (e.g., 400x300).
  - *Screenshot*: A full-page scrolling image of the entire layout used for deep inspection.
- **SEO Metadata**: Pre-configured Title tags, Meta descriptions, and OpenGraph variables injected upon instantiation to guarantee instant SEO readiness for the user.

## 3. The Mapping Engine (The "Brain")
When a template is instantiated, it is not just pasting HTML. It performs a deep structural mapping:
- **Theme Mapping**: Binds the template's color palette, typography, and spacing variables to the user's active Theme Engine profile.
- **CMS Mapping**: Automatically generates the required database schemas (e.g., `Blog Post` collection) and injects mock entries that populate the dynamic nodes on the template.
- **Component Mapping**: Locates pre-built UI components (e.g., `Hero_A`, `Pricing_B`) and wires them into the Virtual DOM tree.
- **Dependency Mapping**: Automatically detects and installs required third-party integrations (e.g., if a template includes a Stripe checkout, it prompts the user to input their Stripe API keys during initialization).

## 4. Lifecycle & Versioning
- **Template Version & Version Control**: Templates are versioned semantically (e.g., `v1.0.4`). The JSON payload of the template is immutable once published.
- **Template Update**: When an author updates a template, existing users who used that template receive a notification in their dashboard: "An update to the 'Nexus' template is available. [Review Changes]".
- **Rollback**: Users can revert their site's layout back to the original vanilla template state or rollback to a previous version of the template if an update breaks their custom modifications.

## 5. Economics & Marketplace
- **Template Marketplace**: A community hub where independent designers and agencies can submit their own templates.
- **Free Template**: Base templates provided by the platform (the core 50) available to all tiers.
- **Premium Template**: High-end templates sold by creators. The engine manages the Stripe connect split payments (e.g., 70% to Creator, 30% to Platform).

## 6. User Operations
- **Export Template**: Users can bundle their current website (Node Tree, CMS Schema, Theme) into a `.template` JSON file.
- **Import Template**: Users can upload a `.template` file to instantly scaffold a new workspace.
- **Clone Template**: When purchasing or selecting a template from the marketplace, the engine performs a deep copy of the template's JSON into the user's isolated workspace.
- **Duplicate Template**: Used primarily by creators to fork their own templates to create variations (e.g., changing a Dark Mode SaaS template to Light Mode).
- **Favorite Template**: Users can bookmark templates in the marketplace for later use.
- **Recently Used**: A quick-access dashboard ribbon showing templates the user has recently previewed or instantiated.
- **Template Preview**: Opens the template in an isolated, read-only iframe. Users can click through pages and view responsive breakpoints (Desktop/Mobile) before committing to a clone.

---

## 7. The Complete Workflow (Step-by-Step)

### A. Discovery Phase
1. The user navigates to the **Template Marketplace**.
2. The UI queries the engine, utilizing `Recently Used` data and `Favorite Template` tags to personalize the feed.
3. The user filters by one of the **10 Industries** and views the grid of **Thumbnail** images.
4. The user clicks a template to trigger the **Template Preview**. The engine loads the pre-rendered HTML/CSS into an isolated iframe alongside full-page **Screenshots**.

### B. Instantiation (The Clone Process)
5. The user clicks "Start with this Template".
6. If it is a **Premium Template**, the engine triggers the Stripe checkout flow. If it is a **Free Template**, it proceeds immediately.
7. The **Clone Template** worker initiates a background transaction.
8. **Theme Mapping**: The engine extracts the template's Design Tokens and writes them to the user's workspace Theme configuration.
9. **CMS Mapping**: The engine executes DDL commands (or Prisma creates) to scaffold the required dynamic collections (e.g., `Team Members`).
10. **Dependency Mapping**: The engine evaluates the template for external dependencies (e.g., Auth forms) and adds them to a "Pending Setup" checklist in the user's dashboard.

### C. Evolution & Maintenance
11. The user customizes the site using the Builder Engine.
12. Six months later, the original creator pushes a **Template Update** (e.g., adding a new AI integration block).
13. The user receives a notification, reviews the changelog (handled by **Version Control**), and accepts the update.
14. The engine intelligently merges the new components into the user's VDOM tree without overwriting their custom **SEO Metadata** or content.
15. If the merge conflicts visually, the user can hit **Rollback** to instantly restore their previous state.
16. The user, now a successful agency, decides to package their highly modified site. They use **Export Template** and list it on the Marketplace, completing the lifecycle.
