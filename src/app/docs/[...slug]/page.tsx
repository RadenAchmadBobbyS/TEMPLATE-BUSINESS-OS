import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getDocContent } from "@/core/docs/lib";
import { MdxComponents } from "@/core/docs/components/MdxComponents";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default async function DocPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const doc = await getDocContent(slug);

  if (!doc) {
    notFound();
  }

  // Generate breadcrumbs from slug
  const breadcrumbs = slug.map((part, index) => {
    const href = `/docs/${slug.slice(0, index + 1).join("/")}`;
    const label = part.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    return { href, label };
  });

  return (
    <div className="pb-16">
      <div className="flex items-center text-sm text-muted-foreground mb-8 overflow-x-auto whitespace-nowrap pb-2">
        <Link href="/docs" className="hover:text-foreground transition-colors">Docs</Link>
        {breadcrumbs.map((crumb, index) => (
          <div key={crumb.href} className="flex items-center">
            <ChevronRight className="h-4 w-4 mx-1 flex-shrink-0" />
            {index === breadcrumbs.length - 1 ? (
              <span className="text-foreground font-medium">{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="hover:text-foreground transition-colors">{crumb.label}</Link>
            )}
          </div>
        ))}
      </div>

      <div className="mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
          {doc.frontmatter.title || doc.slug}
        </h1>
        {doc.frontmatter.description && (
          <p className="text-xl text-muted-foreground leading-relaxed">
            {doc.frontmatter.description}
          </p>
        )}
      </div>
      
      <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-pre:bg-zinc-950 prose-pre:border">
        <MDXRemote source={doc.content} components={MdxComponents} />
      </div>
    </div>
  );
}
