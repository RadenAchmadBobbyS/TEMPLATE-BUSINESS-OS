# Headless CMS Specification

**Overview**: The integrated Headless CMS is the dynamic data engine of the platform. It allows users to define structured content models, manage records through strict editorial workflows, and bind that data seamlessly to the visual drag-and-drop canvas.

---

## 1. Built-in Core Collections (Entities)
To accelerate time-to-market for users, the CMS provides 13 highly optimized, out-of-the-box collections with pre-configured schemas.

1. **Blog**: Manages articles. Includes fields for `Title`, `RichText Content`, `Author (Reference)`, `PublishDate`, and `CoverImage`.
2. **Products**: E-commerce / Catalog entities. Includes `Name`, `SKU`, `Price`, `Inventory`, `Images (Gallery)`, and `Variants`.
3. **Services**: Service offerings. Includes `ServiceName`, `Icon/Illustration`, `Description`, and `PricingTier`.
4. **Portfolio**: Case studies / past work. Includes `ProjectName`, `ClientName`, `CompletionDate`, and `Results (Metrics)`.
5. **Team**: Employee directory. Includes `Name`, `Role`, `Headshot`, `Bio`, and `SocialLinks`.
6. **Testimonials**: Social proof. Includes `Quote`, `AuthorName`, `Company`, `Rating (1-5)`, and `Avatar`.
7. **Gallery**: Image/Video albums. Includes `AlbumName`, `MediaReferences`, and `Location`.
8. **FAQ**: Frequently asked questions. Includes `Question (String)`, `Answer (RichText)`, and `Category (Reference)`.
9. **Events**: Webinars or physical events. Includes `EventName`, `StartDate`, `EndDate`, `Location`, and `RegistrationLink`.
10. **Career**: Job postings. Includes `JobTitle`, `Department`, `Location`, `Type (Full-time/Remote)`, and `Description`.
11. **Case Study**: Deep-dive success stories. Includes `Challenge`, `Solution`, `Impact`, and `ClientApproval (Boolean)`.
12. **News**: Press releases. Includes `Headline`, `PressDate`, `SourceLink`, and `Body`.
13. **Announcement**: Micro-updates (e.g., for notification banners). Includes `Text`, `Link`, and `ExpiryDate`.

## 2. Data Modeling & Schemas
- **Custom Collection**: Users can create entirely bespoke collections (e.g., `FleetVehicles`) using a drag-and-drop schema builder.
- **Custom Fields**: Supports primitives (String, Number, Boolean, Date) and advanced types (Rich Text, Color Picker, Location/Map, Code Block).
- **Field Validation**: Granular constraints applied at the database level. Includes Regex matching, Min/Max lengths, required fields, and unique constraints.
- **Relationship**: Defines how collections interact. Supports 1:1, 1:N, and N:M (e.g., A `Blog` has many `Tags` [N:M]).
- **Reference**: A specific field type allowing a record in one collection to point to a record in another (e.g., `Author` field in `Blog` references the `Team` collection).
- **Category & Tag**: Built-in taxonomy models. Categories are hierarchical (parent/child), while Tags are flat, allowing for dynamic filtering on the frontend.

## 3. Editorial States & Versioning
- **Draft**: The default state. The record exists in the database but is explicitly excluded from the public API and static site generation pipelines.
- **Publish**: The record is live. Triggering this state fires a webhook to Vercel/CDN to incrementally regenerate (ISR) the specific pages displaying this content.
- **Schedule**: Users can set a future `publish_at` timestamp. A background Redis queue (BullMQ) monitors this and flips the status to `Publish` at the exact time.
- **Version**: Every time a record is saved, a snapshot is created. Users can view a diff of changes and revert to any historical state.

## 4. Workflows & Permissions
- **Workflow**: Custom Kanban-style content pipelines. E.g., `Draft -> In Review -> Legal Check -> Ready to Publish`.
- **Approval**: Granular transition controls. E.g., Only users with the `Editor-in-Chief` role can move a record from `In Review` to `Publish`.
- **Role Permission**: Strict RBAC (Role-Based Access Control). Defines CRUD access at the Collection level and Field level (e.g., a "Guest Writer" can edit `Blog.Content` but cannot edit `Blog.Slug`).

## 5. Media & Asset Management
- **Media**: A centralized asset library powered by S3. Supports folders, bulk uploads, WebP auto-conversion, and EXIF data stripping. When an image is replaced in the Media library, it cascades to all CMS records referencing it.

## 6. Routing & SEO
- **Slug**: A unique URL-friendly string generated automatically from the Title field (e.g., "Hello World" -> `hello-world`). Includes conflict resolution (appending `-1`). Serves as the dynamic routing parameter in Next.js (`/blog/[slug]`).
- **SEO**: Every collection automatically inherits an SEO metadata block. Users can map collection fields to SEO tags (e.g., `Meta Title` = `Blog.Title`, `OpenGraph Image` = `Blog.CoverImage`).
- **Localization**: Field-level internationalization. Users can add locales (e.g., `en-US`, `fr-FR`). The CMS UI provides side-by-side translation panels, and the API returns the specific locale requested by the client.

## 7. Data Delivery (APIs)
- **API (REST)**: Auto-generated RESTful endpoints for every collection (e.g., `GET /api/v1/collections/blog`). Secured via Bearer tokens. Supports complex query parameters for filtering, sorting, and pagination (e.g., `?filter[status]=publish&sort=-createdAt`).
- **GraphQL**: A fully typed GraphQL API automatically generated from the user's schemas. Resolves relationships efficiently (preventing N+1 queries via DataLoader). Crucial for users wanting to decouple the CMS from the Visual Builder and use it as a pure Headless CMS for native iOS/Android apps.
