# Core API Specification

**Overview**: This document defines the strict RESTful standards and architectural patterns that govern all external and internal API interactions within the Website Builder SaaS. It ensures parity with OpenAPI (Swagger) specifications and maintains structural compatibility with our auto-generated GraphQL layer.

---

## 1. API Global Standards

### A. Fundamentals
- **REST Standard**: All endpoints strictly adhere to REST verbs (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`). Non-CRUD operations (like publishing) are mapped as actions on resources (e.g., `POST /api/v1/websites/{id}/publish`).
- **Versioning**: Enforced at the URL level (`/api/v1/...`). Deprecating a version requires a 6-month sunset period.
- **OpenAPI / Swagger**: The API is fully documented using OpenAPI 3.1 specifications. A `/api/docs` route automatically serves a Swagger UI based on these definitions.
- **GraphQL Compatibility**: Every REST endpoint maps 1:1 with a GraphQL Resolver. The REST layer acts as a facade over the core application use-cases, ensuring both protocols share the same underlying security and validation logic.

### B. Query Architecture (Pagination, Filtering, Sorting, Searching)
All `GET` collection endpoints support standardized query parameters:
- **Pagination**: `?page=1&limit=50`. Responses include a `meta` block containing `totalItems`, `totalPages`, and `currentPage`.
- **Filtering**: `?filter[status]=PUBLISHED&filter[authorId]=xyz`.
- **Sorting**: `?sort=-createdAt` (descending) or `?sort=title` (ascending).
- **Searching**: `?q=hello` utilizes PostgreSQL Full-Text Search or GIN indices across relevant textual columns.

### C. Security & Reliability
- **Authentication**: Bearer Token (JWT) provided in the `Authorization: Bearer <token>` header.
- **Authorization**: RBAC enforced via Next.js Middleware. Verifies the user's role against the requested `workspaceId`.
- **Rate Limit**: Enforced via Redis. Default limits: `100 requests / minute` per IP/User. Exceeding returns `429 Too Many Requests`.
- **Validation**: Enforced via Zod schemas. Invalid payloads return `400 Bad Request` with exact field-level error messages.
- **Error Handling**: Standardized JSON format for all errors:
  ```json
  {
    "error": {
      "code": "VALIDATION_FAILED",
      "message": "The provided email is invalid.",
      "details": [{ "field": "email", "issue": "Must be a valid email address." }]
    }
  }
  ```

---

## 2. Standardized Endpoint Examples

### Endpoint 1: Authenticate User (Login)
- **Purpose**: Exchange credentials for an access token.
- **Method**: `POST`
- **URL**: `/api/v1/auth/login`
- **Headers**: `Content-Type: application/json`
- **Body**: 
  ```json
  { "email": "user@acme.com", "password": "securepassword123" }
  ```
- **Validation**: `email` (Valid Email, Required), `password` (String, Required).
- **Permission**: Public (No auth required).
- **Status Codes**: 
  - `200 OK` (Success)
  - `400 Bad Request` (Validation Failed)
  - `401 Unauthorized` (Invalid Credentials)
  - `429 Too Many Requests` (Rate Limited)
- **Example Request**:
  ```http
  POST /api/v1/auth/login HTTP/1.1
  Host: api.platform.com
  Content-Type: application/json

  { "email": "user@acme.com", "password": "securepassword123" }
  ```
- **Example Response**:
  ```json
  {
    "data": {
      "accessToken": "eyJhbG...",
      "user": { "id": "u-123", "email": "user@acme.com" }
    }
  }
  ```

### Endpoint 2: Retrieve CMS Entries
- **Purpose**: Fetch paginated, filtered content from a dynamic CMS collection.
- **Method**: `GET`
- **URL**: `/api/v1/workspaces/{workspaceId}/websites/{websiteId}/cms/{modelName}`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: None
- **Validation**: `workspaceId` & `websiteId` (Must be valid UUIDs), `modelName` (Must exist in database).
- **Permission**: `VIEWER` role or higher in the specific `workspaceId`.
- **Status Codes**:
  - `200 OK` (Success)
  - `401 Unauthorized` (Missing/Invalid Token)
  - `403 Forbidden` (Insufficient Role)
  - `404 Not Found` (Website or Model does not exist)
- **Example Request**:
  ```http
  GET /api/v1/workspaces/ws-1/websites/web-1/cms/blogs?page=1&limit=2&sort=-createdAt HTTP/1.1
  Host: api.platform.com
  Authorization: Bearer eyJhbG...
  ```
- **Example Response**:
  ```json
  {
    "data": [
      { "id": "entry-1", "title": "Hello World", "status": "PUBLISHED" },
      { "id": "entry-2", "title": "API Guide", "status": "DRAFT" }
    ],
    "meta": { "totalItems": 150, "totalPages": 75, "currentPage": 1 }
  }
  ```

### Endpoint 3: Create / Clone Template
- **Purpose**: Instantiate a new Website from a marketplace template.
- **Method**: `POST`
- **URL**: `/api/v1/workspaces/{workspaceId}/websites/clone-template`
- **Headers**: `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Body**: 
  ```json
  { "templateId": "tpl-999", "websiteName": "My New SaaS" }
  ```
- **Validation**: `templateId` (Required, UUID), `websiteName` (Required, String, Max 100 chars).
- **Permission**: `ADMIN` or `OWNER` role in the specific `workspaceId`.
- **Status Codes**:
  - `201 Created` (Success)
  - `402 Payment Required` (Workspace hit its quota limit)
  - `403 Forbidden` (Insufficient Role)
- **Example Request**:
  ```http
  POST /api/v1/workspaces/ws-1/websites/clone-template HTTP/1.1
  Host: api.platform.com
  Authorization: Bearer eyJhbG...
  
  { "templateId": "tpl-999", "websiteName": "My New SaaS" }
  ```
- **Example Response**:
  ```json
  {
    "data": {
      "websiteId": "web-new-123",
      "status": "CLONING_IN_PROGRESS"
    }
  }
  ```
