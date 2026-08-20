import Link from "next/link";

export function PublicFooter() {
  return (
    <footer className="border-t py-12" style={{ borderColor: "var(--line)" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div>
            <h4 className="font-display mb-4 text-sm font-semibold">Product</h4>
            <ul className="space-y-2 text-sm" style={{ color: "var(--slate)" }}>
              <li>
                <Link href="/showcase" className="hover:opacity-100">
                  Showcase
                </Link>
              </li>
              <li>
                <Link href="/templates" className="hover:opacity-100">
                  Templates
                </Link>
              </li>
              <li>
                <Link href="/plans" className="hover:opacity-100">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:opacity-100">
                  Get Started
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-display mb-4 text-sm font-semibold">Platform</h4>
            <ul className="space-y-2 text-sm" style={{ color: "var(--slate)" }}>
              <li>
                <Link href="/dashboard" className="hover:opacity-100">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/templates" className="hover:opacity-100">
                  My Templates
                </Link>
              </li>
              <li>
                <Link href="/dashboard/media" className="hover:opacity-100">
                  Media Library
                </Link>
              </li>
              <li>
                <Link href="/dashboard/billing" className="hover:opacity-100">
                  Billing
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-display mb-4 text-sm font-semibold">Resources</h4>
            <ul className="space-y-2 text-sm" style={{ color: "var(--slate)" }}>
              <li>
                <Link href="/dashboard/support" className="hover:opacity-100">
                  Support
                </Link>
              </li>
              <li>
                <Link href="/docs" className="hover:opacity-100">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/docs/developer" className="hover:opacity-100">
                  API Reference
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-display mb-4 text-sm font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm" style={{ color: "var(--slate)" }}>
              <li>
                <Link href="#" className="hover:opacity-100">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:opacity-100">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:opacity-100">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div
          className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row"
          style={{ borderColor: "var(--line)" }}
        >
          <div className="flex items-center gap-2">
            <div
              className="flex h-6 w-6 items-center justify-center"
              style={{ backgroundColor: "var(--ink)" }}
            >
              <span
                className="font-data text-[10px] font-semibold"
                style={{ color: "var(--paper)" }}
              >
                B/
              </span>
            </div>
            <span className="font-display text-sm font-semibold">BusinessOS</span>
          </div>
          <p className="font-data text-sm" style={{ color: "var(--slate)" }}>
            © {new Date().getFullYear()} BusinessOS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
