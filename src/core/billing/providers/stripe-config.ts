import { SubscriptionTier } from "@prisma/client";

export const STRIPE_PRICE_IDS: Record<SubscriptionTier, string | null> = {
  FREE: null, // Free tier doesn't have a Stripe price
  STARTER: process.env.STRIPE_PRICE_STARTER || null,
  PRO: process.env.STRIPE_PRICE_PRO || null,
  BUSINESS: process.env.STRIPE_PRICE_BUSINESS || null,
  ENTERPRISE: process.env.STRIPE_PRICE_ENTERPRISE || null,
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
