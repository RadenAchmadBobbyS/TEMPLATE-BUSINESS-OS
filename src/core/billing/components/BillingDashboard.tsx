"use client";

import { useState } from "react";
import { formatDistanceToNow, format } from "date-fns";
import { Check, CreditCard, Download, Loader2, Sparkles, AlertCircle, RotateCcw, Reply } from "lucide-react";
import { SubscriptionTier } from "@prisma/client";

import { changeSubscriptionTier, cancelSubscription, processRefund, retryFailedInvoice } from "@/core/billing/actions";
import { useToast } from "@/shared/hooks/use-toast";

import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { CornerMarks } from "@/shared/ui/blueprint";

import { PLAN_LIMITS } from "@/core/billing/plans.config";

function getFeaturesForTier(tierId: SubscriptionTier) {
  const limits = PLAN_LIMITS[tierId];
  const features = [];
  
  if (limits.maxWebsites > 1000) features.push("Unlimited Websites");
  else features.push(`Up to ${limits.maxWebsites} Websites`);

  if (limits.hasCustomDomains) features.push("Custom Domains");
  if (limits.hasFormBuilder) features.push("Form Builder");
  if (limits.hasAdvancedMedia) features.push("Advanced Media Engine");
  if (limits.hasRoleBasedAccess) features.push("Role-based Access");
  if (limits.hasWhiteLabeling) features.push("White-labeling");
  if (limits.hasAdvancedSeo) features.push("Advanced SEO");
  if (limits.hasLargeStorage) features.push("Large Storage");
  if (limits.hasDedicatedSupport) features.push("Dedicated Account Manager");
  if (limits.hasSlaSupport) features.push("SLA Support");
  if (limits.hasCustomContracts) features.push("Custom Contracts");
  if (limits.hasOnPremise) features.push("On-premise Options");
  if (limits.hasAdvancedAnalytics) features.push("Advanced Analytics");
  else if (limits.hasBasicAnalytics) features.push("Basic Analytics");

  return features;
}

const TIERS = [
  {
    id: "FREE" as SubscriptionTier,
    name: "Free",
    price: "$0",
    description: "Perfect for exploring the platform.",
    features: getFeaturesForTier("FREE"),
    color: "bg-muted text-muted-foreground border-muted",
  },
  {
    id: "STARTER" as SubscriptionTier,
    name: "Starter",
    price: "$19",
    period: "/mo",
    description: "Essential tools for small businesses.",
    features: getFeaturesForTier("STARTER"),
    color: "bg-blue-500 text-white border-blue-500",
  },
  {
    id: "PRO" as SubscriptionTier,
    name: "Pro",
    price: "$49",
    period: "/mo",
    description: "Advanced features for growing teams.",
    features: getFeaturesForTier("PRO"),
    color: "bg-primary text-primary-foreground border-primary",
    popular: true
  },
  {
    id: "BUSINESS" as SubscriptionTier,
    name: "Business",
    price: "$99",
    period: "/mo",
    description: "For mature businesses needing scale.",
    features: getFeaturesForTier("BUSINESS"),
    color: "bg-purple-500 text-white border-purple-500",
  },
  {
    id: "ENTERPRISE" as SubscriptionTier,
    name: "Enterprise",
    price: "$299",
    period: "/mo",
    description: "Maximum power and unlimited scale.",
    features: getFeaturesForTier("ENTERPRISE"),
    color: "bg-slate-900 text-white border-slate-900",
  }
];

