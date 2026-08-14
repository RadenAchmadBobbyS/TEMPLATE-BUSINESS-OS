import { SubscriptionTier } from "@prisma/client";

export type PlanLimits = {
  maxWorkspaces: number;
  maxWebsites: number;
  maxPagesPerWebsite: number;
  maxStorageBytes: number;
  maxTeamMembers: number;
  maxCustomDomainsPerWebsite: number;
  hasCustomDomains: boolean;
  hasFormBuilder: boolean;
  hasAdvancedMedia: boolean;
  hasRoleBasedAccess: boolean;
  hasWhiteLabeling: boolean;
  hasAdvancedSeo: boolean;
  hasLargeStorage: boolean;
  hasDedicatedSupport: boolean;
  hasSlaSupport: boolean;
  hasCustomContracts: boolean;
  hasOnPremise: boolean;
  hasAdvancedAnalytics: boolean;
  hasBasicAnalytics: boolean;
};

export const PLAN_LIMITS: Record<SubscriptionTier, PlanLimits> = {
  FREE: {
    maxWorkspaces: 1,
    maxWebsites: 1,
    maxPagesPerWebsite: 5,
    maxStorageBytes: 100 * 1024 * 1024, // 100MB
    maxTeamMembers: 1,
    maxCustomDomainsPerWebsite: 0,
    hasCustomDomains: false,
    hasFormBuilder: false,
    hasAdvancedMedia: false,
    hasRoleBasedAccess: false,
    hasWhiteLabeling: false,
    hasAdvancedSeo: false,
    hasLargeStorage: false,
    hasDedicatedSupport: false,
    hasSlaSupport: false,
    hasCustomContracts: false,
    hasOnPremise: false,
    hasAdvancedAnalytics: false,
    hasBasicAnalytics: true,
  },
  STARTER: {
    maxWorkspaces: 3,
    maxWebsites: 3,
    maxPagesPerWebsite: 20,
    maxStorageBytes: 500 * 1024 * 1024, // 500MB
    maxTeamMembers: 3,
    maxCustomDomainsPerWebsite: 3,
    hasCustomDomains: true,
    hasFormBuilder: true,
    hasAdvancedMedia: false,
    hasRoleBasedAccess: false,
    hasWhiteLabeling: false,
    hasAdvancedSeo: false,
    hasLargeStorage: false,
    hasDedicatedSupport: false,
    hasSlaSupport: false,
    hasCustomContracts: false,
    hasOnPremise: false,
    hasAdvancedAnalytics: false,
    hasBasicAnalytics: true,
  },
  PRO: {
    maxWorkspaces: 10,
    maxWebsites: 10,
    maxPagesPerWebsite: 100,
    maxStorageBytes: 5 * 1024 * 1024 * 1024, // 5GB
    maxTeamMembers: 10,
    maxCustomDomainsPerWebsite: 10,
    hasCustomDomains: true,
    hasFormBuilder: true,
    hasAdvancedMedia: true,
    hasRoleBasedAccess: true,
    hasWhiteLabeling: true,
    hasAdvancedSeo: false,
    hasLargeStorage: false,
    hasDedicatedSupport: false,
    hasSlaSupport: false,
    hasCustomContracts: false,
    hasOnPremise: false,
    hasAdvancedAnalytics: true,
    hasBasicAnalytics: true,
  },
  BUSINESS: {
    maxWorkspaces: 50,
    maxWebsites: 50,
    maxPagesPerWebsite: 1000,
    maxStorageBytes: 50 * 1024 * 1024 * 1024, // 50GB
    maxTeamMembers: 50,
    maxCustomDomainsPerWebsite: 50,
    hasCustomDomains: true,
    hasFormBuilder: true,
    hasAdvancedMedia: true,
    hasRoleBasedAccess: true,
    hasWhiteLabeling: true,
    hasAdvancedSeo: true,
    hasLargeStorage: true,
    hasDedicatedSupport: true,
    hasSlaSupport: false,
    hasCustomContracts: false,
    hasOnPremise: false,
    hasAdvancedAnalytics: true,
    hasBasicAnalytics: true,
  },
  ENTERPRISE: {
    maxWorkspaces: 999999,
    maxWebsites: 999999,
    maxPagesPerWebsite: 999999,
    maxStorageBytes: 1024 * 1024 * 1024 * 1024, // 1TB
    maxTeamMembers: 999999,
    maxCustomDomainsPerWebsite: 999999,
    hasCustomDomains: true,
    hasFormBuilder: true,
    hasAdvancedMedia: true,
    hasRoleBasedAccess: true,
    hasWhiteLabeling: true,
    hasAdvancedSeo: true,
    hasLargeStorage: true,
    hasDedicatedSupport: true,
    hasSlaSupport: true,
    hasCustomContracts: true,
    hasOnPremise: true,
    hasAdvancedAnalytics: true,
    hasBasicAnalytics: true,
  },
};
