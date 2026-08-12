import { SubscriptionTier } from "@prisma/client";
import { PaymentProvider, CreateCheckoutSessionParams } from "./base";
import { PLAN_LIMITS } from "../plans.config";

export class XenditProvider implements PaymentProvider {
  private secretKey = process.env.XENDIT_SECRET_KEY || "";
  private webhookToken = process.env.XENDIT_WEBHOOK_TOKEN || "";
  
  async createCheckoutSession(params: CreateCheckoutSessionParams): Promise<{ url: string }> {
    if (!this.secretKey) {
      console.warn("[Xendit] Missing SECRET_KEY. Simulating successful checkout.");
      return { url: `${params.successUrl}?session_id=mock_xendit_${Date.now()}` };
    }

    const plan = PLAN_LIMITS[params.tier];
    if (!plan) throw new Error("Invalid tier config for Xendit");

    // Mock representation of Xendit Invoice creation API
    const invoiceId = `inv-${params.workspaceId}-${Date.now()}`;
    const payload = {
      external_id: invoiceId,
      amount: params.tier === "PRO" ? 290000 : 990000, // example IDR pricing
      payer_email: "billing@workspace.com",
      description: `Subscription to ${params.tier}`,
      success_redirect_url: params.successUrl,
      failure_redirect_url: params.cancelUrl
    };

    return { url: `${params.successUrl}?session_id=mock_xendit_${invoiceId}` };
  }

  async createCustomer(workspaceId: string, email: string, name: string): Promise<string> {
    // Return a mock Xendit customer ID
    return `xendit_cust_${workspaceId}`;
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    if (!this.secretKey) {
      console.warn(`[Xendit] Mock cancelling subscription ${subscriptionId}`);
      return;
    }
  }

  async changeSubscription(subscriptionId: string, newTier: SubscriptionTier): Promise<void> {
    if (!this.secretKey) {
      console.warn(`[Xendit] Mock changing subscription ${subscriptionId} to ${newTier}`);
      return;
    }
  }

  verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
    // Xendit usually checks x-callback-token
    return signature === this.webhookToken;
  }
}

export const xenditProvider = new XenditProvider();
