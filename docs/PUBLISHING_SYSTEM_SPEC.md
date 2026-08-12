# Website Publishing System Specification

**Overview**: The Publishing System is the mission-critical bridge between the dynamic Builder Engine and the static Edge CDN. It orchestrates domain provisioning, SSL termination, background queuing, and global cache invalidation to ensure websites launch securely and instantaneously.

---

## 1. Environments & Deployment Tiers

Every website exists in three distinct states:
1. **Preview**: The live editing state. Rendered directly from the `Page` table's active JSON blob. Highly dynamic, un-cached, and only accessible to authenticated Workspace members inside the iframe.
2. **Staging**: A compiled snapshot. Accessible via a secure platform subdomain (e.g., `staging-123.platform.com`). Used for final QA testing before going public.
3. **Production**: The live, publicly indexed website. Accessible via the user's **Custom Domain**. Rendered at the Edge utilizing full Incremental Static Regeneration (ISR).

## 2. The Entire Publishing Pipeline

When a user clicks **"Publish to Production"**, the following deterministic pipeline executes:

### Phase A: Queue & Snapshot
1. **Publishing Queue**: The API receives the request and immediately responds `202 Accepted`. A job is pushed to the Redis **Publishing Queue**.
2. **Version History**: The worker locks the current state of all pages and creates immutable `PageVersion` snapshots. The `Website.published_version` pointer is updated to this exact snapshot.
3. **Publishing Log**: A ledger entry is created: "Deployment v23 Started."

### Phase B: Compilation & Dependency Resolution
4. **Theme & CMS Lock**: The current global Theme variables and CMS schemas are frozen for this specific release.
5. **Incremental Deployment**: Instead of rebuilding all 10,000 pages of an enterprise site, the engine runs a diff. It only targets pages where the underlying `PageVersion` or `CMS_Entry` has changed since the last deployment.

### Phase C: Cache Invalidation
6. **Cache Purge & CDN Purge**: The worker issues `revalidateTag(website_id)` and calls the Cloudflare/Vercel API to purge the Edge Cache strictly for the updated URL paths.
7. **Success**: The WebSocket notifies the user's browser: "Publishing Complete."

### Phase D: Error Recovery & Rollback
- **Error Recovery**: If a worker crashes mid-deployment (e.g., out of memory), the pipeline halts. The **Publishing Log** marks the deployment as `FAILED`. The active Edge Cache is *never* purged if a deployment fails, meaning the live site never goes down.
- **Rollback**: A user can click "Revert" on any historical deployment in the **Version History**. The system instantly repoints `Website.published_version` to the old snapshot and triggers a **CDN Purge**. Rollbacks take < 2 seconds.

---

## 3. Domain Management Architecture

### A. Subdomain & Custom Domain Provisioning
- **Subdomain**: On creation, every site gets a free `[uuid].platform.app` subdomain for immediate visibility.
- **Custom Domain**: Users can map their own domain (e.g., `www.acme.com`).
- **DNS**: The UI instructs the user to configure a `CNAME` pointing to `cname.platform.app` (or an `A` Record for root domains).

### B. SSL & Edge Routing
- **SSL**: We leverage Vercel Custom Domains API or Cloudflare for SaaS. When a Custom Domain is attached, the platform automatically requests an SSL certificate via Let's Encrypt.
- **Edge Routing Check**: 
  - Incoming request: `GET https://www.acme.com/about`
  - The Edge Middleware intercepts the host header (`www.acme.com`).
  - It checks the Edge Redis Cache for the mapping: `acme.com -> website_id: 123`.
  - It rewrites the internal request to fetch the compiled assets for `website_id: 123`.

---

## 4. Portability & Export Ecosystem

We strictly prevent vendor lock-in by allowing users to eject from the platform at any time.

- **Export HTML**: 
  - Triggers a headless worker that crawls the Staging environment.
  - Compiles the React Virtual DOM into flattened, minified HTML/CSS/JS files.
  - Zips the folder and provides a download link. Suitable for hosting on basic Apache/Nginx servers.
- **Export Next.js**:
  - Compiles the site into a standard Next.js App Router codebase.
  - Transforms the proprietary JSON `node_tree` into raw `.tsx` files containing React components and Tailwind classes.
  - Allows Enterprise users to take their site in-house, retaining all server-side rendering (SSR) logic and CMS connections.
