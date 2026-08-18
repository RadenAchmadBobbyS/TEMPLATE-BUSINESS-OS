import { betterFetch } from "@better-fetch/fetch";
import type { Session } from "better-auth/types";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get("host") || url.hostname;

  // Define our application's native hostnames (this should normally come from env variables)
  const baseAppDomain = process.env.NEXT_PUBLIC_APP_URL?.replace(/^https?:\/\//, '') || "localhost:3000";
  const isAppDomain = hostname === baseAppDomain || hostname === `www.${baseAppDomain}`;
  const isRootLocalHost = hostname === "localhost:3000" || hostname === "127.0.0.1:3000";

  const isInternalHost = isRootLocalHost || isAppDomain;
  const isSubdomain = hostname.endsWith(`.${baseAppDomain}`) && !isInternalHost;
  const isLocalSubdomain = hostname.endsWith(".localhost:3000") && !isInternalHost;

  // If this is a request to a custom domain or subdomain
  if (!isInternalHost) {
    // 1. Fetch redirects for this hostname
    try {
      const res = await fetch(new URL(`/api/edge/routing?hostname=${hostname}`, request.url).toString());
      if (res.ok) {
        const data = await res.json();
        if (data && data.redirects && data.redirects.length > 0) {
          const matchedRule = data.redirects.find((r: any) => r.source === url.pathname || (r.source === '/' && url.pathname === ''));
          if (matchedRule) {
            // Apply Redirect
            return NextResponse.redirect(new URL(matchedRule.destination, request.url), { status: matchedRule.permanent ? 301 : 302 });
          }
        }
      }
    } catch (e) {
      console.error("PROXY_REDIRECT_FETCH_ERROR", e);
    }

    // 2. Rewrite
    if (isSubdomain || isLocalSubdomain) {
      const rootToReplace = isSubdomain ? `.${baseAppDomain}` : ".localhost:3000";
      const subdomain = hostname.replace(rootToReplace, "");
      return NextResponse.rewrite(new URL(`/p/${subdomain}${url.pathname}`, request.url));
    }
    // Rewrite to our custom domain handler
    return NextResponse.rewrite(new URL(`/p/_custom_domain_/${hostname}${url.pathname}`, request.url));
  }

  // OTHERWISE, handle normal internal routing and authentication
  const path = url.pathname;

  // Identify public routes vs protected routes
  const isAuthPage = path === "/login" || path === "/register" || path === "/forgot-password" || path === "/reset-password";
  const isLandingPage = path === "/";
  const isPublicRoute = isAuthPage || isLandingPage || path.startsWith("/invitations/") || path.startsWith("/p/") || path.startsWith("/docs");
  
  const requiresAuth = !isPublicRoute;

  if (requiresAuth || isAuthPage || isLandingPage) {
    const { data: session } = await betterFetch<Session>(
      "/api/auth/get-session",
      {
        baseURL: request.nextUrl.origin,
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      }
    );

    if (requiresAuth && !session) {
      // Preserve the requested path
      const loginUrl = new URL("/login", request.url);
      if (path !== "/dashboard") {
        loginUrl.searchParams.set("callbackUrl", path);
      }
      return NextResponse.redirect(loginUrl);
    }

    if (session && (isAuthPage || isLandingPage)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
