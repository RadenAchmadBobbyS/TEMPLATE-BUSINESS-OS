import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { resolvePageSEO, generateNextMetadata } from "@/core/seo/resolver";

// This is a utility endpoint to test and verify SEO resolution.
// In the actual Publishing Engine, `generateNextMetadata` will be used directly
// in Next.js `generateMetadata()` exports.

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ websiteId: string; pageId: string }> }
) {
  try {
    const { websiteId, pageId } = await params;

    const website = await prisma.website.findUnique({
      where: { id: websiteId },
      select: { name: true, settings: true },
    });

    if (!website) {
      return NextResponse.json({ error: "Website not found" }, { status: 404 });
    }

    const page = await prisma.page.findUnique({
      where: { id: pageId, websiteId },
      select: { title: true, settings: true },
    });

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    const resolvedSEO = resolvePageSEO(page, website);
    const nextMetadata = generateNextMetadata(resolvedSEO);

    return NextResponse.json({
      resolvedSEO,
      nextMetadata,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
