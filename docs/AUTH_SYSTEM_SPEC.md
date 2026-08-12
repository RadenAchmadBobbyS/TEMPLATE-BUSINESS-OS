# Authentication and Identity System Specification

**Overview**: This document specifies the complete, enterprise-grade Identity and Access Management (IAM) system for the Website Builder SaaS. It is built to support modern WebAuthn, OAuth, strict RBAC, and multi-tenant workspaces, fulfilling SOC2 compliance requirements.

---

## 1. Global Entity Relationship Diagram (ERD) & Database Tables
The foundation of the IAM relies on these core database tables.

```mermaid
erDiagram
    USER ||--o{ ACCOUNT : "OAuth Links"
    USER ||--o{ SESSION : "Active Sessions"
    USER ||--o{ DEVICE : "Trusted Devices"
    USER ||--o{ WORKSPACE_MEMBER : "Belongs to"
    WORKSPACE ||--o{ WORKSPACE_MEMBER : "Has Members"
    WORKSPACE ||--o{ INVITATION : "Pending Invites"
    USER ||--o{ AUDIT_LOG : "Performs"

    USER {
        uuid id PK
        string email UK
        string username UK
        string phone_number UK
        string password_hash
        boolean email_verified
        boolean phone_verified
        boolean two_factor_enabled
        string two_factor_secret
        enum status "ACTIVE, LOCKED, BANNED"
        datetime created_at
    }

    ACCOUNT {
        uuid id PK
        uuid user_id FK
        string provider "GOOGLE, GITHUB, APPLE, MICROSOFT"
        string provider_account_id UK
        string access_token
    }

    SESSION {
        uuid id PK
        uuid user_id FK
        string refresh_token UK
        string ip_address
        string user_agent
        datetime expires_at
    }

    DEVICE {
        uuid id PK
        uuid user_id FK
        string device_id UK
        string device_name
        boolean is_trusted
        datetime last_login
    }

    WORKSPACE {
        uuid id PK
        string name
    }

    WORKSPACE_MEMBER {
        uuid id PK
        uuid user_id FK
        uuid workspace_id FK
        enum role "OWNER, ADMIN, EDITOR, VIEWER, GUEST"
    }

    AUDIT_LOG {
        uuid id PK
        uuid user_id FK
        string action "LOGIN_SUCCESS, LOGIN_FAILED, PASSWORD_RESET"
        string ip_address
        datetime timestamp
    }
```

---

## 2. Authentication Methods & Workflow
**Supported Methods**: Email/Password, Username, Phone, Google, GitHub, Apple, Microsoft, Magic Link, Passkey (WebAuthn).

### A. Sequence Diagram: Multi-Factor Authentication (MFA) Flow
```mermaid
sequenceDiagram
    participant U as User
    participant C as Client (Next.js)
    participant A as Auth API
    participant DB as PostgreSQL
    participant E as Email/SMS Service

    U->>C: Submits Email + Password
    C->>A: POST /api/auth/login {email, password}
    A->>DB: Verify Hash
    DB-->>A: Valid, check 2FA status
    A-->>C: 401 Challenge {status: "MFA_REQUIRED"}
    C->>U: Show OTP / WebAuthn Prompt
    U->>C: Submits 6-digit OTP
    C->>A: POST /api/auth/verify-mfa {otp}
    A->>DB: Validate OTP / Secret
    A->>DB: Create Session & Log Device
    A-->>C: 200 OK + Set-Cookie (HttpOnly JWT)
```

### B. APIs
- `POST /api/auth/login`: Handles standard credentials. Returns `{ status: "SUCCESS" | "MFA_REQUIRED" }`.
- `POST /api/auth/oauth/[provider]`: Initiates redirect to IdP.
- `POST /api/auth/webauthn/verify`: Validates FIDO2 passkey cryptographic signatures.
- `POST /api/auth/magic-link`: Generates a secure, short-lived (15 min) JWT sent via Email.

### C. Edge Cases & Security
- **Edge Case**: User signs up with Google, then tries to log in with Email.
  - *Mitigation*: Account Linking. If the email matches, prompt the user to link accounts by logging in with Google first, then setting a password.
- **Security**: Passwords hashed using `Argon2id` (exceeds bcrypt).

---

