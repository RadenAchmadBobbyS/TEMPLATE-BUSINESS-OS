"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { 
  BarChart3, Users, Activity, MousePointerClick, Globe, 
  MonitorSmartphone, Link as LinkIcon, FileText, Target, 
  Trash2, Plus, Download, RefreshCw, LayoutTemplate, Share2
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Progress } from "@/shared/ui/progress";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { useToast } from "@/shared/hooks/use-toast";
import { CornerMarks } from "@/shared/ui/blueprint";
import { FadeIn, StaggerContainer, StaggerItem } from "@/shared/ui/motion";

import { 
  createAnalyticsGoal, deleteAnalyticsGoal, 
  createAnalyticsFunnel, deleteAnalyticsFunnel,
  getRealtimeAnalytics, exportAnalyticsCsv, getFunnelStats
} from "@/core/analytics/actions";

// --- Shared Components ---

function MetricCard({ title, value, icon: Icon, trend }: any) {
  return (
    <Card className="relative rounded-none border-2 border-[var(--ink)] shadow-[4px_4px_0px_var(--ink)] transition-transform hover:-translate-y-1">
      <CornerMarks />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-[10px] font-semibold uppercase tracking-wider font-data" style={{ color: "var(--slate)" }}>{title}</CardTitle>
        <Icon className="h-4 w-4" style={{ color: "var(--signal)" }} />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold font-display" style={{ color: "var(--ink)" }}>{value}</div>
        {trend !== undefined && (
          <p className="text-[10px] font-medium uppercase tracking-wider mt-2 flex items-center gap-2 font-data">
            <span className={trend > 0 ? "text-green-500" : "text-red-500"}>
              {trend > 0 ? "+" : ""}{trend}%
            </span>
            <span style={{ color: "var(--slate)" }}>from previous period</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function BreakdownList({ title, icon: Icon, data, showAll = false }: any) {
  const entries = Object.entries(data).sort(([,a], [,b]) => (b as number) - (a as number));
  const displayEntries = showAll ? entries : entries.slice(0, 10);
  const total = entries.reduce((acc, [,val]) => acc + (val as number), 0);

  return (
    <Card className="flex flex-col h-full rounded-none border-2 border-[var(--ink)] shadow-[4px_4px_0px_var(--ink)] relative">
      <CornerMarks />
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2 font-bold font-display"><Icon className="h-4 w-4" /> {title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        {displayEntries.length === 0 && <div className="text-[var(--slate)] text-sm">No data</div>}
        {displayEntries.map(([key, value]) => (
          <div key={key} className="space-y-2">
            <div className="flex items-center justify-between text-[10px] uppercase font-semibold tracking-wider font-data">
              <span className="truncate max-w-[200px]" style={{ color: "var(--ink)" }} title={key}>{key}</span>
              <span style={{ color: "var(--slate)" }}>{value as number}</span>
            </div>
            <Progress value={total > 0 ? ((value as number) / total) * 100 : 0} className="h-1.5 rounded-none border border-[var(--line)]" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function TrafficChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return (
      <Card className="col-span-1 lg:col-span-3">
        <CardHeader><CardTitle>Traffic Overview</CardTitle></CardHeader>
        <CardContent><div className="h-[250px] flex items-center justify-center text-muted-foreground">No traffic data</div></CardContent>
      </Card>
    );
  }

  const maxViews = Math.max(...data.map(d => d.views), 1);

  return (
    <Card className="col-span-1 lg:col-span-3 rounded-none border-2 border-[var(--ink)] shadow-[4px_4px_0px_var(--ink)] relative">
      <CornerMarks />
      <CardHeader>
        <CardTitle className="font-display">Traffic Overview</CardTitle>
        <CardDescription style={{ color: "var(--slate)" }}>Daily pageviews and unique visitors.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full flex items-end justify-between gap-1 mt-4">
          {data.map((day, i) => (
            <div key={i} className="relative flex-1 group h-full flex items-end">
              <div 
                className="w-full bg-[rgba(36,81,255,0.2)] rounded-t-none border-x border-t border-[rgba(36,81,255,0.5)] hover:bg-[rgba(36,81,255,0.4)] transition-colors"
                style={{ height: `${(day.views / maxViews) * 100}%` }}
              >
                <div 
                  className="w-full bg-[var(--signal)] rounded-t-none opacity-80"
                  style={{ height: `${(day.visitors / day.views) * 100}%` }}
                />
              </div>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                <div className="bg-[var(--ink)] text-white text-[10px] uppercase font-bold tracking-wider p-2 rounded-none border-2 border-[var(--line)] shadow-lg whitespace-nowrap font-data">
                  <p className="mb-1" style={{ color: "var(--paper)" }}>{format(new Date(day.date), "MMM d, yyyy")}</p>
                  <p style={{ color: "var(--signal)" }}>Views: <span className="text-white">{day.views}</span></p>
                  <p style={{ color: "var(--amber)" }}>Visitors: <span className="text-white">{day.visitors}</span></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// --- Main Dashboard Component ---

export function AnalyticsDashboard({ 
  analytics, 
  websiteId, 
  initialGoals = [], 
  initialFunnels = [],
  startDate,
  endDate
}: { 
  analytics: any, 
  websiteId?: string, 
  initialGoals?: any[],
  initialFunnels?: any[],
  startDate?: Date,
  endDate?: Date
}) {
  const router = useRouter();
  const { toast } = useToast();
  
  // States
  const [goals, setGoals] = useState(initialGoals);
  const [funnels, setFunnels] = useState(initialFunnels);
  const [activeTab, setActiveTab] = useState("overview");

  // Filter State
  const [start, setStart] = useState<string>(() => startDate ? format(startDate, "yyyy-MM-dd") : format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"));
  const [end, setEnd] = useState<string>(() => endDate ? format(endDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"));

  // Realtime State
  const [realtime, setRealtime] = useState({ activeVisitors: 0, recentEvents: [] as any[] });

  // Funnel Add State
  const [isAddingFunnel, setIsAddingFunnel] = useState(false);
  const [newFunnelName, setNewFunnelName] = useState("");
  const [newFunnelSteps, setNewFunnelSteps] = useState("page_view, signup");

  const [funnelStats, setFunnelStats] = useState<Record<string, any[]>>({});

  // Realtime Polling Effect
  useEffect(() => {
    if (!websiteId || activeTab !== "realtime") return;
    
    let isMounted = true;
    const fetchRealtime = async () => {
      try {
        const data = await getRealtimeAnalytics(websiteId);
        if (isMounted) setRealtime(data);
      } catch (e) {}
    };

    fetchRealtime();
    const interval = setInterval(fetchRealtime, 10000); // 10s poll

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [websiteId, activeTab]);

  // Funnel Stats Fetching
  useEffect(() => {
    if (!websiteId || activeTab !== "conversion") return;
    
    funnels.forEach(async (f) => {
      try {
        const stats = await getFunnelStats(websiteId, f.id, new Date(start), new Date(end));
        setFunnelStats(prev => ({ ...prev, [f.id]: stats }));
      } catch(e) {}
    });
  }, [websiteId, funnels, activeTab, start, end]);

  const applyFilters = () => {
    router.push(`?start=${start}&end=${end}`);
  };

  const handleExport = async () => {
    if (!websiteId) return;
    try {
      const csvData = await exportAnalyticsCsv(websiteId, new Date(start), new Date(end));
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', `analytics_${format(new Date(), "yyyy-MM-dd")}.csv`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast({ title: "Export Started" });
    } catch (e) {
      toast({ title: "Export Failed", variant: "destructive" });
    }
  };

  const handleAddFunnel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!websiteId) return;
    const steps = newFunnelSteps.split(",").map(s => s.trim()).filter(Boolean);
    try {
      const f = await createAnalyticsFunnel(websiteId, newFunnelName, steps);
      setFunnels([f, ...funnels]);
      setNewFunnelName("");
      setNewFunnelSteps("page_view, signup");
      setIsAddingFunnel(false);
      toast({ title: "Funnel created" });
    } catch (e) {
      toast({ title: "Failed to create funnel", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl">
      {/* Header & Global Filters */}
      <FadeIn>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--paper)] border-2 border-[var(--ink)] shadow-[4px_4px_0px_var(--ink)] rounded-none p-6 relative">
          <CornerMarks />
          <div>
            <h2 className="text-2xl font-bold tracking-tight font-display">Analytics Engine</h2>
            <p className="text-sm mt-1" style={{ color: "var(--slate)" }}>Data-driven insights for your website.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex items-center gap-2">
              <Input type="date" value={start} onChange={e => setStart(e.target.value)} className="w-[140px] rounded-none border-[var(--line)]" />
              <span className="text-[var(--slate)]">-</span>
              <Input type="date" value={end} onChange={e => setEnd(e.target.value)} className="w-[140px] rounded-none border-[var(--line)]" />
              <Button onClick={applyFilters} variant="secondary" className="rounded-none border-[var(--ink)] hover:bg-[var(--line)]">Apply</Button>
            </div>
            <Button onClick={handleExport} variant="outline" className="rounded-none border-2 border-[var(--ink)] hover:bg-[var(--ink)] hover:text-white transition-colors"><Download className="w-4 h-4 mr-2"/> Export CSV</Button>
          </div>
        </div>
      </FadeIn>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="behavior">Behavior</TabsTrigger>
          <TabsTrigger value="conversion">Conversion & Funnels</TabsTrigger>
          <TabsTrigger value="realtime">Realtime <span className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse" /></TabsTrigger>
        </TabsList>

        {/* =========================================
            OVERVIEW TAB
            ========================================= */}
        <TabsContent value="overview" className="space-y-6">
          <StaggerContainer className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <StaggerItem><MetricCard title="Total Views" value={new Intl.NumberFormat().format(analytics.totalViews)} icon={BarChart3} /></StaggerItem>
            <StaggerItem><MetricCard title="Unique Visitors" value={new Intl.NumberFormat().format(analytics.totalVisitors)} icon={Users} /></StaggerItem>
            <StaggerItem><MetricCard title="Total Sessions" value={new Intl.NumberFormat().format(analytics.totalSessions)} icon={Activity} /></StaggerItem>
            <StaggerItem><MetricCard title="Avg Bounce Rate" value={`${analytics.avgBounceRate.toFixed(1)}%`} icon={MousePointerClick} /></StaggerItem>
            <StaggerItem><MetricCard title="Goal Conversions" value={new Intl.NumberFormat().format(analytics.conversions || 0)} icon={Target} /></StaggerItem>
          </StaggerContainer>

          <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
            <TrafficChart data={analytics.dailyTraffic} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <BreakdownList title="Top Pages" icon={FileText} data={analytics.topPages} />
            <BreakdownList title="Traffic Sources (Referrers)" icon={LinkIcon} data={analytics.referrers} />
          </div>
        </TabsContent>

        {/* =========================================
            AUDIENCE TAB
            ========================================= */}
        <TabsContent value="audience" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <BreakdownList title="Devices" icon={MonitorSmartphone} data={analytics.devices} showAll />
            <BreakdownList title="Browsers" icon={Globe} data={analytics.browsers || {}} showAll />
            <BreakdownList title="Countries" icon={Globe} data={analytics.countries} showAll />
          </div>
          
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <BreakdownList title="UTM Campaigns" icon={Share2} data={analytics.campaigns || {}} showAll />
            <BreakdownList title="Referrers" icon={LinkIcon} data={analytics.referrers} showAll />
          </div>
        </TabsContent>

        {/* =========================================
            BEHAVIOR TAB
            ========================================= */}
        <TabsContent value="behavior" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            
            {/* Scroll Depth */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2"><Activity className="h-4 w-4" /> Scroll Depth Engagement</CardTitle>
                <CardDescription>Sessions reaching scroll percentage thresholds.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(analytics.scrollDepths || []).map((sd: any) => (
                  <div key={sd.depth} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium truncate">Reached {sd?.depth}%</span>
                      <span className="text-muted-foreground">{sd?.count || 0} views</span>
                    </div>
                    <Progress value={((sd?.count || 0) / Math.max(analytics.totalViews, 1)) * 100} className="h-2" />
                  </div>
                ))}
                {(!analytics.scrollDepths || analytics.scrollDepths.length === 0) && (
                  <div className="text-muted-foreground text-sm">No scroll depth events recorded yet.</div>
                )}
              </CardContent>
            </Card>

            {/* Click Map */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2"><MousePointerClick className="h-4 w-4" /> Top Clicked Elements</CardTitle>
                <CardDescription>Data-driven click map identifying popular interactive elements.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(analytics.clickMap || []).map((click: any, idx: number) => (
                  <div key={idx} className="space-y-1 border-b pb-2 last:border-0">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium truncate max-w-[200px]">{click?.text || `<${click?.tagName}>`}</span>
                      <span className="text-muted-foreground">{click?.count || 0} clicks</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Path: {click?.path}</div>
                  </div>
                ))}
                {(!analytics.clickMap || analytics.clickMap.length === 0) && (
                  <div className="text-muted-foreground text-sm">No click map data recorded yet.</div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* =========================================
            CONVERSION TAB
            ========================================= */}
        <TabsContent value="conversion" className="space-y-6">
          {/* Goals */}
          <div className="mb-8">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-4"><Target className="h-5 w-5" /> Conversion Goals</h3>
            {goals.length === 0 ? (
              <div className="text-muted-foreground text-sm bg-muted/20 p-4 rounded border">No goals configured.</div>
            ) : (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                {goals.map((g) => (
                  <Card key={g.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base">{g.name}</CardTitle>
                      </div>
                      <CardDescription>Event: <code>{g.eventName}</code></CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Funnels */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2"><LayoutTemplate className="h-5 w-5" /> Conversion Funnels</h3>
              <Button onClick={() => setIsAddingFunnel(!isAddingFunnel)} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" /> Add Funnel
              </Button>
            </div>
            
            {isAddingFunnel && (
              <Card className="mb-4 bg-muted/30">
                <CardContent className="pt-6">
                  <form onSubmit={handleAddFunnel} className="flex flex-col gap-4">
                    <div className="space-y-2">
                      <Label>Funnel Name</Label>
                      <Input value={newFunnelName} onChange={e => setNewFunnelName(e.target.value)} required placeholder="e.g. Checkout Flow" />
                    </div>
                    <div className="space-y-2">
                      <Label>Steps (Event names, comma-separated)</Label>
                      <Input value={newFunnelSteps} onChange={e => setNewFunnelSteps(e.target.value)} required placeholder="page_view, add_to_cart, purchase" />
                    </div>
                    <Button type="submit" className="w-fit">Save Funnel</Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {funnels.length === 0 ? (
              <div className="text-muted-foreground text-sm bg-muted/20 p-4 rounded border">No funnels configured.</div>
            ) : (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                {funnels.map((f) => (
                  <Card key={f.id}>
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                      <CardTitle className="text-base">{f.name}</CardTitle>
                      <Button variant="ghost" size="icon" className="text-destructive h-6 w-6" onClick={() => deleteAnalyticsFunnel(f.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {funnelStats[f.id] ? (
                        funnelStats[f.id].map((step, idx) => {
                          const prevCount = idx === 0 ? (step?.count || 0) : (funnelStats[f.id][idx - 1]?.count || 0);
                          const percent = prevCount > 0 ? ((step?.count || 0) / prevCount) * 100 : 0;
                          return (
                            <div key={idx} className="space-y-1">
                              <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">Step {step?.step}: {step?.name}</span>
                                <span className="text-muted-foreground">{step?.count || 0} ({percent.toFixed(1)}%)</span>
                              </div>
                              <Progress value={percent} className="h-2" />
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-sm text-muted-foreground animate-pulse">Loading stats...</div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* =========================================
            REALTIME TAB
            ========================================= */}
        <TabsContent value="realtime" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 animate-pulse" /> Active Right Now
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-6xl font-bold">{realtime.activeVisitors}</div>
                <p className="mt-2 text-primary-foreground/80 text-sm">Sessions active in the last 5 minutes</p>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Live Event Feed</CardTitle>
                  <CardDescription>Most recent events streaming in realtime.</CardDescription>
                </div>
                <RefreshCw className="h-4 w-4 text-muted-foreground animate-spin-slow" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[300px] overflow-auto pr-2">
                  {realtime.recentEvents.map((evt, idx) => (
                    <div key={idx} className="flex items-start justify-between border-b pb-2 last:border-0 text-sm">
                      <div>
                        <div className="font-medium">{evt.eventName}</div>
                        <div className="text-muted-foreground text-xs">{evt.path}</div>
                      </div>
                      <div className="text-xs text-muted-foreground">{format(new Date(evt.createdAt), "HH:mm:ss")}</div>
                    </div>
                  ))}
                  {realtime.recentEvents.length === 0 && (
                    <div className="text-muted-foreground text-sm">No recent events.</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

      </Tabs>
    </div>
  );
}
