"use client";

import Script from "next/script";
import { analyticsConfig } from "@/lib/site-config";
import { useAnalyticsConsent } from "@/lib/hooks";

/**
 * Consent-gated analytics loader.
 *
 * Nothing is injected unless a provider is configured via environment
 * variables AND either (a) the visitor accepted analytics, or (b) the
 * provider is explicitly configured as cookieless
 * (NEXT_PUBLIC_ANALYTICS_COOKIELESS=true), which relaxes the consent gate.
 */
export function Analytics() {
  const consented = useAnalyticsConsent();

  if (!analyticsConfig.enabled) return null;
  const allowed = analyticsConfig.cookieless || consented;
  if (!allowed) return null;

  if (analyticsConfig.provider === "plausible") {
    return (
      <Script
        strategy="afterInteractive"
        src="https://plausible.io/js/script.js"
        data-domain={analyticsConfig.id}
      />
    );
  }

  if (analyticsConfig.provider === "google") {
    return (
      <>
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(analyticsConfig.id)}`}
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${analyticsConfig.id}', { anonymize_ip: true });`}
        </Script>
      </>
    );
  }

  return null;
}
