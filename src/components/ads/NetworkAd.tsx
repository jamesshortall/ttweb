"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import { adsConfig } from "@/lib/site-config";
import { useAdvertisingConsent } from "@/lib/hooks";

/**
 * Third-party ad-network unit (Google AdSense). The centralized network layer:
 * pages never embed network script tags directly — they request a placement and
 * this renders only when ALL of the following hold:
 *   1. networks are enabled (NEXT_PUBLIC_ADSENSE_ENABLED=true),
 *   2. a publisher client id is configured, and
 *   3. the visitor has granted ADVERTISING consent.
 * Otherwise it renders nothing, so no network script loads and the slot stays
 * clean. The loader script is injected once, lazily, and only under consent.
 */
export function NetworkAd({ slotId }: { slotId?: string }) {
  const consented = useAdvertisingConsent();
  const pushed = useRef(false);
  const clientId = adsConfig.adsenseClientId;

  const active = adsConfig.networksEnabled && clientId.length > 0 && consented;

  useEffect(() => {
    if (!active || pushed.current) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense not ready yet; the script's own retry will fill the slot.
    }
  }, [active]);

  if (!active) return null;

  return (
    <>
      <Script
        id="adsbygoogle-loader"
        strategy="afterInteractive"
        crossOrigin="anonymous"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(clientId)}`}
      />
      <ins
        className="adsbygoogle block"
        style={{ display: "block" }}
        data-ad-client={clientId}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </>
  );
}
