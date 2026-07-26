import { NextResponse, type NextRequest } from "next/server";
import { adConfig } from "@/lib/ads/config";
import { decodeClickToken, isSafeHttpUrl } from "@/lib/ads/url";
import { recordClick } from "@/lib/ads/events";
import { deviceFromUserAgent } from "@/lib/ads/device";
import { createRateLimiter } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Blunts click-inflation from a single source. */
const limiter = createRateLimiter({ limit: 60, windowMs: 60 * 1000 });

function clientIp(request: NextRequest): string | null {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
}

/** Same-origin page path the click came from, for per-page reporting. */
function refererPath(request: NextRequest): string | undefined {
  const referer = request.headers.get("referer");
  if (!referer) return undefined;
  try {
    return new URL(referer).pathname;
  } catch {
    return undefined;
  }
}

export async function GET(request: NextRequest) {
  const secret = adConfig().redirectSigningSecret;
  // Without a signing secret, ads link directly to their destination and this
  // route is never used — treat any hit as not found.
  if (!secret) return new NextResponse("Not found", { status: 404 });

  const token = request.nextUrl.searchParams.get("t");
  const payload = token ? decodeClickToken(token, secret) : null;
  if (!payload || !isSafeHttpUrl(payload.u)) {
    return new NextResponse("Invalid link", { status: 400 });
  }

  const ip = clientIp(request);
  const userAgent = request.headers.get("user-agent");

  // Rate-limited sources still redirect (never trap the visitor) but aren't counted.
  if (limiter.check(ip ?? "unknown")) {
    await recordClick(
      {
        adId: payload.ad,
        campaignId: payload.cmp,
        advertiserId: payload.adv,
        placementKey: payload.pl,
        pagePath: refererPath(request),
        device: deviceFromUserAgent(userAgent),
      },
      { ip, userAgent },
    );
  }

  return NextResponse.redirect(payload.u, 302);
}
