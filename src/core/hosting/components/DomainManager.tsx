"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Globe, ShieldCheck, ShieldAlert, Trash2, Plus, Loader2, CheckCircle2 } from "lucide-react";

import { addDomain, removeDomain, verifyDomain, setPrimaryDomain } from "@/core/hosting/actions";
import { useToast } from "@/shared/hooks/use-toast";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";

export function DomainManager({ websiteId, domains }: { websiteId: string, domains: any[] }) {
  const [hostname, setHostname] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [settingPrimaryId, setSettingPrimaryId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hostname) return;
    setIsAdding(true);
    try {
      const res = await addDomain(websiteId, hostname);
      if (res && 'success' in res && !res.success) throw new Error(res.error);
      setHostname("");
      toast({ title: "Domain added successfully." });
    } catch (error: any) {
      toast({ title: "Failed to add domain", description: error.message, variant: "destructive" });
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemove = async (id: string) => {
    if (!confirm("Are you sure you want to remove this domain? Traffic will immediately stop routing here.")) return;
    try {
      const res = await removeDomain(id);
      if (res && 'success' in res && !res.success) throw new Error(res.error);
      toast({ title: "Domain removed." });
    } catch {
      toast({ title: "Failed to remove domain", variant: "destructive" });
    }
  };

  const handleVerify = async (id: string) => {
    setVerifyingId(id);
    try {
      const res = await verifyDomain(id);
      if (res && 'success' in res && !res.success) throw new Error(res.error);
      toast({ title: "Domain verified & SSL provisioned!" });
    } catch (error: any) {
      toast({ title: "Verification failed", description: error.message || "Check your DNS records and try again.", variant: "destructive" });
    } finally {
      setVerifyingId(null);
    }
  };

  const handleSetPrimary = async (id: string) => {
    setSettingPrimaryId(id);
    try {
      const res = await setPrimaryDomain(id);
      if (res && 'success' in res && !res.success) throw new Error(res.error);
      toast({ title: "Primary domain updated." });
    } catch (error: any) {
      toast({ title: "Failed to set primary domain", description: error.message, variant: "destructive" });
    } finally {
      setSettingPrimaryId(null);
    }
  };

  // Find a domain that needs verification to show instructions
  const pendingDomain = domains.find(d => !d.isVerified);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Add Domain */}
      <div className="lg:col-span-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Add Custom Domain</CardTitle>
            <CardDescription>Connect a domain or subdomain you already own.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hostname">Domain Name</Label>
                <Input 
                  id="hostname"
                  placeholder="e.g. www.example.com" 
                  value={hostname} 
                  onChange={e => setHostname(e.target.value)} 
                  disabled={isAdding}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isAdding || !hostname}>
                {isAdding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                Add Domain
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <Card className="bg-muted/30">
          <CardContent className="p-4 space-y-4 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground flex items-center gap-2"><Globe className="h-4 w-4"/> DNS Configuration</p>
            <p>To verify your domain, add the following records to your DNS provider (e.g., GoDaddy, Cloudflare):</p>
            <div className="bg-background p-3 rounded border font-mono text-xs space-y-2">
              <div className="flex justify-between"><span>Type:</span> <span className="font-semibold text-foreground">A</span></div>
              <div className="flex justify-between"><span>Name:</span> <span className="font-semibold text-foreground">@</span></div>
              <div className="flex justify-between"><span>Value:</span> <span className="font-semibold text-foreground">76.76.21.21</span></div>
            </div>
            {pendingDomain && (
              <>
                <p className="mt-4"><strong>Verification Record:</strong> Add this TXT record to prove ownership of <strong>{pendingDomain.hostname}</strong>.</p>
                <div className="bg-background p-3 rounded border font-mono text-xs space-y-2">
                  <div className="flex justify-between"><span>Type:</span> <span className="font-semibold text-foreground">TXT</span></div>
                  <div className="flex justify-between"><span>Name:</span> <span className="font-semibold text-foreground">@</span></div>
                  <div className="flex justify-between gap-4">
                    <span>Value:</span> 
                    <span className="font-semibold text-foreground truncate" title={pendingDomain.verificationToken}>{pendingDomain.verificationToken}</span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Active Domains */}
      <div className="lg:col-span-2 space-y-4">
        {domains.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed rounded-lg bg-card">
            <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-20" />
            <h3 className="text-lg font-medium mb-1">No domains configured</h3>
            <p className="text-muted-foreground">Add a domain on the left to start routing traffic.</p>
          </div>
        ) : (
          domains.map(domain => (
            <Card key={domain.id} className="overflow-hidden">
              <div className="flex items-center justify-between p-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-xl font-bold">{domain.hostname}</h4>
                    {domain.isPrimary && (
                      <Badge variant="default" className="bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20">Primary</Badge>
                    )}
                    {domain.isVerified ? (
                      <Badge className="bg-green-500/10 text-green-600 border-green-500/20"><CheckCircle2 className="h-3 w-3 mr-1" /> Verified</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-yellow-600 border-yellow-500/20 bg-yellow-500/10">Pending Verification</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      {domain.sslStatus === 'ACTIVE' ? <ShieldCheck className="h-4 w-4 text-green-500" /> : <ShieldAlert className="h-4 w-4 text-yellow-500" />}
                      SSL: {domain.sslStatus}
                    </span>
                    <span>Added {formatDistanceToNow(new Date(domain.createdAt), { addSuffix: true })}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {domain.isVerified && !domain.isPrimary && (
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetPrimary(domain.id)}
                      disabled={settingPrimaryId === domain.id}
                    >
                      {settingPrimaryId === domain.id ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Set Primary"}
                    </Button>
                  )}
                  {!domain.isVerified && (
                    <Button 
                      variant="outline" 
                      onClick={() => handleVerify(domain.id)}
                      disabled={verifyingId === domain.id}
                    >
                      {verifyingId === domain.id ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      {verifyingId === domain.id ? "Verifying..." : "Verify DNS"}
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => handleRemove(domain.id)} className="text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
