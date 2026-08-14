import { getAllSubscriptions, getRecentInvoices } from "@/core/admin/actions";
import { format } from "date-fns";
import { CreditCard, Download, Activity, FileText } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

export default async function AdminBillingPage() {
  const [subscriptions, invoices] = await Promise.all([
    getAllSubscriptions(),
    getRecentInvoices()
  ]);

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
  };

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Billing & Revenue</h2>
        <p className="text-muted-foreground mt-1">Platform-wide subscription monitoring and invoice history.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Subscriptions */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><Activity className="h-5 w-5" /> Active Subscriptions</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto max-h-[600px] p-0">
            <div className="divide-y">
              {subscriptions.map(sub => (
                <div key={sub.id} className="p-4 flex items-center justify-between hover:bg-muted/30">
                  <div>
                    <p className="font-medium">{sub.user.name || sub.user.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{sub.planTier}</Badge>
                      <span className="text-xs text-muted-foreground">via {sub.gateway}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={sub.status === 'ACTIVE' ? 'default' : 'secondary'} className={sub.status === 'ACTIVE' ? 'bg-green-500/10 text-green-600' : ''}>
                      {sub.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Invoices */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><FileText className="h-5 w-5" /> Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto max-h-[600px] p-0">
            <div className="divide-y">
              {invoices.map(inv => (
                <div key={inv.id} className="p-4 flex items-center justify-between hover:bg-muted/30">
                  <div>
                    <p className="font-medium text-green-600 dark:text-green-400">+{formatCurrency(inv.amount)}</p>
                    <p className="text-xs text-muted-foreground mt-1">{inv.subscription.user.name || inv.subscription.user.email}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className={inv.status === 'PAID' ? 'border-green-500 text-green-600' : 'border-red-500 text-red-600'}>
                      {inv.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1 font-mono">{format(new Date(inv.createdAt), "MMM d")}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
