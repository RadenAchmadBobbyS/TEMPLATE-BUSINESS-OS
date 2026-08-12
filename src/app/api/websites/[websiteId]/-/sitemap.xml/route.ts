import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ websiteId: string }> }
) {
  try {
    const { websiteId } = await params;

    const website = await prisma.website.findUnique({
      where: { id: websiteId },
      include: {
        pages: {
          where: { isPublished: true, deletedAt: null },
        },
      },
    });

    if (!website) {
      return new NextResponse("Website not found", { status: 404 });
    }

    const baseUrl = website.domain 
      ? `https://${website.domain}` 
      : (website.settings as any)?.seo?.canonicalUrl || `https://${website.slug}.businessos.local`;

    let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    sitemapXml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    website.pages.forEach((page) => {
      const pageSettings = page.settings as any;
      const isSitemapIncluded = pageSettings?.seo?.sitemapIncluded !== false;
      const isNoIndex = pageSettings?.seo?.noIndex === true;

      // Only include pages that have sitemapIncluded = true (default true) and are not noIndex
      if (isSitemapIncluded && !isNoIndex) {
        const canonicalUrl = pageSettings?.seo?.canonicalUrl;
        
        let urlLoc = "";
        if (canonicalUrl) {
          urlLoc = canonicalUrl;
        } else {
          // Fallback to construction based on baseUrl + slug
          // Note: homepage slug is "/"
          urlLoc = page.slug === "/" ? baseUrl : `${baseUrl}${page.slug.startsWith('/') ? page.slug : '/' + page.slug}`;
        }
        
        sitemapXml += `  <url>\n`;
        sitemapXml += `    <loc>${urlLoc}</loc>\n`;
        sitemapXml += `    <lastmod>${page.updatedAt.toISOString()}</lastmod>\n`;
        sitemapXml += `  </url>\n`;
      }
    });

    sitemapXml += `</urlset>`;

    return new NextResponse(sitemapXml, {
      headers: {
        "Content-Type": "application/xml",
      },
    });
  } catch (error: any) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
