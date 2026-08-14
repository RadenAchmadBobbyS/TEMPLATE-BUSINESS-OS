import { prisma } from '@/shared/lib/prisma';
import { PLAN_LIMITS, PlanLimits } from './plans.config';
import { SubscriptionTier, SubscriptionStatus } from '@prisma/client';

export async function getWorkspacePlan(workspaceId: string): Promise<{
  tier: SubscriptionTier;
  limits: PlanLimits;
  isActive: boolean;
}> {
  const role = await prisma.userRole.findFirst({
    where: { workspaceId, role: 'OWNER' },
    include: { user: { include: { subscription: true } } }
  });

  const subscription = role?.user?.subscription;

  // Default to FREE if no active subscription or if it's canceled/expired without grace period
  let tier: SubscriptionTier = 'FREE';
  let isActive = true;

  if (subscription) {
    if (
      subscription.status === 'ACTIVE' ||
      subscription.status === 'TRIALING' ||
      (subscription.status === 'CANCELED' &&
        subscription.currentPeriodEnd &&
        subscription.currentPeriodEnd > new Date())
    ) {
      tier = subscription.planTier;
    } else if (subscription.status === 'PAST_DUE') {
      // Depending on business rules, PAST_DUE might restrict access or keep it active temporarily.
      // We'll restrict them to FREE limits or keep it active but warn.
      // For now, let's downgrade them logically to FREE until they pay.
      tier = 'FREE';
      isActive = false;
    } else {
      tier = 'FREE';
      isActive = false;
    }
  }

  return {
    tier,
    limits: PLAN_LIMITS[tier],
    isActive,
  };
}

export function getPlanLimits(tier: SubscriptionTier): PlanLimits {
  return PLAN_LIMITS[tier];
}

export async function getWebsiteQuotaUsage(
  workspaceId: string,
): Promise<{ limit: number; used: number; remaining: number }> {
  const plan = await getWorkspacePlan(workspaceId);
  const used = await prisma.website.count({
    where: { workspaceId },
  });

  return {
    limit: plan.limits.maxWebsites,
    used,
    remaining: plan.limits.maxWebsites - used,
  };
}

export async function assertWebsiteQuotaAvailable(
  workspaceId: string,
  requestedCount: number = 1,
): Promise<{ limit: number; used: number; remaining: number }> {
  const quota = await getWebsiteQuotaUsage(workspaceId);

  if (quota.used + requestedCount > quota.limit) {
    throw new Error('Website limit reached. Archived websites still count toward your plan limit.');
  }

  return quota;
}

export async function getRemainingQuota(
  workspaceId: string,
  resource: 'websites' | 'pages' | 'storage' | 'team_members',
): Promise<{ limit: number; used: number; remaining: number }> {
  const plan = await getWorkspacePlan(workspaceId);
  const limits = plan.limits;

  if (resource === 'websites') {
    return getWebsiteQuotaUsage(workspaceId).then((quota) => ({
      limit: limits.maxWebsites,
      used: quota.used,
      remaining: quota.remaining,
    }));
  }

  if (resource === 'team_members') {
    const used = await prisma.userRole.count({
      where: { workspaceId },
    });
    return { limit: limits.maxTeamMembers, used, remaining: limits.maxTeamMembers - used };
  }

  // To check pages, we might need a specific website ID, but if it's a global count across the workspace:
  // Usually limits are per website as defined `maxPagesPerWebsite`, but the requirement can vary.
  // We'll just return 0 for undefined global checks here and implement specific checks where needed.
  return { limit: 0, used: 0, remaining: 0 };
}

export async function canUseFeature(
  workspaceId: string,
  feature: keyof PlanLimits,
): Promise<boolean> {
  const plan = await getWorkspacePlan(workspaceId);

  const value = plan.limits[feature];
  if (typeof value === 'boolean') {
    return value;
  }

  return true; // For numeric limits, we need `getRemainingQuota` instead.
}

export async function requireFeature(workspaceId: string, feature: keyof PlanLimits) {
  const allowed = await canUseFeature(workspaceId, feature);
  if (!allowed) {
    throw new Error(
      `Your current plan does not include access to ${feature}. Please upgrade your plan.`,
    );
  }
}

export async function requireQuota(
  workspaceId: string,
  resource: 'websites' | 'pages' | 'storage' | 'team_members',
) {
  const quota = await getRemainingQuota(workspaceId, resource);
  if (resource === 'websites' && quota.remaining <= 0) {
    throw new Error('Website limit reached. Archived websites still count toward your plan limit.');
  }

  if (quota.remaining <= 0) {
    throw new Error(
      `You have reached the maximum allowed limit for ${resource} on your current plan. Please upgrade to increase your limit.`,
    );
  }
}

export async function hasTemplateAccess(
  workspaceId: string,
  requiredTier: SubscriptionTier,
): Promise<boolean> {
  const plan = await getWorkspacePlan(workspaceId);
  const tiers: SubscriptionTier[] = ['FREE', 'STARTER', 'PRO', 'BUSINESS', 'ENTERPRISE'];

  const userTierIndex = tiers.indexOf(plan.tier);
  const requiredTierIndex = tiers.indexOf(requiredTier);

  return userTierIndex >= requiredTierIndex;
}
