"use server";

import { prisma } from "@/shared/lib/prisma";
import { auth } from "@/core/auth/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

async function ensureWebsiteAccess(websiteId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const role = await prisma.userRole.findFirst({
    where: { userId: session.user.id },
  });
  if (!role) throw new Error("Workspace access denied");

  const website = await prisma.website.findFirst({
    where: { id: websiteId, workspaceId: role.workspaceId }
  });
  if (!website) throw new Error("Website not found");

  return { website, role: role.role };
}

export async function getWebsiteAnalytics(websiteId: string, startDate?: Date, endDate?: Date) {
  try {
    await ensureWebsiteAccess(websiteId);

  const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const end = endDate || new Date();

  // 1. Core Metrics
  const totalVisitors = await prisma.analyticsVisitor.count({
    where: { websiteId, firstSeenAt: { gte: start, lte: end } }
  });

  const totalSessions = await prisma.analyticsSession.count({
    where: { websiteId, startedAt: { gte: start, lte: end } }
  });

  const totalPageViews = await prisma.analyticsEvent.count({
    where: { websiteId, eventName: "page_view", createdAt: { gte: start, lte: end } }
  });

  // 2. Bounce Rate
  const bounceStats = await prisma.$queryRaw<{ bounced: number }[]>`
    SELECT SUM(CASE WHEN event_count = 1 THEN 1 ELSE 0 END)::int as bounced
    FROM (
      SELECT s.id, COUNT(e.id) as event_count
      FROM "AnalyticsSession" s
      LEFT JOIN "AnalyticsEvent" e ON e."sessionId" = s.id
      WHERE s."websiteId" = ${websiteId}::uuid AND s."startedAt" >= ${start} AND s."startedAt" <= ${end}
      GROUP BY s.id
    ) as session_events
  `;
  const bouncedSessions = bounceStats[0]?.bounced || 0;
  const avgBounceRate = totalSessions > 0 ? (bouncedSessions / totalSessions) * 100 : 0;

  // 3. Conversions
  const activeGoals = await prisma.analyticsGoal.findMany({
    where: { websiteId, active: true }
  });
  const goalEventNames = activeGoals.map(g => g.eventName);
  
  let conversions = 0;
  if (goalEventNames.length > 0) {
    conversions = await prisma.analyticsEvent.count({
      where: {
        websiteId,
        createdAt: { gte: start, lte: end },
        eventName: { in: goalEventNames }
      }
    });
  }

  // 4. Aggregations using Prisma groupBy
  const topPagesData = await prisma.analyticsEvent.groupBy({
    by: ['path'],
    where: { websiteId, eventName: 'page_view', createdAt: { gte: start, lte: end } },
    _count: { path: true },
    orderBy: { _count: { path: 'desc' } },
    take: 10
  });

  const countriesData = await prisma.analyticsSession.groupBy({
    by: ['country'],
    where: { websiteId, startedAt: { gte: start, lte: end }, country: { not: null } },
    _count: { country: true },
    orderBy: { _count: { country: 'desc' } },
    take: 10
  });

  const devicesData = await prisma.analyticsSession.groupBy({
    by: ['device'],
    where: { websiteId, startedAt: { gte: start, lte: end }, device: { not: null } },
    _count: { device: true },
    orderBy: { _count: { device: 'desc' } }
  });

  const browsersData = await prisma.analyticsSession.groupBy({
    by: ['browser'],
    where: { websiteId, startedAt: { gte: start, lte: end }, browser: { not: null } },
    _count: { browser: true },
    orderBy: { _count: { browser: 'desc' } }
  });

  const referrersData = await prisma.analyticsSession.groupBy({
    by: ['referrer'],
    where: { websiteId, startedAt: { gte: start, lte: end }, referrer: { not: null } },
    _count: { referrer: true },
    orderBy: { _count: { referrer: 'desc' } },
    take: 10
  });

  const campaignsData = await prisma.analyticsSession.groupBy({
    by: ['utmCampaign'],
    where: { websiteId, startedAt: { gte: start, lte: end }, utmCampaign: { not: null } },
    _count: { utmCampaign: true },
    orderBy: { _count: { utmCampaign: 'desc' } },
    take: 10
  });

  // 5. Daily Traffic (Raw SQL for DATE grouping)
  const dailyData = await prisma.$queryRaw<{ date: string, views: number, visitors: number }[]>`
    SELECT 
      TO_CHAR(e."createdAt", 'YYYY-MM-DD') as date,
      COUNT(e.id)::int as views,
      COUNT(DISTINCT e."visitorId")::int as visitors
    FROM "AnalyticsEvent" e
    WHERE e."websiteId" = ${websiteId}::uuid AND e."eventName" = 'page_view' AND e."createdAt" >= ${start} AND e."createdAt" <= ${end}
    GROUP BY TO_CHAR(e."createdAt", 'YYYY-MM-DD')
    ORDER BY date ASC
  `;

  // 6. Scroll Depth Average
  const scrollData = await prisma.$queryRaw<{ depth: number, count: number }[]>`
    SELECT 
      CAST(metadata->>'depth' AS INTEGER) as depth,
      COUNT(*)::int as count
    FROM "AnalyticsEvent" e
    WHERE e."websiteId" = ${websiteId}::uuid AND e."eventName" = 'scroll_depth' AND e."createdAt" >= ${start} AND e."createdAt" <= ${end}
    GROUP BY depth
    ORDER BY depth ASC
  `;

  // 7. Click Map (Top elements clicked)
  const clickData = await prisma.$queryRaw<{ path: string, tagName: string, text: string, count: number }[]>`
    SELECT 
      e.path,
      metadata->>'tagName' as "tagName",
      metadata->>'text' as text,
      COUNT(*)::int as count
    FROM "AnalyticsEvent" e
    WHERE e."websiteId" = ${websiteId}::uuid AND e."eventName" = 'click' AND e."createdAt" >= ${start} AND e."createdAt" <= ${end}
    GROUP BY e.path, metadata->>'tagName', metadata->>'text'
    ORDER BY count DESC
    LIMIT 20
  `;

  // Format outputs
  const topPages = topPagesData.reduce((acc, curr) => {
    acc[curr.path || '/'] = curr._count.path;
    return acc;
  }, {} as Record<string, number>);

  const countries = countriesData.reduce((acc, curr) => {
    acc[curr.country || 'Unknown'] = curr._count.country;
    return acc;
  }, {} as Record<string, number>);

  const devices = devicesData.reduce((acc, curr) => {
    acc[curr.device || 'Unknown'] = curr._count.device;
    return acc;
  }, {} as Record<string, number>);

  const browsers = browsersData.reduce((acc, curr) => {
    acc[curr.browser || 'Unknown'] = curr._count.browser;
    return acc;
  }, {} as Record<string, number>);

  const referrers = referrersData.reduce((acc, curr) => {
    acc[curr.referrer || 'Direct'] = curr._count.referrer;
    return acc;
  }, {} as Record<string, number>);

  const campaigns = campaignsData.reduce((acc, curr) => {
    acc[curr.utmCampaign || 'Unknown'] = curr._count.utmCampaign;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalViews: totalPageViews,
    totalVisitors,
    totalSessions,
    avgBounceRate,
    conversions,
    topPages,
    countries,
    devices,
    browsers,
    referrers,
    campaigns,
    dailyTraffic: dailyData,
    scrollDepths: scrollData,
    clickMap: clickData
  };
  } catch (e: any) {
    console.error("GET_WEBSITE_ANALYTICS_ERROR", e.stack);
    throw e;
  }
}

export async function getRealtimeAnalytics(websiteId: string) {
  await ensureWebsiteAccess(websiteId);
  const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000);

  const activeVisitors = await prisma.analyticsSession.count({
    where: { websiteId, lastActivityAt: { gte: fiveMinsAgo } }
  });

  const recentEvents = await prisma.analyticsEvent.findMany({
    where: { websiteId, createdAt: { gte: fiveMinsAgo } },
    orderBy: { createdAt: 'desc' },
    take: 15,
    select: { eventName: true, path: true, createdAt: true, metadata: true }
  });

  return { activeVisitors, recentEvents };
}

