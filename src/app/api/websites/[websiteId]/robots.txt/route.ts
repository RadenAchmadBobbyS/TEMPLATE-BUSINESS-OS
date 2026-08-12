import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ websiteId: string }> }
) {
  try {
    const resolvedParams = await params;
    const websiteId = resolvedParams.websiteId;

    // Quick validation to prevent Next.js static generation from crashing with dummy IDs like "-"
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(websiteId)) {
      return new NextResponse("Invalid website ID", { status: 400 });
    }

    // Fetch the primary domain to build the sitemap URL
    const domainRecord = await prisma.domain.findFirst({
      where: { websiteId, isCustom: true, isVerified: true }
    });
    const baseUrl = domainRecord ? `https://${domainRecord.hostname}` : `https://${websiteId}.businessos.app`;
    const sitemapUrl = `${baseUrl}/api/websites/${websiteId}/sitemap.xml`;

    const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${sitemapUrl}
`;

    return new NextResponse(robotsTxt, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Robots Generation Error:", error);
    return new NextResponse("Error generating robots.txt", { status: 500 });
  }
}
