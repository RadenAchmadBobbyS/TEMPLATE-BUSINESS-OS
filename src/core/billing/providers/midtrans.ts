import { SubscriptionTier } from "@prisma/client";
import { PaymentProvider, CreateCheckoutSessionParams } from "./base";
import { PLAN_LIMITS } from "../plans.config";

export class MidtransProvider implements PaymentProvider {
  private serverKey = process.env.MIDTRANS_SERVER_KEY || "";
  private clientKey = process.env.MIDTRANS_CLIENT_KEY || "";
  private isProduction = process.env.NODE_ENV === "production";
  private apiUrl = this.isProduction 
    ? "https://app.midtrans.com/snap/v1/transactions"
    : "https://app.sandbox.midtrans.com/snap/v1/transactions";

  async createCheckoutSession(params: CreateCheckoutSessionParams): Promise<{ url: string }> {
    if (!this.serverKey) {
      console.warn("[Midtrans] Missing SERVER_KEY. Simulating successful checkout.");
      return { url: `${params.successUrl}?session_id=mock_midtrans_${Date.now()}` };
    }

    const plan = PLAN_LIMITS[params.tier];
    if (!plan) throw new Error("Invalid tier config for Midtrans");

    // In a real implementation, we would POST to Midtrans Snap API
    // and parse the redirect_url from the response.
    // For now, we simulate the structure.
    const orderId = `order-${params.workspaceId}-${Date.now()}`;
    const payload = {
      transaction_details: {
        order_id: orderId,
        gross_amount: params.tier === "PRO" ? 290000 : 990000, // example IDR pricing
      },
      credit_card: { secure: true },
      customer_details: {
        first_name: "Workspace",
        email: "billing@workspace.com",
      }
    };

    // Return a mock URL for architecture completeness as requested
    return { url: `${params.successUrl}?session_id=mock_midtrans_${orderId}` };
  }

  async createCustomer(workspaceId: string, email: string, name: string): Promise<string> {
    // Midtrans doesn't have a strict Customer object like Stripe, 
    // it usually uses customer_details inline. We can return the workspaceId as mock.
    return `midtrans_cust_${workspaceId}`;
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    // Midtrans Core API / v2 / cancel
    if (!this.serverKey) {
      console.warn(`[Midtrans] Mock cancelling subscription ${subscriptionId}`);
      return;
    }
    // implementation
  }

  async changeSubscription(subscriptionId: string, newTier: SubscriptionTier): Promise<void> {
    // Subscription modification logic
    if (!this.serverKey) {
      console.warn(`[Midtrans] Mock changing subscription ${subscriptionId} to ${newTier}`);
      return;
    }
  }

  verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
    // Real implementation requires SHA512(order_id + status_code + gross_amount + server_key)
    return true; 
  }
}

export const midtransProvider = new MidtransProvider();
