"use client";

import { useEffect, useRef } from "react";

/**
 * Viewability-aware impression tracking.
 *
 * Fires exactly one impression beacon once the ad has been at least 50% visible
 * for a continuous second — never merely because it exists in the server HTML.
 * Uses IntersectionObserver; sends via navigator.sendBeacon (falls back to
 * fetch keepalive). When `track` is false (preview mode) it renders the ad but
 * records nothing.
 */
export interface ImpressionPayload {
  adId: string;
  campaignId?: string;
  advertiserId?: string;
  placementKey: string;
  pagePath?: string;
}

const VIEWABLE_RATIO = 0.5;
const VIEWABLE_MS = 1000;

export function AdImpressionTracker({
  payload,
  track,
  children,
}: {
  payload: ImpressionPayload;
  track: boolean;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const firedRef = useRef(false);

  useEffect(() => {
    if (!track || firedRef.current) return;
    const el = ref.current;
    if (!el) return;

    const send = () => {
      if (firedRef.current) return;
      firedRef.current = true;
      const body = JSON.stringify(payload);
      try {
        if (navigator.sendBeacon) {
          navigator.sendBeacon("/api/ads/impression", new Blob([body], { type: "application/json" }));
          return;
        }
      } catch {
        // fall through to fetch
      }
      void fetch("/api/ads/impression", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    };

    if (typeof IntersectionObserver === "undefined") {
      // Very old browser: count once after a short settle delay.
      const t = window.setTimeout(send, VIEWABLE_MS);
      return () => window.clearTimeout(t);
    }

    let dwellTimer: ReturnType<typeof setTimeout> | null = null;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= VIEWABLE_RATIO) {
            if (dwellTimer === null) {
              dwellTimer = setTimeout(() => {
                send();
                observer.disconnect();
              }, VIEWABLE_MS);
            }
          } else if (dwellTimer !== null) {
            clearTimeout(dwellTimer);
            dwellTimer = null;
          }
        }
      },
      { threshold: [VIEWABLE_RATIO] },
    );
    observer.observe(el);

    return () => {
      if (dwellTimer !== null) clearTimeout(dwellTimer);
      observer.disconnect();
    };
  }, [track, payload]);

  return <div ref={ref}>{children}</div>;
}
