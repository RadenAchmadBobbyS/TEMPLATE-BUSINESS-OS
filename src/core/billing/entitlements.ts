import { prisma } from '@/shared/lib/prisma';
import { PLAN_LIMITS, PlanLimits } from './plans.config';
import { SubscriptionTier, SubscriptionStatus } from '@prisma/client';

export async function getWorkspacePlan(workspaceId: string): Promise<{
  tier: SubscriptionTier;
  limits: PlanLimits;
  isActive: boolean;
}> {
  const subscription = await prisma.subscription.findUnique({
    where: { workspaceId },
  });

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

export async function getRemainingQuota(
  workspaceId: string,
  resource: 'websites' | 'pages' | 'storage' | 'team_members',
): Promise<{ limit: number; used: number; remaining: number }> {
  const plan = await getWorkspacePlan(workspaceId);
  const limits = plan.limits;

  if (resource === 'websites') {
    const used = await prisma.website.count({
      where: { workspaceId, deletedAt: null },
    });
    return { limit: limits.maxWebsites, used, remaining: limits.maxWebsites - used };
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
