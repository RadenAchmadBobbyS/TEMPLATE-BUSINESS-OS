import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hostname = searchParams.get("hostname");

  if (!hostname) {
    return NextResponse.json({ error: "Missing hostname" }, { status: 400 });
  }

  try {
    const baseAppDomain = process.env.NEXT_PUBLIC_APP_URL?.replace(/^https?:\/\//, '') || "localhost:3000";
    let websiteId: string | undefined;

    // Check if it's a subdomain
    if (hostname.endsWith(`.${baseAppDomain}`) || hostname.endsWith(".localhost:3000")) {
      const rootToReplace = hostname.endsWith(`.${baseAppDomain}`) ? `.${baseAppDomain}` : ".localhost:3000";
      const slug = hostname.replace(rootToReplace, "");
      
      const website = await prisma.website.findUnique({
        where: { slug }
      });
      if (website) websiteId = website.id;
    } else {
      // Check if it's a custom domain
      const domain = await prisma.domain.findUnique({
        where: { hostname }
      });
      if (domain && domain.isVerified) {
        websiteId = domain.websiteId;
      }
    }

    if (!websiteId) {
      return NextResponse.json({ redirects: [] });
    }

    // Fetch active redirects
    const redirects = await prisma.redirect.findMany({
      where: { websiteId, active: true },
      select: { source: true, destination: true, permanent: true }
    });

    return NextResponse.json({ redirects });
  } catch (error) {
    console.error("EDGE_ROUTING_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
