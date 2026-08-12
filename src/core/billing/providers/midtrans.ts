import { SubscriptionTier } from "@prisma/client";
import { PaymentProvider, CreateCheckoutSessionParams } from "./base";
import { PLAN_LIMITS } from "../plans.config";
import crypto from "crypto";

export class MidtransProvider implements PaymentProvider {
  private getServerKey(): string {
    const key = process.env.MIDTRANS_SERVER_KEY || "";
    if (!key) {
      throw new Error("Midtrans is not configured correctly. Missing MIDTRANS_SERVER_KEY.");
    }
    return key;
  }

  private isProduction = process.env.NODE_ENV === "production";
  private apiUrl = this.isProduction 
    ? "https://app.midtrans.com/snap/v1/transactions"
    : "https://app.sandbox.midtrans.com/snap/v1/transactions";

  async createCheckoutSession(params: CreateCheckoutSessionParams): Promise<{ url: string }> {
    const serverKey = this.getServerKey();
    const plan = PLAN_LIMITS[params.tier];
    if (!plan) throw new Error("Invalid tier config for Midtrans");

    const orderId = `order-${params.workspaceId}-${Date.now()}`;
    
    // We assume IDR pricing
    const grossAmount = params.tier === "FREE" ? 0 : 
                        params.tier === "STARTER" ? 285000 : 
                        params.tier === "PRO" ? 735000 : 
                        params.tier === "BUSINESS" ? 1500000 : 4500000;

    if (grossAmount === 0) {
      throw new Error("Cannot create a checkout session for a free tier.");
    }

    const payload = {
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount,
      },
      credit_card: { secure: true },
      customer_details: {
        first_name: "Workspace",
        email: "billing@workspace.com",
      },
      callbacks: {
        finish: params.successUrl,
        error: params.cancelUrl,
        pending: params.cancelUrl
      },
      custom_field1: params.workspaceId,
      custom_field2: params.tier
    };

    const authString = Buffer.from(`${serverKey}:`).toString("base64");

    const response = await fetch(this.apiUrl, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Basic ${authString}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("[Midtrans] Failed to create snap transaction:", text);
      throw new Error("Failed to create Midtrans checkout session.");
    }

    const data = await response.json();
    if (!data.redirect_url) {
      throw new Error("Failed to retrieve redirect_url from Midtrans.");
    }

    return { url: data.redirect_url };
  }

  async createCustomer(workspaceId: string, email: string, name: string): Promise<string> {
    return `midtrans_cust_${workspaceId}`;
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    const serverKey = this.getServerKey();
    // Implementation for actual cancellation if using Midtrans subscription API
  }

  async changeSubscription(subscriptionId: string, newTier: SubscriptionTier): Promise<void> {
    const serverKey = this.getServerKey();
    // Implementation for actual subscription change
  }

  verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
    try {
      const event = JSON.parse(payload);
      const { order_id, status_code, gross_amount } = event;
      
      const serverKey = this.getServerKey();
      
      const hash = crypto.createHash("sha512");
      hash.update(`${order_id}${status_code}${gross_amount}${serverKey}`);
      const calculatedSignature = hash.digest("hex");
      
      return signature === calculatedSignature;
    } catch (e) {
      return false;
    }
  }
}

export const midtransProvider = new MidtransProvider();