// ----------------------------------------------------
// GOALS
// ----------------------------------------------------
export async function getAnalyticsGoals(websiteId: string) {
  await ensureWebsiteAccess(websiteId);
  return prisma.analyticsGoal.findMany({
    where: { websiteId },
    orderBy: { createdAt: 'desc' }
  });
}

export async function createAnalyticsGoal(websiteId: string, name: string, eventName: string) {
  const { role } = await ensureWebsiteAccess(websiteId);
  if (!["OWNER", "ADMIN", "EDITOR"].includes(role)) throw new Error("Unauthorized to create goals");

  const goal = await prisma.analyticsGoal.create({
    data: { websiteId, name, eventName, active: true }
  });
  revalidatePath(`/dashboard/websites/${websiteId}/analytics`);
  return goal;
}

export async function deleteAnalyticsGoal(goalId: string) {
  const goal = await prisma.analyticsGoal.findUnique({ where: { id: goalId } });
  if (!goal) throw new Error("Goal not found");
  
  const { role } = await ensureWebsiteAccess(goal.websiteId);
  if (!["OWNER", "ADMIN", "EDITOR"].includes(role)) throw new Error("Unauthorized to delete goals");

  await prisma.analyticsGoal.delete({ where: { id: goalId } });
  revalidatePath(`/dashboard/websites/${goal.websiteId}/analytics`);
}

