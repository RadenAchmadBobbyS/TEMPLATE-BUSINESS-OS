import { notFound } from "next/navigation";
import { prisma } from "@/shared/lib/prisma";
import { PublicPageRenderer } from "@/core/publishing/components/PublicPageRenderer";
import { resolvePageSEO, generateNextMetadata } from "@/core/seo/resolver";
import type { Metadata } from "next";

interface CustomDomainPageProps {
  params: Promise<{
    hostname: string;
    slug?: string[];
  }>;
}

async function getPageData(hostname: string, slugArray?: string[]) {
  // Find the verified domain to get the website ID
  const domain = await prisma.domain.findUnique({
    where: { hostname },
    include: {
      website: {
        include: {
          theme: true,
        }
      }
    }
  });

  if (!domain || !domain.isVerified || !domain.website) {
    return notFound(); // Domain not found or not verified
  }

  const website = domain.website;

  if (website.status !== "PUBLISHED" || website.deletedAt !== null) {
    return notFound(); // Website not published or deleted
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

export async function generateMetadata({ params }: CustomDomainPageProps): Promise<Metadata> {
  const { hostname, slug } = await params;
  const data = await getPageData(hostname, slug);

  if (!data) {
    return { title: "Not Found" };
  }

  const { website, page } = data;
  const resolvedSEO = resolvePageSEO(page, website);
  return generateNextMetadata(resolvedSEO);
}

export default async function CustomDomainPublicPage({ params }: CustomDomainPageProps) {
  const { hostname, slug } = await params;
  const data = await getPageData(hostname, slug);

  if (!data) {
    notFound();
  }

  const { website, pageVersion } = data;

  const nodeTree = pageVersion.nodeTree ? (pageVersion.nodeTree as any) : null;
  const themeVariables = website.theme?.variables;

  return <PublicPageRenderer nodeTree={nodeTree} themeVariables={themeVariables} websiteId={website.id} />;
}