## 3. Session & Device Management
**Supported**: Remember Device/Browser, Trusted Device, Login History, Logout All Devices.

### A. State Machine: Session Lifecycle
```mermaid
stateDiagram-v2
    [*] --> Active : Login Success
    Active --> Refreshing : Access Token Expires (15m)
    Refreshing --> Active : Valid Refresh Token Exchanged
    Refreshing --> Expired : Refresh Token Invalid/Expired (7d)
    Active --> Revoked : User clicks "Logout Device"
    Active --> Revoked : Global "Logout All"
    Expired --> [*]
    Revoked --> [*]
```

### B. Tokens & Cookies
- **Access Token (JWT)**: Short-lived (15 minutes). Contains user claims and roles.
- **Refresh Token (Opaque)**: Long-lived (7 days). Stored in PostgreSQL `SESSION` table.
- **Cookie Security**: Both tokens are sent to the client as `HttpOnly`, `Secure`, `SameSite=Lax` cookies to prevent XSS exfiltration.

### C. Device Management API
- `GET /api/auth/sessions`: Returns Login History and active devices (IP, Browser).
- `DELETE /api/auth/sessions/[id]`: Invalidates a specific refresh token (Logout remote device).

---

## 4. Threat Mitigation & Security
**Supported**: Captcha, Rate Limiting, Brute Force Protection, IP Blocking, Geo Restriction, CSRF, XSS, Account Lock, Suspicious Login Detection.

### A. Workflow: Suspicious Login Detection
1. **Trigger**: User logs in from an IP address in a new country, or using a highly unusual User-Agent.
2. **Action**: The API flags the login attempt.
3. **State Change**: `USER.status` temporarily set to `LOCKED_PENDING_VERIFICATION`.
4. **Notification**: System emails the user: "New login attempt from [Location]. Was this you?"
5. **Resolution**: User clicks the email link to authorize the device.

### B. Rate Limiting & Brute Force
- Powered by Redis. 
- **Endpoint Limit**: `/api/auth/login` allows 5 failed attempts per IP per 15 minutes.
- **Account Lock**: 10 failed attempts on a specific username globally locks the account for 30 minutes to prevent distributed brute force.

### C. CSRF & XSS Protection
- **XSS**: Mitigated by never storing tokens in `localStorage`. Using `HttpOnly` cookies.
- **CSRF**: Mitigated via `SameSite=Lax` cookies, and explicitly checking the `Origin` and `Referer` headers on all state-mutating requests. Next.js Server Actions automatically handle Anti-CSRF tokens.

---

## 5. Multi-Tenant Role-Based Access Control (RBAC)
**Supported**: Organization, Workspace, Team, Invitation, Roles (Owner, Admin, Editor, Viewer, Guest), Permission-Based Access.

### A. Workflow & Permissions Matrix
The IAM utilizes a matrix to resolve permissions at the edge before data is fetched.

| Role | Manage Workspace | Billing | Invite Members | Edit Canvas | View Published |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Owner** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Admin** | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Editor**| ❌ | ❌ | ❌ | ✅ | ✅ |
| **Viewer**| ❌ | ❌ | ❌ | ❌ | ✅ |
| **Guest** | ❌ | ❌ | ❌ | ❌ | ✅ (Restricted) |

### B. Sequence Diagram: Invitation Flow
```mermaid
sequenceDiagram
    participant O as Owner
    participant API as RBAC API
    participant DB as Database
    participant I as Invitee
    O->>API: POST /workspaces/{id}/invite {email, role: EDITOR}
    API->>DB: Create INVITATION record (token)
    API->>I: Send Email with Join Link
    I->>API: GET /invite/accept?token=xyz
    API->>DB: Validate Token
    API->>DB: Insert WORKSPACE_MEMBER
    API-->>I: Redirect to Workspace Dashboard
```

### C. Edge Cases
- **Edge Case**: An invited user does not have an account yet.
  - *Handling*: The join link redirects to the Signup flow, carrying the invitation token in the URL. Upon successful signup, the user is automatically added to the workspace.
- **Edge Case**: The last `OWNER` of a workspace tries to leave.
  - *Handling*: The API strictly prevents this, returning a `400 Bad Request`. Ownership must be transferred to an `ADMIN` first.
