import { PublicNavbar } from "@/core/public/components/PublicNavbar";
import { PublicFooter } from "@/core/public/components/PublicFooter";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "var(--paper)",
        color: "var(--ink)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <PublicNavbar />
      <main className="relative">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}
