import { getPlatformMetrics } from "@/core/admin/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Users, Globe, CreditCard, Activity } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/shared/ui/motion";

export default async function AdminDashboard() {
  const metrics = await getPlatformMetrics();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount / 100);
  };

  return (
    <StaggerContainer className="space-y-8 max-w-6xl">
      <StaggerItem>
        <h2 className="text-3xl font-bold tracking-tight font-display">Platform Overview</h2>
        <p className="text-muted-foreground mt-1">Real-time metrics for the entire BusinessOS ecosystem.</p>
      </StaggerItem>

      <StaggerItem className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Intl.NumberFormat().format(metrics.users.total)}</div>
            <p className="text-xs text-muted-foreground mt-1">{new Intl.NumberFormat().format(metrics.users.active)} active</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workspaces</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Intl.NumberFormat().format(metrics.workspaces.total)}</div>
            <p className="text-xs text-muted-foreground mt-1">{new Intl.NumberFormat().format(metrics.workspaces.active)} active</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Websites</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Intl.NumberFormat().format(metrics.websites.total)}</div>
            <p className="text-xs text-muted-foreground mt-1">{new Intl.NumberFormat().format(metrics.websites.published)} published</p>
          </CardContent>
        </Card>

        <Card className="border-green-500/20 bg-green-500/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-400">Active Subscriptions</CardTitle>
            <Activity className="h-4 w-4 text-green-700 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700 dark:text-green-400">{new Intl.NumberFormat().format(metrics.billing.active)}</div>
            <p className="text-xs text-green-600/80 mt-1">{new Intl.NumberFormat().format(metrics.billing.canceled)} canceled</p>
          </CardContent>
        </Card>
      </StaggerItem>
    </StaggerContainer>
  );
}
