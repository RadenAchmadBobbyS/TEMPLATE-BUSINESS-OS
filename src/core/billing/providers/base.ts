import { SubscriptionTier } from "@prisma/client";

export interface CreateCheckoutSessionParams {
  userId: string;
  tier: SubscriptionTier;
  successUrl: string;
  cancelUrl: string;
}

export interface PaymentProvider {
  createCheckoutSession(params: CreateCheckoutSessionParams): Promise<{ url: string }>;
  createCustomer(userId: string, email: string, name: string): Promise<string>;
  cancelSubscription(subscriptionId: string): Promise<void>;
  changeSubscription(subscriptionId: string, newTier: SubscriptionTier): Promise<void>;
  verifyWebhookSignature(payload: string, signature: string, secret: string): boolean;
}
