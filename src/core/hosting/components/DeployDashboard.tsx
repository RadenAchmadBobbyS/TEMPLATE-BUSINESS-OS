"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Server, Globe, Rocket, History, RefreshCcw, Loader2, AlertCircle } from "lucide-react";

import { deployWebsite, rollbackWebsite, clearCache } from "@/core/hosting/actions";
import { useToast } from "@/shared/hooks/use-toast";

import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";

export function DeployDashboard({ website, deployments }: { website: any, deployments: any[] }) {
  const [isDeploying, setIsDeploying] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [rollingBackId, setRollingBackId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDeploy = async () => {
    setIsDeploying(true);
    try {
      const result = await deployWebsite(website.id);
      if (result && 'success' in result && !result.success) {
        toast({ title: "Deployment failed", description: result.error, variant: "destructive" });
      } else {
        toast({ title: "Deployment successful!", description: "Your site is now live on the edge network." });
      }
    } catch (error: any) {
      toast({ title: "Deployment failed", description: error.message, variant: "destructive" });
    } finally {
      setIsDeploying(false);
    }
  };

  const handleClearCache = async () => {
    setIsClearing(true);
    try {
      const res = await clearCache(website.id);
      if (res && 'success' in res && !res.success) throw new Error(res.error);
      toast({ title: "Cache Cleared", description: "Edge nodes have been invalidated." });
    } catch (error: any) {
      toast({ title: "Failed to clear cache", description: error.message, variant: "destructive" });
    } finally {
      setIsClearing(false);
    }
  };

  const handleRollback = async (deploymentId: string, version: number) => {
    if (!confirm(`Are you sure you want to rollback to v${version}? This will overwrite the live site.`)) return;

    setRollingBackId(deploymentId);
    try {
      const res = await rollbackWebsite(website.id, deploymentId);
      if (res && 'success' in res && !res.success) throw new Error(res.error);
      toast({ title: "Rollback successful!", description: `Website restored to v${version}.` });
    } catch (error: any) {
      toast({ title: "Rollback failed", description: error.message, variant: "destructive" });
    } finally {
      setRollingBackId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Status & Actions */}
      <div className="lg:col-span-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Production Status</CardTitle>
            <CardDescription>Current state of your website</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
              <div className="flex items-center gap-3">
                <div className={`h-3 w-3 rounded-full ${website.status === 'PUBLISHED' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
                <span className="font-medium">{website.status === 'PUBLISHED' ? 'Live on Edge' : 'Draft Mode'}</span>
              </div>
              <Badge variant={website.status === 'PUBLISHED' ? 'default' : 'secondary'}>
                {website.status}
              </Badge>
            </div>

            <div className="space-y-3">
              <Button className="w-full relative overflow-hidden" size="lg" onClick={handleDeploy} disabled={isDeploying || isClearing || rollingBackId !== null}>
                {isDeploying ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Rocket className="mr-2 h-5 w-5" />}
                {isDeploying ? "Deploying to Edge..." : "Deploy to Production"}
              </Button>

              <Button variant="outline" className="w-full" onClick={handleClearCache} disabled={isClearing || isDeploying}>
                {isClearing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCcw className="mr-2 h-4 w-4" />}
                Clear CDN Cache
              </Button>
            </div>

            <div className="text-xs text-muted-foreground bg-blue-500/10 text-blue-600 p-3 rounded flex gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p>Deploying packages your database state into a JSON snapshot and pushes it to our global edge network.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Version History */}
      <div className="lg:col-span-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><History className="h-5 w-5" /> Version History & Rollbacks</CardTitle>
            <CardDescription>View past deployments and instantly rollback if something breaks.</CardDescription>
          </CardHeader>
          <CardContent>
            {deployments.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <Server className="h-10 w-10 mx-auto text-muted-foreground mb-3 opacity-20" />
                <p className="text-muted-foreground">No deployments yet.</p>
                <p className="text-sm">Click Deploy to Production to create your first version.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {deployments.map((dep, index) => (
                  <div key={dep.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="font-mono bg-background">v{dep.version}</Badge>
                        <span className="font-medium text-sm">
                          {dep.status === "ROLLBACK" ? "Rolled Back Version" : "Production Deploy"}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2 mt-2">
                        <span>{formatDistanceToNow(new Date(dep.createdAt), { addSuffix: true })}</span>
                        <span>•</span>
                        <span>{dep.duration}ms</span>
                        <span>•</span>
                        <span className={dep.status === "SUCCESS" ? "text-green-500" : "text-yellow-600"}>{dep.status}</span>
                      </div>
                    </div>
                    
                    {index !== 0 && (
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={() => handleRollback(dep.id, dep.version)}
                        disabled={rollingBackId !== null}
                      >
                        {rollingBackId === dep.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Rollback to this"}
                      </Button>
                    )}
                    {index === 0 && (
                      <Badge className="bg-primary/10 text-primary border-primary/20 pointer-events-none">Current Active</Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
