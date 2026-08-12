import Link from "next/link";
import {
  Globe, Layers, BarChart3, Search, Rocket,
  Image as ImageIcon, Sparkles, ArrowRight, ArrowUpRight,
  Database, Layout as LayoutIcon,
} from "lucide-react";
import { FadeIn, Reveal, StaggerContainer, StaggerItem } from "@/shared/ui/motion";
import { GridBackdrop, CornerMarks, BlueprintLogo } from "@/shared/ui/blueprint";

const features = [
  {
    icon: LayoutIcon,
    tag: "BUILD",
    title: "Visual Website Builder",
    description: "Drag-and-drop editor with real-time preview. Build professional pages without writing code.",
  },
  {
    icon: Sparkles,
    tag: "AI",
    title: "AI-Powered Tools",
    description: "Generate content, optimize SEO, and automate workflows with built-in AI capabilities.",
  },
  {
    icon: Database,
    tag: "DATA",
    title: "Headless CMS",
    description: "Create custom content models for blogs, products, testimonials — any structured data you need.",
  },
  {
    icon: BarChart3,
    tag: "TRACK",
    title: "Advanced Analytics",
    description: "Track visitors, conversions, funnels, and goals. Make data-driven decisions for your business.",
  },
  {
    icon: Search,
    tag: "RANK",
    title: "SEO Management",
    description: "Meta tags, Open Graph, sitemaps, redirects, and structured data — all from one dashboard.",
  },
  {
    icon: Globe,
    tag: "ROUTE",
    title: "Custom Domains",
    description: "Connect your own domain with automatic SSL. Manage DNS verification and routing seamlessly.",
  },
  {
    icon: Rocket,
    tag: "SHIP",
    title: "One-Click Publishing",
    description: "Deploy your website globally with a single click. Track deployments and roll back instantly.",
  },
  {
    icon: ImageIcon,
    tag: "ASSET",
    title: "Media Library",
    description: "Upload, organize, search, and process images with folders, favorites, and format conversion.",
  },
];

const workflow = [
  { step: "Create", description: "Start with a template or blank canvas" },
  { step: "Design", description: "Build pages with the visual editor" },
  { step: "Manage", description: "Add content, media, and navigation" },
  { step: "Publish", description: "Deploy to your custom domain" },
  { step: "Analyze", description: "Track traffic and conversions" },
  { step: "Grow", description: "Optimize and scale your business" },
];

const stats = [
  { label: "Websites Built", value: "10k+" },
  { label: "Uptime SLA", value: "99.9%" },
  { label: "Avg. Deploy", value: "<3s" },
  { label: "Global CDN", value: "50+" },
];



