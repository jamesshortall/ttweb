import { headers } from "next/headers";
import { resolveAd } from "@/lib/ads/resolve";
import { adConfig } from "@/lib/ads/config";
import { buildClickHref } from "@/lib/ads/url";
import { pickCreative } from "@/lib/ads/select";
import { deviceFromUserAgent } from "@/lib/ads/device";
import type { Device } from "@/lib/ads/types";
import { cn } from "@/lib/utils";
import { AdDisclosure } from "./AdDisclosure";
import { AdImpressionTracker } from "./AdImpressionTracker";
import { ResponsiveImageAd } from "./ResponsiveImageAd";
import { TextAd } from "./TextAd";
import { PromoCode } from "./PromoCode";

/**
 * The single entry point pages use to request an advertisement by placement key:
 *
 *   <AdSlot placement="points-101-inline" />
 *
 * It resolves an eligible ad server-side, renders the right creative type, wires
 * viewability-aware impression + click tracking, and — crucially — renders
 * NOTHING (collapses entirely, no wrapper, no gap) when no ad is eligible.
 */

const DEVICES: Device[] = ["desktop", "tablet", "mobile", "unknown"];

function readDevice(headerValue: string | null, userAgent: string | null): Device {
  if (headerValue && (DEVICES as string[]).includes(headerValue)) return headerValue as Device;
  return deviceFromUserAgent(userAgent);
}

export async function AdSlot({
  placement,
  className,
  priority = false,
}: {
  placement: string;
  className?: string;
  /** Set for above-the-fold slots so the creative loads eagerly. */
  priority?: boolean;
}) {
  const h = await headers();
  const userAgent = h.get("user-agent");
  const device = readDevice(h.get("x-ad-device"), userAgent);
  const pagePath = h.get("x-pathname") ?? "";
  const cfg = adConfig();

  const ad = await resolveAd({
    placementKey: placement,
    device,
    pagePath,
    preview: cfg.previewMode,
    now: new Date(),
  });

  // Empty-placement behavior: collapse completely.
  if (!ad) return null;

  const clickHref = buildClickHref(ad, cfg.redirectSigningSecret);
  const creative = ad.adType === "image" ? pickCreative(ad, device) : null;
  const track = !cfg.previewMode;

  const body = (
    <>
      {creative ? (
        <ResponsiveImageAd creative={creative} headline={ad.headline} eager={priority} />
      ) : (
        <TextAd ad={ad} />
      )}
      {ad.ctaLabel ? (
        <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-teal-700 group-hover:text-teal-600">
          {ad.ctaLabel}
          <span aria-hidden="true">→</span>
        </span>
      ) : null}
    </>
  );

  return (
    <aside
      aria-label="Sponsored"
      data-ad-placement={placement}
      className={cn("not-prose my-6", className)}
    >
      <AdImpressionTracker
        track={track}
        payload={{
          adId: ad.id,
          campaignId: ad.campaignId,
          advertiserId: ad.advertiserId,
          placementKey: placement,
          pagePath: pagePath || undefined,
        }}
      >
        <div className="rounded-xl border border-porcelain-200 bg-porcelain-50 p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            {ad.disclosure.enabled ? <AdDisclosure label={ad.disclosure.label} /> : <span />}
          </div>

          {clickHref ? (
            <a
              href={clickHref}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
            >
              {body}
            </a>
          ) : (
            <div>{body}</div>
          )}

          {ad.promoCode ? (
            <div className="mt-3">
              <PromoCode code={ad.promoCode} />
            </div>
          ) : null}
        </div>
      </AdImpressionTracker>
    </aside>
  );
}
