"use client";

import Link from "next/link";
import { ArrowUpRight, Menu } from "lucide-react";
import { BlueprintLogo } from "@/shared/ui/blueprint";
import { ThemeToggle } from "@/core/dashboard/components/ThemeToggle";
import { AlgoliaSearch } from "@/core/docs/components/AlgoliaSearch";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/shared/ui/sheet";
import { Button } from "@/shared/ui/button";

const navLinks = [
  { label: "Showcase", href: "/showcase" },
  { label: "Docs", href: "/docs" },
  { label: "Templates", href: "/templates" },
  { label: "Plans", href: "/plans" },
];

export function PublicNavbar() {
  return (
    <nav
      className="sticky top-0 z-50 border-b backdrop-blur-lg"
      style={{
        borderColor: "var(--line)",
        backgroundColor: "color-mix(in srgb, var(--paper) 85%, transparent)",
      }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6 lg:gap-10">
          <BlueprintLogo />
          
          <div
            className="font-data hidden items-center gap-8 text-sm md:flex"
            style={{ fontSize: "13px" }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="flex items-center gap-1.5 transition-colors hover:opacity-100"
                style={{ color: "var(--slate)" }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:block w-64">
            <AlgoliaSearch />
          </div>
          <ThemeToggle />
          <Link
            href="/login"
            className="hidden text-sm font-medium sm:inline-flex"
            style={{ color: "var(--slate)" }}
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-transform hover:-translate-y-0.5"
            style={{ backgroundColor: "var(--ink)", color: "var(--paper)" }}
          >
            Get Started
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger render={<Button variant="ghost" size="icon" className="h-9 w-9 p-0" />}>
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <SheetDescription className="sr-only">Access site pages and search documentation.</SheetDescription>
                <div className="flex flex-col gap-6 py-6">
                  <BlueprintLogo />
                  <div className="w-full">
                    <AlgoliaSearch />
                  </div>
                  <div className="flex flex-col gap-4 mt-4">
                    {navLinks.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="text-lg font-medium transition-colors hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                  <div className="flex flex-col gap-3 mt-6 pt-6 border-t border-border">
                    <Link href="/login">
                      <Button variant="outline" className="w-full justify-center">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button className="w-full justify-center">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
