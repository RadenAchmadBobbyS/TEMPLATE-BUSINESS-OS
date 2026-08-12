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
    
    // In production, we'd look up the primary custom domain for this website
    const domainRecord = await prisma.domain.findFirst({
      where: { websiteId, isCustom: true, isVerified: true }
    });
    const baseUrl = domainRecord ? `https://${domainRecord.hostname}` : `https://${websiteId}.businessos.app`;

    const pages = await prisma.page.findMany({
      where: { websiteId, isPublished: true, deletedAt: null },
      select: { slug: true, updatedAt: true }
    });

    const xmlUrls = pages.map(page => {
      const url = `${baseUrl}${page.slug === 'home' || page.slug === '/' ? '' : `/${page.slug}`}`;
      return `
  <url>
    <loc>${url}</loc>
    <lastmod>${page.updatedAt.toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${page.slug === 'home' || page.slug === '/' ? '1.0' : '0.8'}</priority>
  </url>`;
    }).join("");

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlUrls}
</urlset>`;

    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Sitemap Generation Error:", error);
    return new NextResponse("Error generating sitemap", { status: 500 });
  }
}
