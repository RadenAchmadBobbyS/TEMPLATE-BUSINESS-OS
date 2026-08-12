import Stripe from "stripe";
import { PaymentProvider, CreateCheckoutSessionParams } from "./base";
import { SubscriptionTier } from "@prisma/client";
import { STRIPE_PRICE_IDS } from "./stripe-config";

export class StripeProvider implements PaymentProvider {
  private getStripeClient(): Stripe {
    const key = process.env.STRIPE_SECRET_KEY || "";
    if (!key || key === "sk_test_123" || key.includes("test_123")) {
      throw new Error("Stripe is not configured correctly. Please provide a valid STRIPE_SECRET_KEY.");
    }
    return new Stripe(key);
  }

  async createCheckoutSession(params: CreateCheckoutSessionParams): Promise<{ url: string }> {
    const stripe = this.getStripeClient();
    const priceId = STRIPE_PRICE_IDS[params.tier];
    
    if (!priceId || priceId.includes("mock_")) {
      throw new Error(`Stripe is not configured correctly. Missing valid price ID for tier ${params.tier}.`);
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      client_reference_id: params.workspaceId,
      metadata: {
        workspaceId: params.workspaceId,
        tier: params.tier,
      },
      // Note: customer is omitted to let Stripe create a new customer mapping automatically
    });

    if (!session.url) {
      throw new Error("Failed to create Stripe checkout session");
    }

    return { url: session.url };
  }

  async createCustomer(workspaceId: string, email: string, name: string): Promise<string> {
    const stripe = this.getStripeClient();
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        workspaceId,
      },
    });

    return customer.id;
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    const stripe = this.getStripeClient();
    await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
  }

  async changeSubscription(subscriptionId: string, newTier: SubscriptionTier): Promise<void> {
    const stripe = this.getStripeClient();
    const newPriceId = STRIPE_PRICE_IDS[newTier];
    if (!newPriceId || newPriceId.includes("mock_")) {
      throw new Error(`Cannot change to tier ${newTier}: Stripe is not configured correctly.`);
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    
    // Stripe subscriptions have "items". We update the first item with the new price.
    const itemId = subscription.items.data[0]?.id;
    if (!itemId) {
      throw new Error(`Cannot change subscription: No subscription item found for ${subscriptionId}`);
    }

    await stripe.subscriptions.update(subscriptionId, {
      items: [
        {
          id: itemId,
          price: newPriceId,
        },
      ],
      // We might want to proration behavior here, but default is fine
      proration_behavior: "create_prorations",
    });
  }

  verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
    const stripe = this.getStripeClient();
    try {
      stripe.webhooks.constructEvent(payload, signature, secret);
      return true;
    } catch (err) {
      console.error("[Stripe] Webhook signature verification failed:", err);
      return false;
    }
  }
}

export const stripeProvider = new StripeProvider();
