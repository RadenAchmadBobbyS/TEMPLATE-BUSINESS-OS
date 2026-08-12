import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Switch } from "@/shared/ui/switch";
import { Terminal, HardDrive, Cpu, Network } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8 max-w-6xl pb-10">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">System Settings & Logs</h2>
        <p className="text-muted-foreground mt-1">Configure global platform variables and monitor server health.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-8">
          {/* Feature Flags */}
          <Card>
            <CardHeader>
              <CardTitle>Global Feature Flags</CardTitle>
              <CardDescription>Enable or disable beta features platform-wide.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">AI Builder (Beta)</p>
                  <p className="text-sm text-muted-foreground">Allow users to generate pages with AI.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Custom Domains</p>
                  <p className="text-sm text-muted-foreground">Allow domain mapping on paid tiers.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Maintenance Mode</p>
                  <p className="text-sm text-muted-foreground">Lock platform for all non-admins.</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Infrastructure Health */}
          <Card>
            <CardHeader>
              <CardTitle>Infrastructure</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-blue-500/10"><Cpu className="h-5 w-5 text-blue-500" /></div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1 text-sm font-medium"><span>API Workers</span> <span>42%</span></div>
                  <div className="w-full bg-muted rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{ width: '42%' }}></div></div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-amber-500/10"><HardDrive className="h-5 w-5 text-amber-500" /></div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1 text-sm font-medium"><span>Database Load</span> <span>78%</span></div>
                  <div className="w-full bg-muted rounded-full h-2"><div className="bg-amber-500 h-2 rounded-full" style={{ width: '78%' }}></div></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Server Logs Simulator */}
        <Card className="flex flex-col">
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="flex items-center gap-2">
              <Terminal className="h-5 w-5" /> Live Server Logs
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 font-mono text-xs p-4 overflow-auto h-[400px] space-y-2">
            <div className="text-green-400">[INFO] Prisma Query: SELECT "id" FROM "User" LIMIT 1; - 12ms</div>
            <div className="text-green-400">[INFO] Webhook received from STRIPE: invoice.payment_succeeded</div>
            <div>[DEBUG] Flushing Redis cache for workspace_id: 8f72a...</div>
            <div className="text-yellow-400">[WARN] High latency on edge network (Region: AP-SE)</div>
            <div className="text-green-400">[INFO] Deployment worker 04 finished building snapshot.</div>
            <div>[DEBUG] Authenticating session for user: admin@businessos.app</div>
            <div className="text-green-400">[INFO] 200 OK GET /api/websites/w_123/sitemap.xml - 8ms</div>
            <div className="animate-pulse">_ Waiting for incoming requests...</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
