import { Metadata } from "next";

export type ResolvedSEO = {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  noIndex: boolean;
  noFollow: boolean;
};

export function resolvePageSEO(page: any, website: any): ResolvedSEO {
  const pageSEO = page?.settings?.seo || {};
  const siteSEO = website?.settings?.seo || {};

  const fallbackTitle = page.title || website.name || "BusinessOS Website";
  
  return {
    title: pageSEO.metaTitle || siteSEO.metaTitle || fallbackTitle,
    description: pageSEO.metaDescription || siteSEO.metaDescription || "",
    keywords: pageSEO.keywords || "",
    canonicalUrl: pageSEO.canonicalUrl || siteSEO.canonicalUrl || "",
    ogTitle: pageSEO.ogTitle || pageSEO.metaTitle || siteSEO.ogTitle || siteSEO.metaTitle || fallbackTitle,
    ogDescription: pageSEO.ogDescription || pageSEO.metaDescription || siteSEO.ogDescription || siteSEO.metaDescription || "",
    ogImage: pageSEO.ogImage || siteSEO.ogImage || "",
    twitterTitle: pageSEO.twitterTitle || pageSEO.ogTitle || pageSEO.metaTitle || siteSEO.twitterTitle || siteSEO.ogTitle || fallbackTitle,
    twitterDescription: pageSEO.twitterDescription || pageSEO.ogDescription || pageSEO.metaDescription || siteSEO.twitterDescription || siteSEO.ogDescription || "",
    twitterImage: pageSEO.twitterImage || pageSEO.ogImage || siteSEO.twitterImage || siteSEO.ogImage || "",
    noIndex: pageSEO.noIndex ?? (!siteSEO.robotsIndex), // if site doesn't index, page shouldn't either
    noFollow: pageSEO.noFollow ?? (!siteSEO.robotsFollow),
  };
}

export function generateNextMetadata(seo: ResolvedSEO): Metadata {
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords ? seo.keywords.split(",").map((k: string) => k.trim()) : undefined,
    alternates: seo.canonicalUrl ? { canonical: seo.canonicalUrl } : undefined,
    openGraph: {
      title: seo.ogTitle,
      description: seo.ogDescription,
      images: seo.ogImage ? [{ url: seo.ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: seo.twitterTitle,
      description: seo.twitterDescription,
      images: seo.twitterImage ? [seo.twitterImage] : undefined,
    },
    robots: {
      index: !seo.noIndex,
      follow: !seo.noFollow,
    },
  };
}
