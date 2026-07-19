"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { RenderableAd, ResolveResponse } from "@/lib/ads/dto";
import { AdDisclosure } from "./AdDisclosure";
import { AdImpressionTracker } from "./AdImpressionTracker";
import { ResponsiveImageAd } from "./ResponsiveImageAd";
import { TextAd } from "./TextAd";
import { VideoAd } from "./VideoAd";
import { HtmlEmbedAd } from "./HtmlEmbedAd";
import { PromoCode } from "./PromoCode";

/**
 * The single entry point pages use to request an advertisement by placement key:
 *
 *   <AdSlot placement="points-101-inline" />
 *
 * Client-fetch design: the host page stays fully static/ISR and ships without
 * ads; this slot fetches an eligible ad from /api/ads/resolve after mount, where
 * targeting, creative selection, and click-URL signing all happen server-side.
 * It renders NOTHING — no wrapper, no gap — while loading and when no ad is
 * eligible, so empty placements collapse completely.
 */
export function AdSlot({
  placement,
  className,
  priority = false,
}: {
  placement: string;
  className?: string;
  /** Set for above-the-fold slots so the creative loads eagerly. */
  priority?: boolean;
}) {
  const [ad, setAd] = useState<RenderableAd | null>(null);
  const [track, setTrack] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const path = typeof window !== "undefined" ? window.location.pathname : "";
    const url = `/api/ads/resolve?placement=${encodeURIComponent(placement)}&path=${encodeURIComponent(path)}`;

    fetch(url, { headers: { accept: "application/json" } })
      .then((res) => (res.ok ? (res.json() as Promise<ResolveResponse>) : null))
      .then((data) => {
        if (cancelled || !data) return;
        setAd(data.ad);
        setTrack(data.track);
      })
      .catch(() => {
        // Network/resolve failure must never break the page — stay collapsed.
      });

    return () => {
      cancelled = true;
    };
  }, [placement]);

  // Loading or nothing eligible → collapse entirely.
  if (!ad) return null;

  // Video and HTML embeds have their own interactive surface (controls, links),
  // so the media is NOT wrapped in the click anchor; those show a CTA below.
  const wrapInLink = ad.adType === "image" || ad.adType === "text";

  const media =
    ad.adType === "video" && ad.video ? (
      <VideoAd
        src={ad.video.src}
        poster={ad.video.poster}
        captionsUrl={ad.video.captionsUrl}
        title={ad.headline}
      />
    ) : ad.adType === "html" && ad.sanitizedHtml ? (
      <HtmlEmbedAd sanitizedHtml={ad.sanitizedHtml} title={ad.headline} />
    ) : ad.creative ? (
      <ResponsiveImageAd creative={ad.creative} headline={ad.headline} eager={priority} />
    ) : (
      <TextAd headline={ad.headline} description={ad.description} />
    );

  const ctaInline = ad.ctaLabel ? (
    <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-teal-700 group-hover:text-teal-600">
      {ad.ctaLabel}
      <span aria-hidden="true">→</span>
    </span>
  ) : null;

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
          pagePath: typeof window !== "undefined" ? window.location.pathname : undefined,
        }}
      >
        <div className="rounded-xl border border-porcelain-200 bg-porcelain-50 p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            {ad.disclosure.enabled ? <AdDisclosure label={ad.disclosure.label} /> : <span />}
          </div>

          {wrapInLink && ad.clickHref ? (
            <a
              href={ad.clickHref}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
            >
              {media}
              {ctaInline}
            </a>
          ) : (
            <div>
              {media}
              {ad.clickHref && ad.ctaLabel ? (
                <a
                  href={ad.clickHref}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="group mt-3 inline-flex items-center gap-1 rounded-full bg-navy-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-navy-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
                >
                  {ad.ctaLabel}
                  <span aria-hidden="true">→</span>
                </a>
              ) : null}
            </div>
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
