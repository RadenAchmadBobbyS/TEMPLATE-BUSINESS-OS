import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";

export const maxDuration = 60; // Allow up to 60 seconds on Vercel for this cron job
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    
    // In production, CRON_SECRET MUST be set and matching.
    if (process.env.NODE_ENV === "production") {
      if (!process.env.CRON_SECRET) {
        console.error("[Cron] FATAL: CRON_SECRET is not set in production. Failing closed.");
        return new NextResponse("Internal Server Error - Misconfigured", { status: 500 });
      }
      
      if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
    }

    // 1. Retention period definitions
    const eventRetentionDays = 90;
    const sessionVisitorRetentionDays = 365;
    
    const eventCutoffDate = new Date(Date.now() - eventRetentionDays * 24 * 60 * 60 * 1000);
    const oldSessionCutoff = new Date(Date.now() - sessionVisitorRetentionDays * 24 * 60 * 60 * 1000);

    console.log(`[Cron] Starting Analytics Retention Job...`);

    // We use batched raw queries to prevent row locking and lambda timeout on massive DBs.
    const batchSize = 10000;
    let totalDeletedEvents = 0;
    let totalDeletedSessions = 0;
    let totalDeletedVisitors = 0;

    // 2. Batch Delete AnalyticsEvent
    let deletedCount = 0;
    do {
      // Postgres raw query to delete rows where createdAt < eventCutoffDate limited by subquery
      // Prisma $executeRaw returns the number of rows affected.
      deletedCount = await prisma.$executeRaw`
        DELETE FROM "AnalyticsEvent"
        WHERE id IN (
          SELECT id FROM "AnalyticsEvent"
          WHERE "createdAt" < ${eventCutoffDate}
          LIMIT ${batchSize}
        )
      `;
      totalDeletedEvents += deletedCount;
    } while (deletedCount === batchSize);

    // 3. Batch Delete AnalyticsSession older than 1 year (to prune active user session bloat)
    deletedCount = 0;
    do {
      deletedCount = await prisma.$executeRaw`
        DELETE FROM "AnalyticsSession"
        WHERE id IN (
          SELECT id FROM "AnalyticsSession"
          WHERE "startedAt" < ${oldSessionCutoff}
          LIMIT ${batchSize}
        )
      `;
      totalDeletedSessions += deletedCount;
    } while (deletedCount === batchSize);

    // 4. Batch Delete Abandoned AnalyticsVisitors
    deletedCount = 0;
    do {
      deletedCount = await prisma.$executeRaw`
        DELETE FROM "AnalyticsVisitor"
        WHERE id IN (
          SELECT id FROM "AnalyticsVisitor"
          WHERE "lastSeenAt" < ${oldSessionCutoff}
          LIMIT ${batchSize}
        )
      `;
      totalDeletedVisitors += deletedCount;
    } while (deletedCount === batchSize);

    console.log(`[Cron] Deleted ${totalDeletedEvents} events, ${totalDeletedSessions} sessions, and ${totalDeletedVisitors} abandoned visitors.`);

    return NextResponse.json({
      success: true,
      message: "Retention policy executed successfully",
      stats: {
        deletedEvents: totalDeletedEvents,
        deletedSessions: totalDeletedSessions,
        deletedVisitors: totalDeletedVisitors,
      }
    });
  } catch (error) {
    console.error("[Cron] Analytics Retention failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