// ----------------------------------------------------
// FUNNELS
// ----------------------------------------------------
export async function getAnalyticsFunnels(websiteId: string) {
  await ensureWebsiteAccess(websiteId);
  return prisma.analyticsFunnel.findMany({
    where: { websiteId },
    orderBy: { createdAt: 'desc' }
  });
}

export async function createAnalyticsFunnel(websiteId: string, name: string, steps: string[]) {
  const { role } = await ensureWebsiteAccess(websiteId);
  if (!["OWNER", "ADMIN", "EDITOR"].includes(role)) throw new Error("Unauthorized");

  const funnel = await prisma.analyticsFunnel.create({
    data: { websiteId, name, steps: steps }
  });
  revalidatePath(`/dashboard/websites/${websiteId}/analytics`);
  return funnel;
}

export async function deleteAnalyticsFunnel(funnelId: string) {
  const funnel = await prisma.analyticsFunnel.findUnique({ where: { id: funnelId } });
  if (!funnel) throw new Error("Funnel not found");
  const { role } = await ensureWebsiteAccess(funnel.websiteId);
  if (!["OWNER", "ADMIN", "EDITOR"].includes(role)) throw new Error("Unauthorized");
  await prisma.analyticsFunnel.delete({ where: { id: funnelId } });
  revalidatePath(`/dashboard/websites/${funnel.websiteId}/analytics`);
}

export async function getFunnelStats(websiteId: string, funnelId: string, startDate?: Date, endDate?: Date) {
  await ensureWebsiteAccess(websiteId);
  const funnel = await prisma.analyticsFunnel.findUnique({ where: { id: funnelId } });
  if (!funnel) throw new Error("Funnel not found");

  const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const end = endDate || new Date();
  
  const steps = funnel.steps as string[];
  if (!steps || steps.length === 0) return [];

  // For this MVP, we will run individual counts. A true funnel query in raw SQL can be extremely complex to write generically due to chronological requirements.
  // This calculates how many sessions hit each step.
  const stats = [];
  for (let i = 0; i < steps.length; i++) {
    const eventName = steps[i];
    const count = await prisma.analyticsEvent.findMany({
      where: {
        websiteId,
        eventName: eventName,
        createdAt: { gte: start, lte: end }
      },
      distinct: ['sessionId']
    }).then(res => res.length);
    stats.push({ step: i + 1, name: eventName, count });
  }

  // Ensure funnel drop-off logic (Step 2 cannot be higher than Step 1 in a true funnel constraint, so we cap it sequentially)
  let prevCount = stats[0].count;
  for (let i = 0; i < stats.length; i++) {
    if (stats[i].count > prevCount) {
      stats[i].count = prevCount;
    }
    prevCount = stats[i].count;
  }

  return stats;
}

// ----------------------------------------------------
// EXPORT
// ----------------------------------------------------
export async function exportAnalyticsCsv(websiteId: string, startDate?: Date, endDate?: Date) {
  await ensureWebsiteAccess(websiteId);
  const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const end = endDate || new Date();

  // Basic Export: Top events over the timeframe
  const events = await prisma.analyticsEvent.groupBy({
    by: ['eventName', 'path'],
    where: { websiteId, createdAt: { gte: start, lte: end } },
    _count: { _all: true },
    orderBy: { _count: { eventName: 'desc' } }
  });

  const header = "Event Name,Path,Count\n";
  const rows = events.map(e => `${e.eventName},${e.path || '/'},${e._count._all}`).join("\n");
  
  return header + rows;
}
