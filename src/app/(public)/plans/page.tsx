import { PLAN_LIMITS } from "@/core/billing/plans.config";
import { PageHeader, GridBackdrop } from "@/shared/ui/blueprint";
import { Reveal, StaggerContainer, StaggerItem } from "@/shared/ui/motion";
import { Button } from "@/shared/ui/button";
import { Check, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import { SubscriptionTier } from "@prisma/client";

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(0)) + ' ' + sizes[i];
};

const formatLimit = (limit: number) => {
  if (limit >= 999999) return "Unlimited";
  return limit.toLocaleString();
};

export default function PlansPage() {
  const tiers: { id: SubscriptionTier; name: string; price: string; description: string }[] = [
    { id: "FREE", name: "Free", price: "$0", description: "Perfect for personal projects and exploring the platform." },
    { id: "STARTER", name: "Starter", price: "$15", description: "For freelancers and small websites with custom domains." },
    { id: "PRO", name: "Pro", price: "$49", description: "For growing businesses needing advanced features and limits." },
    { id: "BUSINESS", name: "Business", price: "$199", description: "For agencies and large scale operations." },
  ];

  return (
    <div className="py-20 sm:py-28 relative">
      <GridBackdrop className="opacity-20" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <Reveal>
          <PageHeader
            eyebrow="PRICING"
            title="Plans that scale with you"
            description="Transparent pricing based on the features and scale you need. No hidden fees."
          />
        </Reveal>

        <StaggerContainer className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier) => {
            const limits = PLAN_LIMITS[tier.id];
            const isPopular = tier.id === "PRO";

            return (
              <StaggerItem
                key={tier.id}
                className={`relative flex flex-col border p-6 bg-paper ${
                  isPopular ? "border-signal ring-1 ring-signal shadow-lg" : "border-line"
                }`}
              >
                {isPopular && (
                  <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                    <span className="bg-signal text-white text-[10px] font-data px-2 py-1 font-bold">MOST POPULAR</span>
                  </div>
                )}
                
                <h3 className="font-display text-xl font-bold">{tier.name}</h3>
                <div className="mt-4 mb-2 flex items-baseline text-4xl font-extrabold">
                  {tier.price}
                  <span className="ml-1 text-sm font-medium text-muted-foreground">/mo</span>
                </div>
                <p className="text-sm text-muted-foreground min-h-[40px] mb-6">
                  {tier.description}
                </p>
                
                <Button 
                  asChild 
                  variant={isPopular ? "default" : "outline"} 
                  className={`w-full mb-8 ${isPopular ? "bg-signal hover:bg-signal/90 text-white" : ""}`}
                >
                  <Link href="/register">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>

                <div className="flex flex-col gap-4 flex-1">
                  <div className="font-data text-xs text-muted-foreground uppercase border-b pb-2 mb-2">Usage Limits</div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Websites</span>
                    <span className="font-medium">{formatLimit(limits.maxWebsites)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Pages / Site</span>
                    <span className="font-medium">{formatLimit(limits.maxPagesPerWebsite)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Storage</span>
                    <span className="font-medium">{formatBytes(limits.maxStorageBytes)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Team Members</span>
                    <span className="font-medium">{formatLimit(limits.maxTeamMembers)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Custom Domains</span>
                    <span className="font-medium">{formatLimit(limits.maxCustomDomainsPerWebsite)}</span>
                  </div>

                  <div className="font-data text-xs text-muted-foreground uppercase border-b pb-2 mt-4 mb-2">Features</div>

                  <FeatureItem label="Custom Domains" included={limits.hasCustomDomains} />
                  <FeatureItem label="Form Builder" included={limits.hasFormBuilder} />
                  <FeatureItem label="Advanced Media" included={limits.hasAdvancedMedia} />
                  <FeatureItem label="Role Based Access" included={limits.hasRoleBasedAccess} />
                  <FeatureItem label="Advanced SEO" included={limits.hasAdvancedSeo} />
                  <FeatureItem label="Advanced Analytics" included={limits.hasAdvancedAnalytics} />
                  <FeatureItem label="White Labeling" included={limits.hasWhiteLabeling} />
                  
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </div>
  );
}

function FeatureItem({ label, included }: { label: string; included: boolean }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      {included ? (
        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-signal/10 text-signal">
          <Check className="h-3.5 w-3.5" />
        </div>
      ) : (
        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground/50">
          <X className="h-3.5 w-3.5" />
        </div>
      )}
      <span className={included ? "text-foreground" : "text-muted-foreground line-through"}>
        {label}
      </span>
    </div>
  );
}
