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
      select: { settings: true, domain: true, slug: true },
    });

    if (!website) {
      return new NextResponse("Website not found", { status: 404 });
    }

    const siteSEO = (website.settings as any)?.seo || {};
    const robotsIndex = siteSEO.robotsIndex !== false;
    
    const baseUrl = website.domain 
      ? `https://${website.domain}` 
      : siteSEO.canonicalUrl || `https://${website.slug}.businessos.local`;

    let robotsTxt = `User-agent: *\n`;

    if (robotsIndex) {
      robotsTxt += `Allow: /\n`;
    } else {
      robotsTxt += `Disallow: /\n`;
    }

    // Always disallow private areas
    robotsTxt += `Disallow: /admin/\n`;
    robotsTxt += `Disallow: /dashboard/\n`;
    robotsTxt += `Disallow: /builder/\n`;
    robotsTxt += `Disallow: /api/\n`;
    robotsTxt += `Disallow: /auth/\n`;

    // Point to sitemap if we allow index
    if (robotsIndex) {
      robotsTxt += `\nSitemap: ${baseUrl}/sitemap.xml\n`; // In a real setup this URL resolves appropriately.
    }

    return new NextResponse(robotsTxt, {
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } catch (error: any) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
