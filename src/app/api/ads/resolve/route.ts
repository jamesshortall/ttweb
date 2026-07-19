import { NextResponse, type NextRequest } from "next/server";
import { resolveAd } from "@/lib/ads/resolve";
import { pickCreative } from "@/lib/ads/select";
import { buildClickHref, isSafeHttpUrl } from "@/lib/ads/url";
import { sanitizeAdHtml } from "@/lib/ads/sanitize-html";
import { adConfig } from "@/lib/ads/config";
import { deviceFromUserAgent } from "@/lib/ads/device";
import { createRateLimiter } from "@/lib/rate-limit";
import type { RenderableAd, ResolveResponse } from "@/lib/ads/dto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Ad resolution endpoint for the client <AdSlot>. Keeps content pages fully
 * static/ISR: the page ships without ads, and the slot fetches an eligible ad
 * here after mount. All targeting (device from UA, page from the caller's path),
 * creative selection, and click-URL signing happen server-side; only the
 * minimal RenderableAd DTO crosses to the browser.
 */

const limiter = createRateLimiter({ limit: 120, windowMs: 60 * 1000 });

const EMPTY: ResolveResponse = { ad: null, track: false };

function clientIp(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

function noStore(body: ResolveResponse) {
  return NextResponse.json(body, { headers: { "Cache-Control": "no-store" } });
}

export async function GET(request: NextRequest) {
  const placement = request.nextUrl.searchParams.get("placement");
  if (!placement) return noStore(EMPTY);
  if (!limiter.check(clientIp(request))) return noStore(EMPTY);

  const device = deviceFromUserAgent(request.headers.get("user-agent"));
  const pagePath = request.nextUrl.searchParams.get("path") ?? "";
  const cfg = adConfig();

  const ad = await resolveAd({
    placementKey: placement,
    device,
    pagePath,
    preview: cfg.previewMode,
    now: new Date(),
  });

  if (!ad) return noStore({ ad: null, track: !cfg.previewMode });

  const creative = ad.adType === "image" ? pickCreative(ad, device) : null;
  const video =
    ad.adType === "video" && isSafeHttpUrl(ad.videoUrl)
      ? {
          src: ad.videoUrl as string,
          poster: ad.videoPoster,
          captionsUrl: ad.videoCaptionsUrl,
        }
      : undefined;
  // HTML is sanitized server-side; the browser only ever gets safe markup.
  const sanitizedHtml =
    ad.adType === "html" ? sanitizeAdHtml(ad.html) || undefined : undefined;

  const renderable: RenderableAd = {
    id: ad.id,
    campaignId: ad.campaignId,
    advertiserId: ad.advertiserId,
    adType: ad.adType,
    headline: ad.headline,
    description: ad.description,
    creative: creative
      ? { src: creative.src, alt: creative.alt, width: creative.width, height: creative.height }
      : null,
    video,
    sanitizedHtml,
    ctaLabel: ad.ctaLabel,
    disclosure: ad.disclosure,
    promoCode: ad.promoCode,
    clickHref: buildClickHref(ad, cfg.redirectSigningSecret),
  };

  return noStore({ ad: renderable, track: !cfg.previewMode });
}
