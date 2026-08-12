import { SubscriptionTier } from "@prisma/client";

export const STRIPE_PRICE_IDS: Record<SubscriptionTier, string | null> = {
  FREE: null, // Free tier doesn't have a Stripe price
  STARTER: process.env.STRIPE_PRICE_STARTER || "price_mock_starter",
  PRO: process.env.STRIPE_PRICE_PRO || "price_mock_pro",
  BUSINESS: process.env.STRIPE_PRICE_BUSINESS || "price_mock_business",
  ENTERPRISE: process.env.STRIPE_PRICE_ENTERPRISE || "price_mock_enterprise",
};

export function getPriceIdForTier(tier: SubscriptionTier): string | null {
  return STRIPE_PRICE_IDS[tier] || null;
}

export function getTierForPriceId(priceId: string): SubscriptionTier | null {
  for (const [tier, id] of Object.entries(STRIPE_PRICE_IDS)) {
    if (id === priceId) {
      return tier as SubscriptionTier;
    }
  }
  return null;
}
