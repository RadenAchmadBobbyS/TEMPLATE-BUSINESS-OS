# Storage & Media Architecture Specification

**Overview**: This document defines the infrastructure and logic for managing user assets, dynamic media optimization, and bulk exports. It heavily leverages S3-compatible object storage (AWS S3, Cloudflare R2), Edge CDNs, and Signed URLs to ensure hyper-secure, low-latency asset delivery.

---

## 1. Asset Upload & Delivery (Images, Video, Audio, Documents)

**Supported Formats**: Images (PNG/JPG/SVG/GIF), Video (MP4/WebM), Audio (MP3/WAV), Documents (PDF/Word), Archives (ZIP).

### A. Flow (Direct-to-S3 Upload)
To prevent Next.js Vercel functions from timing out or hitting memory limits (4.5MB), files are NEVER uploaded through our Node.js servers.
1. The Client requests a **Signed URL** for a specific file name and MIME type.
2. The API checks the Workspace **Storage Quota**. If within limits, it generates a time-bound (5 minutes) presigned S3 PUT URL.
3. The Client uses `fetch()` to upload the payload directly from the browser to the S3 bucket.
4. The Client notifies our API that the upload succeeded.
5. The API triggers a background queue (Redis/BullMQ) to process the asset (Thumbnail generation, Virus Scan).

### B. Database
- **Table**: `ASSET` (`id`, `workspace_id`, `website_id`, `url`, `type`, `size_bytes`, `version`).
- When a file is updated, a new **File Version** is created in S3, and the database updates the pointer, keeping the old version accessible for rollback if needed.

### C. API
- `POST /api/v1/storage/upload-intent`: Returns `{ signedUrl, assetId }`.
- `POST /api/v1/storage/finalize`: Client hits this after S3 confirms receipt.

### D. Security
- **Virus Scan**: A background AWS Lambda function (ClamAV) automatically scans every incoming object. If a virus is detected, the object is quarantined and the DB record is marked `MALICIOUS`.
- **Signed URL**: Prevents unauthorized uploads. The signature is cryptographically bound to the exact file size and MIME type.

### E. Optimization
- **Chunk Upload & Resume**: For large Videos or ZIPs (>50MB), the API utilizes S3 Multipart Upload. The client chunks the file into 5MB blocks. If the connection drops, it resumes from the last successful chunk index.

---

## 2. Media Optimization & CDN

**Supported Features**: CDN, Thumbnail, Compression, Image Resize, WebP, AVIF.

### A. Flow (On-the-fly Image Processing)
We do not pre-generate 5 different sizes for every uploaded image. We use an Edge Image Optimizer (like Next.js `next/image` or Cloudflare Image Resizing).
1. The HTML `<img src="/cdn-cgi/image/width=800,format=auto/my-image.jpg">` requests the image.
2. The Edge CDN intercepts the request.
3. It fetches the original large JPG from the S3 bucket.
4. It compresses it, resizes it to 800px, and converts it to **WebP** or **AVIF** (based on the browser's `Accept` headers).
5. It returns the optimized image and caches it at the Edge.

### B. Database
- No database changes required. The `ASSET` table strictly stores the URL to the raw, unoptimized original file.

### C. API
- Built natively into the routing layer (e.g., `GET /_next/image?url=...&w=800&q=75`).

### D. Security
- **Public URL**: Standard images used on published websites are public.
- **Private URL**: Confidential documents (e.g., HR PDFs on an Intranet template) are stored in a restricted S3 bucket. Accessing them requires the API to generate a temporary `GET` Signed URL.

### E. Optimization
- Reduces bandwidth costs by up to 80%.
- Eliminates the need for background worker queues generating thousands of unused **Thumbnails**.

---

## 3. Exports & Backups

**Supported Features**: Template Export, Theme Export, Website Export, Backup.

### A. Flow (Asynchronous Export)
Exporting a massive website (JSON VDOM, Assets, CMS Data) is computationally heavy.
1. User clicks "Export Website".
2. API instantly returns `202 Accepted` and pushes a job to Redis.
3. A background worker queries the DB, serializes the JSON, downloads referenced assets, and zips them.
4. The worker uploads the `export.zip` to a private S3 bucket.
5. The user receives a real-time WebSocket notification or Email with a temporary **Signed URL** to download the archive.

### B. Database
- **Table**: `BACKUP_LOG` (`id`, `workspace_id`, `type`, `s3_key`, `expires_at`).

### C. API
- `POST /api/v1/storage/export-website`: Triggers the background worker.
- `GET /api/v1/storage/backups/{id}/download`: Resolves the DB record into a 15-minute Signed URL.

### D. Security
- Exports contain highly sensitive intellectual property (Themes, CMS Data). They are explicitly blocked from **Public URLs**. Only the `OWNER` or `ADMIN` can request the download link, and the S3 objects are automatically lifecycle-deleted after 24 hours.

### E. Optimization
- Stream-zipping (e.g., `archiver` in Node.js) directly to the S3 multipart upload stream prevents the background worker from running out of RAM when exporting gigabyte-sized websites.
