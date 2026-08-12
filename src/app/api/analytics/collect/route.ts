import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import type { AnalyticsPayload } from "@/core/analytics/client";
import { headers } from "next/headers";

function extractCountry(reqHeaders: Headers) {
  // Vercel / Cloudflare provide these headers
  return reqHeaders.get("x-vercel-ip-country") || reqHeaders.get("cf-ipcountry") || "Unknown";
}

function extractDeviceAndBrowser(userAgent: string) {
  let device = "Desktop";
  if (/mobile/i.test(userAgent)) device = "Mobile";
  if (/tablet/i.test(userAgent) || /ipad/i.test(userAgent)) device = "Tablet";

  let browser = "Other";
  if (/chrome|crios/i.test(userAgent) && !/edge|edg|opr|opera/i.test(userAgent)) browser = "Chrome";
  else if (/safari/i.test(userAgent) && !/chrome|crios/i.test(userAgent)) browser = "Safari";
  else if (/firefox|fxios/i.test(userAgent)) browser = "Firefox";
  else if (/edge|edg/i.test(userAgent)) browser = "Edge";
  else if (/opr|opera/i.test(userAgent)) browser = "Opera";

  return { device, browser };
}

import { rateLimit } from "@/core/security/rate-limit";

function getClientIp(reqHeaders: Headers) {
  return reqHeaders.get("x-forwarded-for")?.split(",")[0] || reqHeaders.get("x-real-ip") || "unknown";
}

export async function POST(request: Request) {
  try {
    const reqHeaders = await headers();
    const ip = getClientIp(reqHeaders);
    
    // Apply strict rate limiting to prevent analytics endpoint abuse
    // 60 requests per minute per IP for analytics collection is generous
    const rateLimitResult = rateLimit(`analytics_${ip}`, 60, 60000);
    if (!rateLimitResult.success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
    const body = (await request.json()) as Partial<AnalyticsPayload>;

    const {
      websiteId,
      visitorId,
      sessionId,
      eventName,
      path,
      referrer,
      metadata,
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent
    } = body;

    // Validate essential fields
    if (!websiteId || !visitorId || !sessionId || !eventName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Optional: Size limit check for metadata
    if (metadata && JSON.stringify(metadata).length > 2048) {
      return NextResponse.json({ error: "Metadata too large" }, { status: 400 });
    }

    // Verify website exists (could cache this in a more complex setup, but DB lookup is fast enough for MVP)
    const website = await prisma.website.findUnique({
      where: { id: websiteId },
      select: { id: true, status: true, deletedAt: true }
    });

    if (!website || website.deletedAt || website.status !== "PUBLISHED") {
      return NextResponse.json({ error: "Website not trackable" }, { status: 403 });
    }

    // Parse Headers
    const userAgent = reqHeaders.get("user-agent") || "";
    const { device, browser } = extractDeviceAndBrowser(userAgent);
    const country = extractCountry(reqHeaders);

    const now = new Date();

    // 1. Upsert Visitor
    await prisma.analyticsVisitor.upsert({
      where: { id: visitorId },
      update: { lastSeenAt: now },
      create: {
        id: visitorId,
        websiteId,
        firstSeenAt: now,
        lastSeenAt: now
      }
    });

    // 2. Upsert Session
    // If it's a new session, we need landing page
    const session = await prisma.analyticsSession.upsert({
      where: { id: sessionId },
      update: {
        lastActivityAt: now,
        // Optional: Update exit page here if we want the last page they visited
        exitPage: path || undefined
      },
      create: {
        id: sessionId,
        websiteId,
        visitorId,
        startedAt: now,
        lastActivityAt: now,
        landingPage: path,
        exitPage: path,
        referrer: referrer || "Direct",
        device,
        browser,
        country,
        utmSource,
        utmMedium,
        utmCampaign,
        utmTerm,
        utmContent
      }
    });

    // 3. Insert Event
    await prisma.analyticsEvent.create({
      data: {
        websiteId,
        sessionId,
        visitorId,
        eventName: eventName.substring(0, 100), // Enforce length limit
        path,
        metadata: metadata || {}
      }
    });

    // Return 202 Accepted (Processed)
    return NextResponse.json({ success: true }, { status: 202 });
  } catch (error) {
    console.error("Analytics Collection Error:", error);
    // Never fail public requests - return 200 even on error to prevent client breakage 
    // unless it was a validation error caught earlier
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
