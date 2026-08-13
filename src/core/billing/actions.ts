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

import { requireActiveWorkspace, checkWorkspacePermission } from '@/core/workspaces/server-context';

async function getWorkspaceAccess() {
  const { workspace, role } = await requireActiveWorkspace();
  checkWorkspacePermission(role, 'ADMIN'); // This will check OWNER or ADMIN

  return workspace.id;
}

export async function getSubscriptionData() {
  const workspaceId = await getWorkspaceAccess();

  const subscription = await prisma.subscription.findUnique({
    where: { workspaceId },
    include: {
      invoices: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  // If no subscription exists, initialize a FREE tier.
  if (!subscription) {
    const newSub = await prisma.subscription.create({
      data: {
        workspaceId,
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
  const workspaceId = await getWorkspaceAccess();

  const currentSub = await prisma.subscription.findUnique({ where: { workspaceId } });
  if (!currentSub) throw new Error('Subscription not found');

  const currentRank = TIER_RANK[currentSub.planTier];
  const newRank = TIER_RANK[tier];

  // If downgrading, verify usage limits
  if (newRank < currentRank) {
    const websitesUsage = await getRemainingQuota(workspaceId, 'websites');
    const targetLimits = PLAN_LIMITS[tier];

    if (websitesUsage.used > targetLimits.maxWebsites) {
      throw new Error(
        `Cannot downgrade: You have ${websitesUsage.used} websites, but ${tier} only allows ${targetLimits.maxWebsites}. Archived websites still count toward your plan limit.`,
      );
    }

    const teamUsage = await getRemainingQuota(workspaceId, 'team_members');
    if (teamUsage.used > targetLimits.maxTeamMembers) {
      throw new Error(
        `Cannot downgrade: You have ${teamUsage.used} team members, but ${tier} only allows ${targetLimits.maxTeamMembers}. Please remove some team members first.`,
      );
    }
  }

  const provider = getProvider(gateway);

  try {
    const result = await provider.createCheckoutSession({
      workspaceId,
      tier,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/billing?success=true`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/billing?canceled=true`,
    });
    return { url: result.url };
  } catch (error: any) {
    console.error(`[Billing] Failed to create checkout session with ${gateway}:`, error);
    throw new Error(
      error.message || `The payment gateway ${gateway} is currently unavailable or misconfigured.`,
    );
  }
}

export async function cancelSubscription() {
  const workspaceId = await getWorkspaceAccess();

  const currentSub = await prisma.subscription.findUnique({ where: { workspaceId } });
  if (!currentSub) throw new Error('Subscription not found');

  // State Machine Validation
  if (currentSub.status === 'CANCELED' || currentSub.status === 'EXPIRED') {
    throw new Error('Subscription is already canceled or expired');
  }

  // Tell Provider
  if (currentSub.gatewaySubId) {
    await stripeProvider.cancelSubscription(currentSub.gatewaySubId);
  } else {
    // If it's a mock or free tier
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  const updated = await prisma.subscription.update({
    where: { workspaceId },
    data: {
      status: 'CANCELED',
      cancelAtPeriodEnd: true, // Data remains accessible until period end
    },
  });

  revalidatePath('/dashboard/billing');
  return updated;
}

export async function retryFailedInvoice(invoiceId: string, gateway: string = 'STRIPE') {
  const workspaceId = await getWorkspaceAccess();

  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { subscription: true },
  });
  if (!invoice) throw new Error('Invoice not found');
  if (invoice.subscription.workspaceId !== workspaceId) throw new Error('Unauthorized');

  // Record a mock transaction success for now
  await prisma.transaction.create({
    data: {
      invoiceId: invoice.id,
      gateway,
      gatewayTxId: `mock_retry_${gateway.toLowerCase()}_tx_${Date.now()}`,
      amount: invoice.amount,
      currency: invoice.currency,
      status: 'SUCCESS',
    },
  });

  const updated = await prisma.invoice.update({
    where: { id: invoiceId },
    data: { status: 'PAID' },
  });

  // State Machine: Update sub from PAST_DUE -> ACTIVE
  if (invoice.subscription.status === 'PAST_DUE') {
    await prisma.subscription.update({
      where: { id: invoice.subscriptionId },
      data: { status: 'ACTIVE' },
    });
  }

  revalidatePath('/dashboard/billing');
  return updated;
}

export async function processRefund(invoiceId: string) {
  const workspaceId = await getWorkspaceAccess();

  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: {
      transactions: { where: { status: 'SUCCESS' } },
      subscription: true,
    },
  });
  if (!invoice) throw new Error('Invoice not found');
  if (invoice.subscription.workspaceId !== workspaceId) throw new Error('Unauthorized');

  const tx = invoice.transactions[0];

  if (tx) {
    await prisma.transaction.create({
      data: {
        invoiceId: invoice.id,
        gateway: tx.gateway,
        gatewayTxId: `mock_refund_${tx.gateway.toLowerCase()}_tx_${Date.now()}`,
        amount: invoice.amount,
        currency: invoice.currency,
        status: 'REFUNDED',
      },
    });
  }

  const updated = await prisma.invoice.update({
    where: { id: invoiceId },
    data: { status: 'REFUNDED' },
  });

  revalidatePath('/dashboard/billing');
  return updated;
}
