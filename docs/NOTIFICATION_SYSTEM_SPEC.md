# Notification System Specification

**Overview**: The Notification System orchestrates all outbound communications (Email) and internal alerts (In-App). It relies on a high-throughput background queue to guarantee delivery without blocking the main Node.js event loop, enabling system-wide resilience during mass announcements.

---

## 1. Entity Relationship Diagram (ERD) & Database

The Notification subsystem tracks user preferences and individual alerts mapped to the core `USER` table.

```mermaid
erDiagram
    USER ||--o{ NOTIFICATION : "Receives"
    USER ||--o{ NOTIFICATION_PREFERENCE : "Configures"

    USER {
        uuid id PK
        string email
    }

    NOTIFICATION {
        uuid id PK
        uuid user_id FK
        enum type "SYSTEM, BILLING, PUBLISHING, SECURITY, DOMAIN, STORAGE"
        string title
        string message_body
        string action_url
        boolean is_read
        datetime created_at
    }

    NOTIFICATION_PREFERENCE {
        uuid user_id PK FK
        boolean email_billing_alerts
        boolean email_publish_alerts
        boolean email_security_alerts
        boolean email_marketing
        boolean in_app_sound
    }
```

---

## 2. Notification Triggers & Workflows

**Supported Events**: Subscription Reminder, Payment Reminder, Publish Success, Publish Failed, Domain Expired, Storage Full, Security Alert, System Announcement.

### A. Core Workflows
1. **Billing & Subscriptions**: 
   - *Payment Reminder*: 3 days before renewal, a CRON job scans `SUBSCRIPTION` tables and fires a webhook to the Queue to send an Email.
   - *Subscription Reminder*: Triggers if a user abandons a cart or their trial expires.
2. **Publishing**: 
   - *Publish Success/Failed*: Triggered synchronously at the exact end of the SSG build pipeline. Fires an In-App toast notification via WebSockets, and conditionally an Email if the user opted in.
3. **Ecosystem & Quotas**: 
   - *Domain Expired*: Fired by the DNS Polling Worker if the TXT records drop.
   - *Storage Full*: Triggered when an S3 Presigned URL is requested and the calculation hits 95% of the quota.
4. **Security & Admin**: 
   - *Security Alert*: Triggered by the Identity system (e.g., "New login from Tokyo"). Overrides all user preferences (Mandatory Email).
   - *System Announcement*: The Super Admin dashboard pushes a payload. The system fans out a generic notification to 10 Million users.

---

## 3. The Notification Queue Architecture

To prevent API timeouts when fanning out 10 Million "System Announcement" emails, we implement a highly scalable worker architecture.

### A. The Queue Flow
1. **Producer**: The API or a CRON job generates an event payload (e.g., `{ type: "PUBLISH_SUCCESS", userId: "123" }`) and pushes it to **Redis (BullMQ)**.
2. **Consumer (Worker)**: A decoupled Node.js process pulls the job.
3. **Preference Check**: The worker queries the `NOTIFICATION_PREFERENCE` table. If `email_publish_alerts == false`, it skips the Email step.
4. **Execution**:
   - **Email**: Dispatches an API call to AWS SES / SendGrid using a pre-configured React Email template.
   - **In-App**: Executes an `INSERT INTO NOTIFICATION` to persist the message, and broadcasts an event via WebSockets (Socket.io) to instantly pop up a Toast in the user's active browser session.

---

## 4. Dashboard & User Preferences

### A. User Preferences
- **Dashboard Location**: `Settings -> Notifications`.
- **Functionality**: A series of toggle switches mapping directly to the `NOTIFICATION_PREFERENCE` table. Allows users to explicitly opt-out of marketing or non-critical system emails (e.g., "Mute Publishing Emails"). *Security Alerts* are locked and cannot be disabled.

### B. In-App Notification Center
- **Dashboard Layout**: A bell icon 🔔 in the top-right Top Bar.
- **Badge**: Displays a red unread count bubble (queried instantly via `SELECT COUNT(id) FROM NOTIFICATION WHERE user_id = ? AND is_read = false`).
- **UI Flow**: Clicking the bell opens a dropdown menu. 
  - Unread notifications are highlighted with a blue dot. 
  - Clicking a notification triggers `PATCH /api/v1/notifications/{id}/read` and redirects the user to the `action_url` (e.g., navigating directly to the failed deployment log).
  - A "Mark All as Read" button updates the entire list in one database transaction.

---

## 5. API Endpoints

- `GET /api/v1/notifications`: Retrieves a paginated list of the user's alerts.
- `PATCH /api/v1/notifications/{id}/read`: Marks a single notification as read.
- `POST /api/v1/notifications/mark-all-read`: Clears the unread badge.
- `PUT /api/v1/users/me/preferences/notifications`: Updates the JSON toggles in the `NOTIFICATION_PREFERENCE` table.
