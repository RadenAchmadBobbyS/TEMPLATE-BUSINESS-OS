import { notFound } from "next/navigation";
import { prisma } from "@/shared/lib/prisma";
import { PublicPageRenderer } from "@/core/publishing/components/PublicPageRenderer";
import { resolvePageSEO, generateNextMetadata } from "@/core/seo/resolver";
import type { Metadata } from "next";

interface PublicPageProps {
  params: Promise<{
    websiteSlug: string;
    slug?: string[];
  }>;
}

async function getPageData(websiteSlug: string, slugArray?: string[]) {
  const website = await prisma.website.findUnique({
    where: { slug: websiteSlug, deletedAt: null },
    include: {
      theme: true,
    }
  });

  if (!website || website.status !== "PUBLISHED") {
    return notFound();
  }

  // Construct the page slug
  const pageSlug = slugArray && slugArray.length > 0 ? `/${slugArray.join('/')}` : "/";

  const page = await prisma.page.findFirst({
    where: {
      websiteId: website.id,
      slug: pageSlug,
      deletedAt: null,
      isPublished: true, // MUST be published
    }
  });

  if (!page || !page.publishedVersionId) {
    return notFound();
  }

  const pageVersion = await prisma.pageVersion.findUnique({
    where: { id: page.publishedVersionId }
  });

  if (!pageVersion) {
    return notFound();
  }

  return { website, page, pageVersion };
}

export async function generateMetadata({ params }: PublicPageProps): Promise<Metadata> {
  const { websiteSlug, slug } = await params;
  const data = await getPageData(websiteSlug, slug);

  if (!data) {
    return { title: "Not Found" };
  }

  const { website, page } = data;
  const resolvedSEO = resolvePageSEO(page, website);
  return generateNextMetadata(resolvedSEO);
}

export default async function PublicWebsitePage({ params }: PublicPageProps) {
  const { websiteSlug, slug } = await params;
  const data = await getPageData(websiteSlug, slug);

  if (!data) {
    notFound();
  }

  const { website, pageVersion } = data;

  const nodeTree = pageVersion.nodeTree ? (pageVersion.nodeTree as any) : null;
  const themeVariables = website.theme?.variables;

  return <PublicPageRenderer nodeTree={nodeTree} themeVariables={themeVariables} websiteId={website.id} />;
}
