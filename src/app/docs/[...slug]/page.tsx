import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getDocContent } from "@/core/docs/lib";
import { MdxComponents } from "@/core/docs/components/MdxComponents";
import Link from "next/link";
import { ChevronRight, ChevronLeft, ArrowRight } from "lucide-react";
import { docsNavigation } from "@/core/docs/navigation";

export default async function DocPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const doc = await getDocContent(slug);

  const currentPath = `/docs/${slug.join("/")}`;

  // If there's no MDX file, check if it's a category landing page
  if (!doc) {
    if (slug.length === 1) {
      const section = docsNavigation.find(s => s.href === currentPath);
      if (section) {
        return (
          <div className="pb-16">
            <div className="flex items-center text-sm text-muted-foreground mb-8 overflow-x-auto whitespace-nowrap pb-2">
              <Link href="/docs" className="hover:text-foreground transition-colors">Docs</Link>
              <ChevronRight className="h-4 w-4 mx-1 flex-shrink-0" />
              <span className="text-foreground font-medium">{section.title}</span>
            </div>

            <div className="mb-10 border-b pb-10">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
                {section.title}
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Explore documentation, guides, and architecture for {section.title}.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.items.map((item) => (
                <Link key={item.href} href={item.href} className="group border rounded-xl p-6 hover:border-primary/50 hover:shadow-sm bg-card transition-all flex flex-col gap-2">
                  <h3 className="text-lg font-semibold group-hover:text-primary transition-colors flex items-center justify-between">
                    {item.title}
                    <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Read the complete documentation on {item.title}.
                  </p>
                </Link>
              ))}
            </div>
          </div>
        );
      }
    }
    notFound();
  }

  // Generate breadcrumbs from slug
  const breadcrumbs = slug.map((part, index) => {
    const href = `/docs/${slug.slice(0, index + 1).join("/")}`;
    const label = part.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    return { href, label };
  });

  // Calculate Previous and Next Links
  const allItems = docsNavigation.flatMap(section => section.items);
  const currentIndex = allItems.findIndex(item => item.href === currentPath);
  
  const prevItem = currentIndex > 0 ? allItems[currentIndex - 1] : null;
  const nextItem = currentIndex !== -1 && currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null;

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
      
      <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-pre:bg-zinc-950 prose-pre:border mb-16 break-words overflow-hidden">
        <MDXRemote source={doc.content} components={MdxComponents} />
      </div>

      {/* Previous / Next Navigation */}
      <div className="grid sm:grid-cols-2 gap-4 border-t pt-8">
        {prevItem ? (
          <Link href={prevItem.href} className="flex flex-col gap-2 p-4 rounded-lg border hover:border-primary/50 transition-colors">
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <ChevronLeft className="h-4 w-4" /> Previous
            </span>
            <span className="font-medium text-foreground">{prevItem.title}</span>
          </Link>
        ) : <div />}

        {nextItem ? (
          <Link href={nextItem.href} className="flex flex-col gap-2 p-4 rounded-lg border hover:border-primary/50 transition-colors sm:text-right">
            <span className="text-sm text-muted-foreground flex items-center sm:justify-end gap-1">
              Next <ChevronRight className="h-4 w-4" />
            </span>
            <span className="font-medium text-foreground">{nextItem.title}</span>
          </Link>
        ) : <div />}
      </div>
    </div>
  );
}
