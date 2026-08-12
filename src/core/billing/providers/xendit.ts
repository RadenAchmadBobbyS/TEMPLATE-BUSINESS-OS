import { SubscriptionTier } from "@prisma/client";
import { PaymentProvider, CreateCheckoutSessionParams } from "./base";
import { PLAN_LIMITS } from "../plans.config";

export class XenditProvider implements PaymentProvider {
  private getSecretKey(): string {
    const key = process.env.XENDIT_SECRET_KEY || "";
    if (!key) {
      throw new Error("Xendit is not configured correctly. Missing XENDIT_SECRET_KEY.");
    }
    return key;
  }

  private getWebhookToken(): string {
    const token = process.env.XENDIT_WEBHOOK_TOKEN || "";
    if (!token) {
      console.warn("[Xendit] Warning: XENDIT_WEBHOOK_TOKEN is not configured.");
    }
    return token;
  }
  
  async createCheckoutSession(params: CreateCheckoutSessionParams): Promise<{ url: string }> {
    const secretKey = this.getSecretKey();
    const plan = PLAN_LIMITS[params.tier];
    if (!plan) throw new Error("Invalid tier config for Xendit");

    const invoiceId = `inv-${params.workspaceId}-${Date.now()}`;
    
    // We assume IDR pricing
    const amount = params.tier === "FREE" ? 0 : 
                   params.tier === "STARTER" ? 285000 : 
                   params.tier === "PRO" ? 735000 : 
                   params.tier === "BUSINESS" ? 1500000 : 4500000;

    if (amount === 0) {
      throw new Error("Cannot create a checkout session for a free tier.");
    }

    const payload = {
      external_id: invoiceId,
      amount: amount,
      payer_email: "billing@workspace.com",
      description: `Subscription to ${params.tier}`,
      success_redirect_url: params.successUrl,
      failure_redirect_url: params.cancelUrl
    };

    const authString = Buffer.from(`${secretKey}:`).toString("base64");

    const response = await fetch("https://api.xendit.co/v2/invoices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${authString}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("[Xendit] Failed to create invoice:", text);
      throw new Error("Failed to create Xendit checkout session.");
    }

    const data = await response.json();
    if (!data.invoice_url) {
      throw new Error("Failed to retrieve invoice_url from Xendit.");
    }

    return { url: data.invoice_url };
  }

  async createCustomer(workspaceId: string, email: string, name: string): Promise<string> {
    return `xendit_cust_${workspaceId}`;
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    const secretKey = this.getSecretKey();
    // Implementation for Xendit cancellation if using recurring payments
  }

  async changeSubscription(subscriptionId: string, newTier: SubscriptionTier): Promise<void> {
    const secretKey = this.getSecretKey();
    // Implementation for Xendit subscription change
  }

  verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
    const webhookToken = this.getWebhookToken();
    if (!webhookToken) return true; // Accept if no token is configured in dev
    return signature === webhookToken;
  }
}

export const xenditProvider = new XenditProvider();
