import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
        ],
      },
      {
        // Don't apply SAMEORIGIN to the builder endpoint so it can be previewed if necessary,
        // though typically we iframe the preview, so we might need to loosen it for public sites.
        // For public sites (/p/...), we want them to be iframeable only if allowed, but for now we remove X-Frame-Options
        source: "/p/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "ALLOWALL",
          }
        ]
      }
    ];
  },
};

export default nextConfig;
