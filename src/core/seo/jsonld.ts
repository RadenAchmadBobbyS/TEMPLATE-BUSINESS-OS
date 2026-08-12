import { ResolvedSEO } from "./resolver";

export function generateWebSiteJsonLd(website: any) {
  const settings = website.settings || {};
  const seo = settings.seo || {};
  const business = settings.business || {};
  const brand = settings.brand || {};

  const baseUrl = website.domain 
    ? `https://${website.domain}` 
    : seo.canonicalUrl || `https://${website.slug}.businessos.local`;

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": website.name,
    "url": baseUrl,
    "description": seo.metaDescription,
    "publisher": {
      "@type": "Organization",
      "name": business.companyName || website.name,
      "logo": brand.logoUrl ? {
        "@type": "ImageObject",
        "url": brand.logoUrl
      } : undefined
    }
  };
}

export function generateWebPageJsonLd(page: any, resolvedSEO: ResolvedSEO, website: any) {
  const baseUrl = website.domain 
    ? `https://${website.domain}` 
    : (website.settings as any)?.seo?.canonicalUrl || `https://${website.slug}.businessos.local`;

  // Determine final URL loc
  const urlLoc = page.slug === "/" 
    ? baseUrl 
    : `${baseUrl}${page.slug.startsWith('/') ? page.slug : '/' + page.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": resolvedSEO.title,
    "description": resolvedSEO.description,
    "url": resolvedSEO.canonicalUrl || urlLoc,
    "datePublished": page.createdAt?.toISOString(),
    "dateModified": page.updatedAt?.toISOString(),
    "isPartOf": generateWebSiteJsonLd(website)
  };
}
