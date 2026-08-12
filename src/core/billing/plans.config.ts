import { SubscriptionTier } from "@prisma/client";

export type PlanLimits = {
  maxWebsites: number;
  maxPagesPerWebsite: number;
  maxStorageBytes: number;
  maxTeamMembers: number;
  maxCustomDomainsPerWebsite: number;
  hasAdvancedSeo: boolean;
  hasWhiteLabeling: boolean;
};

export const PLAN_LIMITS: Record<SubscriptionTier, PlanLimits> = {
  FREE: {
    maxWebsites: 1,
    maxPagesPerWebsite: 5,
    maxStorageBytes: 100 * 1024 * 1024, // 100MB
    maxTeamMembers: 1,
    maxCustomDomainsPerWebsite: 1,
    hasAdvancedSeo: false,
    hasWhiteLabeling: false,
  },
  STARTER: {
    maxWebsites: 3,
    maxPagesPerWebsite: 20,
    maxStorageBytes: 500 * 1024 * 1024, // 500MB
    maxTeamMembers: 3,
    maxCustomDomainsPerWebsite: 3,
    hasAdvancedSeo: true,
    hasWhiteLabeling: false,
  },
  PRO: {
    maxWebsites: 10,
    maxPagesPerWebsite: 100,
    maxStorageBytes: 5 * 1024 * 1024 * 1024, // 5GB
    maxTeamMembers: 10,
    maxCustomDomainsPerWebsite: 10,
    hasAdvancedSeo: true,
    hasWhiteLabeling: true,
  },
  BUSINESS: {
    maxWebsites: 50,
    maxPagesPerWebsite: 1000,
    maxStorageBytes: 50 * 1024 * 1024 * 1024, // 50GB
    maxTeamMembers: 50,
    maxCustomDomainsPerWebsite: 50,
    hasAdvancedSeo: true,
    hasWhiteLabeling: true,
  },
  ENTERPRISE: {
    maxWebsites: 999999,
    maxPagesPerWebsite: 999999,
    maxStorageBytes: 1024 * 1024 * 1024 * 1024, // 1TB
    maxTeamMembers: 999999,
    maxCustomDomainsPerWebsite: 999999,
    hasAdvancedSeo: true,
    hasWhiteLabeling: true,
  },
};
