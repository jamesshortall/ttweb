import { NextResponse, type NextRequest } from "next/server";
import { deviceFromUserAgent } from "@/lib/ads/device";

/**
 * Exposes the current path and a coarse device bucket to server components via
 * request headers, so <AdSlot> can apply page + device targeting without
 * per-page boilerplate and without client-side fingerprinting. Edge-safe.
 */
export function middleware(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set("x-pathname", request.nextUrl.pathname);
  headers.set("x-ad-device", deviceFromUserAgent(request.headers.get("user-agent")));
  return NextResponse.next({ request: { headers } });
}

export const config = {
  // Run on page routes only; skip static assets and Next internals.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images|robots.txt|sitemap.xml).*)"],
};