export function BillingDashboard({ subscription }: { subscription: any }) {
  const { toast } = useToast();
  const [loadingTier, setLoadingTier] = useState<SubscriptionTier | null>(null);
  const [isCanceling, setIsCanceling] = useState(false);
  const [processingInvoiceId, setProcessingInvoiceId] = useState<string | null>(null);

  // Localization settings
  const [gateway, setGateway] = useState("STRIPE");
  const [currency, setCurrency] = useState("USD");

  const handleUpgrade = async (tier: SubscriptionTier) => {
    setLoadingTier(tier);
    try {
      const result = await changeSubscriptionTier(tier, gateway, currency);
      if (result && result.url) {
        window.location.href = result.url;
      } else {
        toast({ title: "Plan updated successfully!", description: `Welcome to the ${tier} tier via ${gateway}.` });
      }
    } catch (error: any) {
      toast({ title: "Action failed", description: error.message, variant: "destructive" });
    } finally {
      setLoadingTier(null);
    }
  };

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel? You will lose access to premium features immediately.")) return;
    setIsCanceling(true);
    try {
      await cancelSubscription();
      toast({ title: "Subscription canceled" });
    } catch (error: any) {
      toast({ title: "Failed to cancel", variant: "destructive" });
    } finally {
      setIsCanceling(false);
    }
  };

  const handleRefund = async (invoiceId: string) => {
    setProcessingInvoiceId(invoiceId);
    try {
      await processRefund(invoiceId);
      toast({ title: "Refund Processed" });
    } catch (error: any) {
      toast({ title: "Failed to refund", description: error.message, variant: "destructive" });
    } finally {
      setProcessingInvoiceId(null);
    }
  };

  const handleRetry = async (invoiceId: string) => {
    setProcessingInvoiceId(invoiceId);
    try {
      await retryFailedInvoice(invoiceId, gateway);
      toast({ title: "Payment Retried Successfully" });
    } catch (error: any) {
      toast({ title: "Retry Failed", description: error.message, variant: "destructive" });
    } finally {
      setProcessingInvoiceId(null);
    }
  };

  const formatCurrency = (amount: number, curr: string) => {
    if (curr === "IDR") {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
    }
    if (curr === "PHP") {
      return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);
    }
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount / 100);
  };

  return (
    <div className="space-y-12 max-w-6xl">
      {/* Current Status Overview */}
      <Card className="bg-[var(--paper)] border-2 border-[var(--ink)] shadow-[4px_4px_0px_var(--ink)] rounded-none relative overflow-hidden">
        <CornerMarks />
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <CreditCard className="h-32 w-32" />
        </div>
        <CardHeader>
          <CardTitle className="font-display">Subscription Status</CardTitle>
          <CardDescription style={{ color: "var(--slate)" }}>Manage your billing and plan details</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-8">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Current Plan</p>
            <div className="flex items-center gap-3">
              <h3 className="text-3xl font-bold">{subscription.planTier}</h3>
              {subscription.status === 'ACTIVE' && <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Active</Badge>}
              {subscription.status === 'TRIALING' && <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">Trialing</Badge>}
              {subscription.status === 'CANCELED' && <Badge variant="destructive">Canceled</Badge>}
              {subscription.status === 'EXPIRED' && <Badge variant="destructive">Expired</Badge>}
              {subscription.status === 'PAST_DUE' && <Badge variant="destructive">Past Due</Badge>}
            </div>
            {subscription.gateway && (
              <p className="text-xs text-muted-foreground mt-2">Billed via {subscription.gateway}</p>
            )}
          </div>
          
          {(subscription.status === 'ACTIVE' || subscription.status === 'TRIALING') && subscription.planTier !== 'FREE' && (
            <div className="border-l pl-8">
              <p className="text-sm text-muted-foreground mb-1">Renewal Date</p>
              <p className="text-lg font-medium">
                {subscription.currentPeriodEnd ? format(new Date(subscription.currentPeriodEnd), "MMMM d, yyyy") : "N/A"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {subscription.currentPeriodEnd && `Renews in ${formatDistanceToNow(new Date(subscription.currentPeriodEnd))}`}
              </p>
            </div>
          )}
        </CardContent>
        {subscription.status === 'ACTIVE' && subscription.planTier !== 'FREE' && (
          <CardFooter className="bg-muted/30 py-3 border-t">
            <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={handleCancel} disabled={isCanceling}>
              {isCanceling ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Cancel Subscription
            </Button>
          </CardFooter>
        )}
      </Card>

      {/* Gateway Settings */}
      <div className="flex items-center gap-4 bg-muted/50 p-4 rounded-lg border">
        <CreditCard className="h-5 w-5 text-muted-foreground" />
        <div className="flex-1">
          <h4 className="font-medium text-sm">Payment Gateway Localization</h4>
          <p className="text-xs text-muted-foreground">Select your region to use local gateways (Midtrans, Xendit).</p>
        </div>
        <div className="flex gap-2">
          <Select value={gateway} onValueChange={(val: any) => setGateway(val)}>
            <SelectTrigger className="w-[140px] bg-background">
              <SelectValue placeholder="Gateway" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="STRIPE">Stripe (Global)</SelectItem>
              <SelectItem value="MIDTRANS">Midtrans (ID)</SelectItem>
              <SelectItem value="XENDIT">Xendit (SE-Asia)</SelectItem>
            </SelectContent>
          </Select>
          <Select value={currency} onValueChange={(val: any) => setCurrency(val)}>
            <SelectTrigger className="w-[100px] bg-background">
              <SelectValue placeholder="Currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD ($)</SelectItem>
              <SelectItem value="IDR">IDR (Rp)</SelectItem>
              <SelectItem value="PHP">PHP (₱)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Pricing Grid */}
      <div>
        <h3 className="text-xl font-semibold mb-6">Upgrade your Workspace</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {TIERS.map((tier) => {
            const isCurrent = subscription.planTier === tier.id && subscription.status !== 'CANCELED' && subscription.status !== 'EXPIRED';
            const isDowngrade = TIERS.findIndex(t => t.id === tier.id) < TIERS.findIndex(t => t.id === subscription.planTier);

            return (
              <Card key={tier.id} className={`relative flex flex-col rounded-none border-2 border-[var(--ink)] shadow-[4px_4px_0px_var(--ink)] bg-[var(--paper)] ${tier.popular ? 'border-[var(--signal)] shadow-[4px_4px_0px_var(--signal)] scale-[1.02]' : ''}`}>
                <CornerMarks />
                {tier.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <Badge className="bg-[var(--signal)] text-white shadow-none px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 rounded-none border-0 font-data">
                      <Sparkles className="h-3 w-3" /> Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="font-display">{tier.name}</CardTitle>
                  <CardDescription style={{ color: "var(--slate)" }}>{tier.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">
                      {currency === "IDR" ? (tier.id === "FREE" ? "Rp0" : tier.id === "STARTER" ? "Rp285K" : tier.id === "PRO" ? "Rp735K" : tier.id === "BUSINESS" ? "Rp1.5M" : "Rp4.5M") :
                       currency === "PHP" ? (tier.id === "FREE" ? "₱0" : tier.id === "STARTER" ? "₱1,045" : tier.id === "PRO" ? "₱2,695" : tier.id === "BUSINESS" ? "₱5,500" : "₱16,500") :
                       tier.price}
                    </span>
                    {tier.period && <span className="text-muted-foreground">{tier.period}</span>}
                  </div>
                  
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    variant={isCurrent ? "secondary" : tier.popular ? "default" : "outline"}
                    disabled={isCurrent || loadingTier !== null}
                    onClick={() => handleUpgrade(tier.id)}
                  >
                    {loadingTier === tier.id && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    {isCurrent ? "Current Plan" : isDowngrade ? "Downgrade" : `Upgrade via ${gateway}`}
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Invoice History */}
      <div>
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 font-display">
          <Download className="h-5 w-5" /> Invoice History
        </h3>
        <Card className="rounded-none border-2 border-[var(--ink)] shadow-[4px_4px_0px_var(--ink)] bg-[var(--paper)]">
          {subscription.invoices && subscription.invoices.length > 0 ? (
            <div className="divide-y divide-[var(--line)]">
              {subscription.invoices.map((invoice: any) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                  <div>
                    <p className="font-medium">{formatCurrency(invoice.amount, invoice.currency)}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <span>{format(new Date(invoice.createdAt), "MMM d, yyyy")}</span>
                      <span>•</span>
                      <span className="font-mono">{invoice.gatewayInvoiceId}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={invoice.status === 'PAID' ? 'default' : 'secondary'} className={invoice.status === 'PAID' ? 'bg-green-500/10 text-green-600 hover:bg-green-500/20' : invoice.status === 'FAILED' ? 'bg-red-500/10 text-red-600' : ''}>
                      {invoice.status}
                    </Badge>
                    
                    {/* Features not supported by gateway: Refund and Retry */}

                    <Button variant="ghost" size="sm" asChild>
                      <a href={invoice.pdfUrl} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-2" /> PDF
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-muted-foreground">
              <AlertCircle className="h-8 w-8 mx-auto mb-3 opacity-20" />
              <p>No invoices found.</p>
              <p className="text-sm">Upgrades will generate receipts here.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