export default function LandingPage() {
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "var(--paper)",
        color: "var(--ink)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Navigation */}
      <nav
        className="sticky top-0 z-50 border-b backdrop-blur-lg"
        style={{ borderColor: "var(--line)", backgroundColor: "rgba(247,245,241,0.85)" }}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <BlueprintLogo />

          <div
            className="hidden items-center gap-8 text-sm md:flex font-data" style={{ fontSize: "13px" }}
          >
            {["Features", "How It Works", "Pricing"].map((label, i) => (
              <a
                key={label}
                href={i === 0 ? "#features" : i === 1 ? "#workflow" : "#cta"}
                className="flex items-center gap-1.5 transition-colors hover:opacity-100"
                style={{ color: "var(--slate)" }}
              >
                <span style={{ color: "var(--signal)" }}>0{i + 1}</span>
                {label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden text-sm font-medium sm:inline-flex"
              style={{ color: "var(--slate)" }}
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: "var(--ink)", color: "var(--paper)" }}
            >
              Get Started
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <GridBackdrop />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6 sm:pb-24 sm:pt-28 lg:px-8">
          <StaggerContainer className="mx-auto max-w-3xl text-center">
            <StaggerItem
              className="mb-6 inline-flex items-center gap-2 border px-3 py-1 text-xs"
              style={{
                borderColor: "var(--line)",
                color: "var(--slate)",
                fontFamily: "'IBM Plex Mono', monospace",
              }}
            >
              <span className="h-1.5 w-1.5" style={{ backgroundColor: "var(--amber)" }} />
              ALL-IN-ONE BUSINESS PLATFORM
            </StaggerItem>
            <StaggerItem>
              <h1
                className="text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl font-display"
              >
                Build, manage, publish, and{" "}
                <span style={{ color: "var(--signal)" }}>grow your business</span>{" "}
                from one platform.
              </h1>
            </StaggerItem>
            <StaggerItem>
              <p
                className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed"
                style={{ color: "var(--slate)" }}
              >
                BusinessOS combines a visual website builder, headless CMS, analytics, SEO tools,
                custom domains, and more — everything you need to establish and grow your online presence.
              </p>
            </StaggerItem>
            <StaggerItem className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex h-12 items-center gap-2 px-8 text-sm font-medium transition-transform hover:-translate-y-0.5"
                style={{ backgroundColor: "var(--signal)", color: "#fff" }}
              >
                Start Building
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#features"
                className="inline-flex h-12 items-center gap-2 border px-8 text-sm font-medium transition-colors hover:bg-[var(--ink)]/5"
                style={{ borderColor: "var(--ink)" }}
              >
                Explore Platform
              </a>
            </StaggerItem>
          </StaggerContainer>

          {/* Blueprint canvas mockup — signature element */}
          <Reveal delay={0.2} className="relative mx-auto mt-16 max-w-5xl">
            <div
              className="relative overflow-hidden border"
              style={{ borderColor: "var(--ink)", backgroundColor: "#fff" }}
            >
              <CornerMarks />
              {/* Ruler top bar */}
              <div
                className="flex h-9 items-center gap-3 border-b px-4 font-data" style={{ borderColor: "var(--line)", fontSize: "11px", color: "var(--slate)" }}
              >
                <span>index.tsx</span>
                <span className="ml-auto flex items-center gap-1" style={{ color: "var(--amber)" }}>
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "var(--amber)" }} />
                  editing
                </span>
              </div>
              <div className="relative flex">
                <div
                  className="hidden w-56 border-r p-4 md:block"
                  style={{ borderColor: "var(--line)" }}
                >
                  <div
                    className="mb-4 text-[11px] uppercase tracking-wider font-data" style={{ color: "var(--slate)" }}
                  >
                    Layers
                  </div>
                  {["Header", "Hero Block", "Feature Grid", "CTA", "Footer"].map((item, i) => (
                    <div
                      key={item}
                      className="mb-2 flex items-center gap-2 border-l-2 px-3 py-2 text-xs"
                      style={{
                        borderColor: i === 1 ? "var(--signal)" : "transparent",
                        backgroundColor: i === 1 ? "rgba(36,81,255,0.06)" : "transparent",
                        color: i === 1 ? "var(--ink)" : "var(--slate)",
                      }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
                <div className="relative flex-1 p-6" style={{ backgroundColor: "var(--paper)" }}>
                  <GridBackdrop />
                  <div className="relative space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="h-6 w-40" style={{ backgroundColor: "rgba(20,23,31,0.08)" }} />
                      <div
                        className="flex items-center gap-1.5 border px-2 py-1 text-[10px] font-data" style={{ borderColor: "var(--line)", color: "var(--signal)" }}
                      >
                        x:240 y:80
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="h-16 border"
                          style={{
                            borderColor: i === 2 ? "var(--signal)" : "var(--line)",
                            borderStyle: i === 2 ? "dashed" : "solid",
                            backgroundColor: "#fff",
                          }}
                        />
                      ))}
                    </div>
                    <div className="h-24 border" style={{ borderColor: "var(--line)", backgroundColor: "#fff" }} />
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t py-20 sm:py-28" style={{ borderColor: "var(--line)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span
              className="text-xs font-data" style={{ color: "var(--signal)" }}
            >
              // 02 — FEATURES
            </span>
            <h2
              className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl font-display"
            >
              Everything you need to run your business online
            </h2>
            <p className="mt-4 text-lg" style={{ color: "var(--slate)" }}>
              One platform replaces dozens of tools — build, publish, manage content,
              track analytics, and optimize for search from a single dashboard.
            </p>
          </div>
          <StaggerContainer className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-4" style={{ backgroundColor: "var(--line)" }}>
            {features.map((feature) => (
              <StaggerItem
                key={feature.title}
                className="group relative p-6 transition-colors"
                style={{ backgroundColor: "var(--paper)" }}
              >
                <div className="mb-4 flex items-center justify-between">
                  <div
                    className="flex h-10 w-10 items-center justify-center border transition-colors group-hover:text-white"
                    style={{ borderColor: "var(--ink)" }}
                  >
                    <feature.icon className="h-4.5 w-4.5" style={{ color: "var(--ink)" }} />
                  </div>
                  <span
                    className="text-[10px] font-data" style={{ color: "var(--slate)" }}
                  >
                    {feature.tag}
                  </span>
                </div>
                <h3 className="mb-2 font-semibold font-display">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--slate)" }}>
                  {feature.description}
                </p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Workflow */}
      <section id="workflow" className="border-t py-20 sm:py-28" style={{ borderColor: "var(--line)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span
              className="text-xs font-data" style={{ color: "var(--signal)" }}
            >
              // 03 — PIPELINE
            </span>
            <h2
              className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl font-display"
            >
              From idea to launch in minutes
            </h2>
          </div>
          <div className="relative mx-auto mt-16 max-w-5xl">
            <div
              className="absolute left-0 right-0 top-6 hidden h-px sm:block"
              style={{ backgroundColor: "var(--line)" }}
            />
            <StaggerContainer className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
              {workflow.map((item, i) => (
                <StaggerItem key={item.step} className="relative text-center">
                  <div
                    className="relative z-10 mx-auto mb-3 flex h-12 w-12 items-center justify-center border-2 text-xs font-semibold"
                    style={{
                      borderColor: "var(--ink)",
                      backgroundColor: "var(--paper)",
                      fontFamily: "'IBM Plex Mono', monospace",
                    }}
                  >
                    0{i + 1}
                  </div>
                  <h3 className="text-sm font-semibold font-display">
                    {item.step}
                  </h3>
                  <p className="mt-1 text-xs" style={{ color: "var(--slate)" }}>
                    {item.description}
                  </p>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="border-t py-20 sm:py-28" style={{ borderColor: "var(--line)" }}>
        <Reveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span
                className="text-xs font-data" style={{ color: "var(--signal)" }}
              >
                // 04 — CAPABILITIES
              </span>
              <h2
                className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl font-display"
              >
                Built for modern businesses
              </h2>
              <p className="mt-4 text-lg" style={{ color: "var(--slate)" }}>
                Whether you&apos;re a startup, agency, or enterprise — BusinessOS adapts to your workflow
                with workspaces, team collaboration, and granular permissions.
              </p>
              <div className="mt-8 space-y-3">
                {[
                  "Multi-workspace support with team collaboration",
                  "Role-based access control and permissions",
                  "Stripe-powered billing with usage tracking",
                  "Support ticket system with admin console",
                  "Real-time notifications and activity tracking",
                  "Template library for quick-start projects",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 border-b py-2" style={{ borderColor: "var(--line)" }}>
                    <span className="mt-1 h-1.5 w-1.5 shrink-0" style={{ backgroundColor: "var(--signal)" }} />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative border p-8" style={{ borderColor: "var(--ink)" }}>
              <CornerMarks />
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div
                      className="text-3xl font-semibold font-display" style={{ color: "var(--signal)" }}
                    >
                      {stat.value}
                    </div>
                    <div
                      className="mt-1 text-xs font-data" style={{ color: "var(--slate)" }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* CTA */}
      <section id="cta" className="border-t py-20 sm:py-28" style={{ borderColor: "var(--line)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal
            className="relative overflow-hidden px-8 py-16 text-center sm:px-16"
            style={{ backgroundColor: "var(--ink)" }}
          >
            <GridBackdrop />
            <h2
              className="relative text-3xl font-semibold tracking-tight sm:text-4xl font-display" style={{ color: "var(--paper)" }}
            >
              Build your business presence with BusinessOS
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-lg" style={{ color: "rgba(247,245,241,0.7)" }}>
              Join thousands of businesses that use BusinessOS to create, manage, and grow their online presence.
            </p>
            <div className="relative mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex h-12 items-center gap-2 px-8 text-sm font-medium transition-transform hover:-translate-y-0.5"
                style={{ backgroundColor: "var(--signal)", color: "#fff" }}
              >
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex h-12 items-center gap-2 border px-8 text-sm font-medium"
                style={{ borderColor: "rgba(247,245,241,0.3)", color: "var(--paper)" }}
              >
                Sign In
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12" style={{ borderColor: "var(--line)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            <div>
              <h4 className="mb-4 text-sm font-semibold font-display">Product</h4>
              <ul className="space-y-2 text-sm" style={{ color: "var(--slate)" }}>
                <li><a href="#features" className="hover:opacity-100">Features</a></li>
                <li><a href="#workflow" className="hover:opacity-100">How It Works</a></li>
                <li><a href="#cta" className="hover:opacity-100">Pricing</a></li>
                <li><Link href="/register" className="hover:opacity-100">Get Started</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold font-display">Platform</h4>
              <ul className="space-y-2 text-sm" style={{ color: "var(--slate)" }}>
                <li><Link href="/dashboard" className="hover:opacity-100">Dashboard</Link></li>
                <li><Link href="/dashboard/templates" className="hover:opacity-100">Templates</Link></li>
                <li><Link href="/dashboard/media" className="hover:opacity-100">Media Library</Link></li>
                <li><Link href="/dashboard/billing" className="hover:opacity-100">Billing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold font-display">Resources</h4>
              <ul className="space-y-2 text-sm" style={{ color: "var(--slate)" }}>
                <li><Link href="/dashboard/support" className="hover:opacity-100">Support</Link></li>
                <li><a href="#features" className="hover:opacity-100">Documentation</a></li>
                <li><a href="#features" className="hover:opacity-100">API Reference</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold font-display">Legal</h4>
              <ul className="space-y-2 text-sm" style={{ color: "var(--slate)" }}>
                <li><a href="#" className="hover:opacity-100">Privacy Policy</a></li>
                <li><a href="#" className="hover:opacity-100">Terms of Service</a></li>
                <li><a href="#" className="hover:opacity-100">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row" style={{ borderColor: "var(--line)" }}>
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center" style={{ backgroundColor: "var(--ink)" }}>
                <span className="text-[10px] font-semibold font-data" style={{ color: "var(--paper)" }}>B/</span>
              </div>
              <span className="text-sm font-semibold font-display">BusinessOS</span>
            </div>
            <p className="text-sm font-data" style={{ color: "var(--slate)" }}>
              © {new Date().getFullYear()} BusinessOS. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}