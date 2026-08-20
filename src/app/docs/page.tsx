import Link from "next/link";
import { AlgoliaSearch } from "@/core/docs/components/AlgoliaSearch";

export default function DocsHomePage() {
  return (
    <div className="space-y-16 pb-16 pt-8 max-w-4xl">
      {/* Hero Section */}
      <div className="space-y-6">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
          Business OS Documentation
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Build, manage, publish, and scale websites with Business OS.
        </p>
        <div className="pt-4 w-full">
          <AlgoliaSearch />
        </div>
      </div>

      <hr className="border-border" />

      {/* GETTING STARTED */}
      <div className="space-y-6">
        <h2 className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">Getting Started</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/docs/getting-started/introduction" className="p-4 border rounded-xl hover:border-primary/50 hover:shadow-sm bg-card transition-all font-medium text-foreground">
            Introduction
          </Link>
          <Link href="/docs/getting-started" className="p-4 border rounded-xl hover:border-primary/50 hover:shadow-sm bg-card transition-all font-medium text-foreground">
            Quickstart
          </Link>
          <Link href="/docs/getting-started/workspace" className="p-4 border rounded-xl hover:border-primary/50 hover:shadow-sm bg-card transition-all font-medium text-foreground">
            Create Workspace
          </Link>
          <Link href="/docs/getting-started/create-website" className="p-4 border rounded-xl hover:border-primary/50 hover:shadow-sm bg-card transition-all font-medium text-foreground">
            Create Website
          </Link>
        </div>
      </div>

      {/* EXPLORE BUSINESS OS */}
      <div className="space-y-6">
        <h2 className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">Explore Business OS</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <Link href="/docs/workspace" className="p-4 border rounded-xl hover:border-primary/50 hover:shadow-sm bg-card transition-all font-medium text-foreground text-center">
            Workspace
          </Link>
          <Link href="/docs/builder" className="p-4 border rounded-xl hover:border-primary/50 hover:shadow-sm bg-card transition-all font-medium text-foreground text-center">
            Website Builder
          </Link>
          <Link href="/docs/cms" className="p-4 border rounded-xl hover:border-primary/50 hover:shadow-sm bg-card transition-all font-medium text-foreground text-center">
            CMS
          </Link>
          <Link href="/docs/themes" className="p-4 border rounded-xl hover:border-primary/50 hover:shadow-sm bg-card transition-all font-medium text-foreground text-center">
            Themes
          </Link>
          <Link href="/docs/media" className="p-4 border rounded-xl hover:border-primary/50 hover:shadow-sm bg-card transition-all font-medium text-foreground text-center">
            Media
          </Link>
          <Link href="/docs/seo" className="p-4 border rounded-xl hover:border-primary/50 hover:shadow-sm bg-card transition-all font-medium text-foreground text-center">
            SEO
          </Link>
          <Link href="/docs/domains" className="p-4 border rounded-xl hover:border-primary/50 hover:shadow-sm bg-card transition-all font-medium text-foreground text-center">
            Domains
          </Link>
          <Link href="/docs/analytics" className="p-4 border rounded-xl hover:border-primary/50 hover:shadow-sm bg-card transition-all font-medium text-foreground text-center">
            Analytics
          </Link>
          <Link href="/docs/forms" className="p-4 border rounded-xl hover:border-primary/50 hover:shadow-sm bg-card transition-all font-medium text-foreground text-center">
            Forms
          </Link>
          <Link href="/docs/billing" className="p-4 border rounded-xl hover:border-primary/50 hover:shadow-sm bg-card transition-all font-medium text-foreground text-center">
            Billing
          </Link>
        </div>
      </div>

      {/* PLATFORM */}
      <div className="space-y-6">
        <h2 className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">Platform</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link href="/docs/templates" className="p-4 border rounded-xl hover:border-primary/50 hover:shadow-sm bg-card transition-all font-medium text-foreground text-center">
            Templates
          </Link>
          <Link href="/docs/notifications" className="p-4 border rounded-xl hover:border-primary/50 hover:shadow-sm bg-card transition-all font-medium text-foreground text-center">
            Notifications
          </Link>
          <Link href="/docs/support" className="p-4 border rounded-xl hover:border-primary/50 hover:shadow-sm bg-card transition-all font-medium text-foreground text-center">
            Support
          </Link>
          <Link href="/docs/admin" className="p-4 border rounded-xl hover:border-primary/50 hover:shadow-sm bg-card transition-all font-medium text-foreground text-center">
            Administration
          </Link>
        </div>
      </div>

      {/* DEVELOPER */}
      <div className="space-y-6">
        <h2 className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">Developer</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          <Link href="/docs/developer/architecture" className="p-4 border rounded-xl hover:border-primary/50 hover:shadow-sm bg-card transition-all font-medium text-foreground text-center">
            Architecture
          </Link>
          <Link href="/docs/developer/api" className="p-4 border rounded-xl hover:border-primary/50 hover:shadow-sm bg-card transition-all font-medium text-foreground text-center">
            API
          </Link>
          <Link href="/docs/developer/database" className="p-4 border rounded-xl hover:border-primary/50 hover:shadow-sm bg-card transition-all font-medium text-foreground text-center">
            Database
          </Link>
          <Link href="/docs/configuration" className="p-4 border rounded-xl hover:border-primary/50 hover:shadow-sm bg-card transition-all font-medium text-foreground text-center">
            Configuration
          </Link>
          <Link href="/docs/deployment" className="p-4 border rounded-xl hover:border-primary/50 hover:shadow-sm bg-card transition-all font-medium text-foreground text-center">
            Deployment
          </Link>
        </div>
      </div>
    </div>
  );
}
