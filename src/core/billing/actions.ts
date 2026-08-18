'use server';

import { prisma } from '@/shared/lib/prisma';
import { auth } from '@/core/auth/auth';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { SubscriptionTier, SubscriptionStatus } from '@prisma/client';
import { stripeProvider } from './providers/stripe';
import { midtransProvider } from './providers/midtrans';
import { xenditProvider } from './providers/xendit';
import { getRemainingQuota } from './entitlements';
import { PLAN_LIMITS } from './plans.config';

import { requireActiveWorkspace, requireActiveWorkspaceAction, checkWorkspacePermission } from '@/core/workspaces/server-context';

async function getWorkspaceAccess(requiredRole: "OWNER" | "ADMIN" | "EDITOR" = "ADMIN") {
  const active = await requireActiveWorkspaceAction();
  if (!active.success) return { success: false, error: active.error };
  const { workspace, role, ownerId } = active;
  checkWorkspacePermission(role, requiredRole);

  if (!ownerId) throw new Error('Workspace has no owner');
  return { workspaceId: workspace.id, ownerId };
}

export async function getSubscriptionData() {
  const access = await getWorkspaceAccess('OWNER');
  if ('error' in access) throw new Error(access.error as string);
  const { ownerId } = access;

  let subscription = await prisma.subscription.findUnique({
    where: { userId: ownerId },
    include: {
      invoices: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  // Dynamically mark manual renewals as EXPIRED if currentPeriodEnd has passed
  if (subscription && subscription.currentPeriodEnd) {
    if (subscription.currentPeriodEnd < new Date() && (subscription.status === 'ACTIVE' || subscription.status === 'PAST_DUE')) {
      subscription = await prisma.subscription.update({
        where: { id: subscription.id },
        data: { status: 'EXPIRED' },
        include: { invoices: { orderBy: { createdAt: 'desc' } } },
      });
    }
  }

  // If no subscription exists, initialize a FREE tier.
  if (!subscription) {
    const newSub = await prisma.subscription.create({
      data: {
        userId: ownerId,
        planTier: 'FREE',
        status: 'ACTIVE',
      },
      include: { invoices: true },
    });
    return newSub;
  }

  return subscription;
}

const TIER_RANK = {
  FREE: 0,
  STARTER: 1,
  PRO: 2,
  BUSINESS: 3,
  ENTERPRISE: 4,
};

function getProvider(gateway: string) {
  switch (gateway.toUpperCase()) {
    case 'STRIPE':
      return stripeProvider;
    case 'MIDTRANS':
      return midtransProvider;
    case 'XENDIT':
      return xenditProvider;
    default:
      return stripeProvider;
  }
}

export async function changeSubscriptionTier(
  tier: SubscriptionTier,
  gateway: string = 'STRIPE',
  currency: string = 'USD',
) {
  const access = await getWorkspaceAccess('OWNER');
  if ('error' in access) return { success: false, error: access.error as string };
  const { workspaceId, ownerId } = access;

  const currentSub = await prisma.subscription.findUnique({ where: { userId: ownerId } });
  if (!currentSub) return { success: false, error: 'Subscription not found' };

  const currentRank = TIER_RANK[currentSub.planTier];
  const newRank = TIER_RANK[tier];

  // If downgrading, verify usage limits
  if (newRank < currentRank) {
    const websitesUsage = await getRemainingQuota(workspaceId, 'websites');
    const targetLimits = PLAN_LIMITS[tier];

    if (websitesUsage.used > targetLimits.maxWebsites) {
      return { success: false, error: `Cannot downgrade: You have ${websitesUsage.used} websites, but ${tier} only allows ${targetLimits.maxWebsites}. Archived websites still count toward your plan limit.` };
    }

    const teamUsage = await getRemainingQuota(workspaceId, 'team_members');
    if (teamUsage.used > targetLimits.maxTeamMembers) {
      return { success: false, error: `Cannot downgrade: You have ${teamUsage.used} team members, but ${tier} only allows ${targetLimits.maxTeamMembers}. Please remove some team members first.` };
    }
  }

  const provider = getProvider(gateway);

  try {
    const result = await provider.createCheckoutSession({
      userId: ownerId,
      tier,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/billing?success=true`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/billing?canceled=true`,
    });
    return { success: true, url: result.url };
  } catch (error: any) {
    console.error(`[Billing] Failed to create checkout session with ${gateway}:`, error);
    return { success: false, error: error.message || `The payment gateway ${gateway} is currently unavailable or misconfigured.` };
  }
}

export async function cancelSubscription() {
  const access = await getWorkspaceAccess('OWNER');
  if ('error' in access) return { success: false, error: access.error as string };
  const { ownerId } = access;

  const currentSub = await prisma.subscription.findUnique({ where: { userId: ownerId } });
  if (!currentSub) return { success: false, error: 'Subscription not found' };

  // State Machine Validation
  if (currentSub.status === 'CANCELED' || currentSub.status === 'EXPIRED') {
    return { success: false, error: 'Subscription is already canceled or expired' };
  }

  // Tell Provider
  if (currentSub.gatewaySubId) {
    if (currentSub.gateway === 'STRIPE') {
      await stripeProvider.cancelSubscription(currentSub.gatewaySubId);
    } else if (currentSub.gateway === 'MIDTRANS') {
      await midtransProvider.cancelSubscription(currentSub.gatewaySubId);
    } else if (currentSub.gateway === 'XENDIT') {
      await xenditProvider.cancelSubscription(currentSub.gatewaySubId);
    } else {
      console.warn(`[Billing] Unknown gateway ${currentSub.gateway} for sub ${currentSub.id}`);
    }
  } else {
    // If it's a mock or free tier
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  const updated = await prisma.subscription.update({
    where: { userId: ownerId },
    data: {
      status: 'CANCELED',
      cancelAtPeriodEnd: true, // Data remains accessible until period end
    },
  });

  revalidatePath('/dashboard/billing');
  return { success: true, updated };
}

export async function retryFailedInvoice(invoiceId: string, gateway: string = 'STRIPE') {
  return { success: false, error: "Retrying invoices is not supported by your payment gateway. Please update your payment method or create a new subscription." };
}

export async function processRefund(invoiceId: string) {
  return { success: false, error: "Refunding invoices is not supported directly from the dashboard. Please contact support." };
}
