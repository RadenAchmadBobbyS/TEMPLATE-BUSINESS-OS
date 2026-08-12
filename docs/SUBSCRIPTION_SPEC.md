# Subscription & Billing System Specification

**Overview**: This document specifies the enterprise billing architecture, designed to handle complex B2B SaaS pricing models including flat-rate tiers, seat-based billing, and metered usage (AI credits, Bandwidth). It relies on robust webhook listeners to maintain synchronization with payment gateways (Stripe/Midtrans/Xendit).

---

## 1. Database & ERD

The billing system is deeply integrated into the Multi-Tenant `WORKSPACE` structure.

```mermaid
erDiagram
    WORKSPACE ||--o{ SUBSCRIPTION : "Owns"
    SUBSCRIPTION ||--o{ INVOICE : "Generates"
    SUBSCRIPTION ||--o{ USAGE_RECORD : "Accumulates"
    SUBSCRIPTION ||--o{ PROMO_CODE : "Applies"

    WORKSPACE {
        uuid id PK
        string name
    }

    SUBSCRIPTION {
        uuid id PK
        uuid workspace_id FK
        string gateway_sub_id UK
        string plan_tier "FREE, STARTER, PRO, BUSINESS, ENTERPRISE"
        string billing_cycle "MONTHLY, YEARLY"
        enum status "ACTIVE, PAST_DUE, CANCELED, PAUSED, TRIALING"
        datetime current_period_start
        datetime current_period_end
        boolean cancel_at_period_end
    }

    USAGE_RECORD {
        uuid id PK
        uuid subscription_id FK
        enum metric "SEAT, STORAGE, AI_CREDIT, BANDWIDTH"
        int quantity
        datetime timestamp
    }

    INVOICE {
        uuid id PK
        uuid subscription_id FK
        string gateway_invoice_id
        int amount_cents
        string currency
        enum status "DRAFT, OPEN, PAID, UNCOLLECTIBLE, VOID"
        int tax_amount_cents
    }

    PROMO_CODE {
        string code PK
        enum type "DISCOUNT, COUPON, REFERRAL, AFFILIATE"
        int percentage_off
        int amount_off
        datetime expires_at
    }
```

---

## 2. Subscription State Machine

The system manages subscriptions through a strict, deterministic state machine driven almost entirely by Gateway Webhooks.

```mermaid
stateDiagram-v2
    [*] --> TRIALING : Sign Up (No CC required)
    TRIALING --> ACTIVE : Add Payment Method
    TRIALING --> CANCELED : Trial Expires
    ACTIVE --> PAST_DUE : Failed Payment
    PAST_DUE --> ACTIVE : Payment Retry Succeeds
    PAST_DUE --> CANCELED : Grace Period Ends (14 days)
    ACTIVE --> PAUSED : User Freezes Account
    PAUSED --> ACTIVE : User Resumes Account
    ACTIVE --> CANCELED : User Cancels (at period end)
    CANCELED --> [*]
```

---

## 3. Pricing Models & Workflows

### A. Flat-Rate Plans & Cycles
- **Tiers**: Free, Starter, Professional, Business, Enterprise.
- **Cycles**: Monthly or Yearly (with standard ~20% discount applied to Yearly).
- **Trial**: 14-day free trial on the Professional tier. Converts to Free Plan if no credit card is provided.

### B. Usage & Seat-Based Billing
- **Seat Based Billing**: Prorated automatically. If an Admin invites a new user mid-month, Stripe calculates the exact daily cost for the remaining days in the cycle.
- **Usage Based (Metered)**: Storage, Bandwidth, and AI Credits are reported hourly to Stripe via the `/v1/usage_records` API.
- **Workflow**: 
  1. User clicks "Generate AI Image".
  2. Next.js deducts 1 credit locally and fires an event to Redis.
  3. Redis aggregates usage. A CRON job reports total usage to the billing gateway every 24 hours to prevent API throttling.

### C. Promotions & Ecosystem
- **Coupons / Discounts**: Applied at checkout or mid-cycle. Supports percentage-off or flat-amount-off.
- **Referral / Affiliate**: Unique promo codes. When a new user signs up using a code, the system attributes the recurring revenue to the affiliate, generating a monthly payout report.

---

## 4. Upgrades, Downgrades & Refunds
- **Upgrade**: Immediate effect. The system calculates **Proration**, generating an immediate invoice for the price difference for the remainder of the month.
- **Downgrade**: Scheduled effect. The tier remains active until the `current_period_end`. At renewal, the new lower tier takes effect. Prevents complex negative-proration refunds.
- **Refund**: Handled purely via the Payment Gateway dashboard (e.g., Stripe) by support staff. Triggers an `invoice.refunded` webhook to update local DB records.

---

## 5. Webhooks & Notifications

The entire system is reactive to Webhooks to ensure total sync with the payment processor.

### A. Sequence Diagram: Failed Payment Workflow
```mermaid
sequenceDiagram
    participant Stripe
    participant WebhookAPI
    participant DB
    participant Email

    Stripe->>WebhookAPI: POST /api/webhooks/stripe {type: "invoice.payment_failed"}
    WebhookAPI->>DB: Update Subscription Status -> "PAST_DUE"
    WebhookAPI->>Email: Trigger "Payment Failed" Email
    Email-->>User: "Update your billing info. 14 days remaining."
    
    note over Stripe,DB: Payment Retry Logic (Smart Retries)
    Stripe->>WebhookAPI: POST /api/webhooks/stripe {type: "invoice.payment_succeeded"}
    WebhookAPI->>DB: Update Subscription Status -> "ACTIVE"
    WebhookAPI->>Email: Trigger "Thank You" Email
```

### B. Grace Period & Retry Logic
- If a payment fails, the system enters a **Grace Period** (e.g., 14 days). The gateway utilizes "Smart Retries" (retrying on different days/times).
- If the final retry fails, the webhook `customer.subscription.deleted` fires, setting the workspace status to `CANCELED`.

---

## 6. APIs
- `POST /api/billing/checkout`: Creates a Stripe Checkout Session for a specific Plan/Cycle.
- `POST /api/billing/portal`: Generates a secure link to the Stripe Customer Portal for the user to update cards or download **Invoices** (including **Tax** breakdowns).
- `POST /api/billing/pause`: Switches subscription status to `PAUSED` (retains data but locks editing) at the end of the billing cycle.

---

## 7. Security & Edge Cases
- **Security**: Webhook endpoints are strictly validated using `Stripe-Signature` cryptographic verification to prevent malicious actors from sending fake `invoice.paid` events.
- **Security**: Tax compliance (VAT/Sales Tax) is offloaded entirely to Stripe Tax/TaxJar to prevent legal liabilities.
- **Edge Case (Multiple Webhooks)**: Webhooks can arrive out of order or be duplicated. 
  - *Mitigation*: The `WEBHOOK_LOG` table stores processed Event IDs. The API checks if `event_id` exists; if yes, it returns `200 OK` without processing, ensuring idempotency.
- **Edge Case (Simultaneous Upgrades)**: A user rapidly clicks "Upgrade" multiple times.
  - *Mitigation*: The database uses optimistic locking on the `SUBSCRIPTION` record. Stripe Checkout Sessions expire immediately upon first successful use.
