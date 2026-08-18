import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { ArrowRight, BookOpen, Layout, FileText, Globe, LineChart, Code } from "lucide-react";

export default function DocsHomePage() {
  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <div className="space-y-6">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
          Business OS Documentation
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
          Build, manage, publish, and scale websites with Business OS.
          Everything you need to build websites, manage content, connect domains, analyze traffic, and operate your business.
        </p>
        <div className="flex flex-wrap gap-4 pt-4">
          <Button size="lg" asChild>
            <Link href="/docs/getting-started/quickstart">
              Quickstart <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/docs/developer/overview">
              Developer API <Code className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Start Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/docs/getting-started/introduction" className="group border rounded-xl p-6 hover:border-primary/50 hover:bg-muted/30 transition-all">
          <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Getting Started</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Create your workspace and build your first website.
          </p>
        </Link>
        
        <Link href="/docs/website-builder/overview" className="group border rounded-xl p-6 hover:border-primary/50 hover:bg-muted/30 transition-all">
          <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
            <Layout className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Website Builder</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Learn how to build pages using the visual builder.
          </p>
        </Link>

        <Link href="/docs/cms/overview" className="group border rounded-xl p-6 hover:border-primary/50 hover:bg-muted/30 transition-all">
          <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">CMS</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Create dynamic content and collections.
          </p>
        </Link>

        <Link href="/docs/domains-hosting/custom-domains" className="group border rounded-xl p-6 hover:border-primary/50 hover:bg-muted/30 transition-all">
          <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
            <Globe className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Custom Domains</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Connect your own domain and publish your website.
          </p>
        </Link>

        <Link href="/docs/analytics/overview" className="group border rounded-xl p-6 hover:border-primary/50 hover:bg-muted/30 transition-all">
          <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
            <LineChart className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Analytics</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Understand visitors, sessions, and pageviews.
          </p>
        </Link>

        <Link href="/docs/developer/overview" className="group border rounded-xl p-6 hover:border-primary/50 hover:bg-muted/30 transition-all">
          <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
            <Code className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Developer</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Integrate Business OS into your development workflow.
          </p>
        </Link>
      </div>
    </div>
  );
}
