"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { analyticsConfig } from "@/lib/site-config";
import { CONSENT_OPEN_EVENT, writeConsent } from "@/lib/consent";
import { useConsentDecided } from "@/lib/hooks";
import { Button } from "@/components/ui/Button";

/**
 * Cookie-consent banner and preferences dialog.
 *
 * - Accept and Reject carry equal visual weight (no dark patterns).
 * - Nonessential analytics never load before an affirmative choice, unless
 *   the configured provider is cookieless AND the banner is configured off
 *   for it (NEXT_PUBLIC_ANALYTICS_COOKIELESS=true).
 * - The decision persists locally; the footer "Cookie Preferences" link
 *   reopens this UI at any time via a browser event.
 * - When no analytics are configured there is nothing nonessential to consent
 *   to, so the banner only appears when reopened from the footer.
 */
export function CookieConsent() {
  const decided = useConsentDecided();
  const [manuallyOpened, setManuallyOpened] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Banner is only required up front when consent-gated analytics exist.
  const consentRequired = analyticsConfig.enabled && !analyticsConfig.cookieless;
  const visible = manuallyOpened || (consentRequired && !decided);

  useEffect(() => {
    const onOpen = () => {
      setShowDetails(true);
      setManuallyOpened(true);
    };
    window.addEventListener(CONSENT_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (visible) dialogRef.current?.focus();
  }, [visible]);

  const decide = useCallback((analytics: boolean) => {
    writeConsent(analytics);
    setManuallyOpened(false);
    setShowDetails(false);
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-heading"
      aria-describedby="cookie-consent-description"
      tabIndex={-1}
      className="fixed inset-x-0 bottom-0 z-[90] border-t-4 border-sunset-500 bg-white shadow-[0_-8px_30px_rgba(15,43,54,0.15)]"
    >
      <div className="mx-auto max-w-4xl px-4 py-5 sm:px-6">
        <h2 id="cookie-consent-heading" className="font-display text-lg font-bold text-lagoon-950">
          Cookies and privacy
        </h2>
        <p id="cookie-consent-description" className="mt-2 text-sm leading-relaxed text-ink/80">
          This site uses essential functionality that stores no tracking cookies. With your
          permission, it also uses optional analytics cookies to understand which pages help
          visitors most. You can change your choice anytime via “Cookie Preferences” in the footer.
          See the{" "}
          <Link href="/privacy-policy" className="font-medium text-lagoon-700 underline">
            Privacy Policy
          </Link>{" "}
          for details.
        </p>

        {showDetails ? (
          <dl className="mt-4 space-y-3 rounded-xl bg-lagoon-50 p-4 text-sm">
            <div>
              <dt className="font-semibold text-lagoon-950">Essential</dt>
              <dd className="text-ink/75">
                Required for the site to work (for example, remembering this cookie choice). Always
                on; stores no tracking data.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-lagoon-950">Analytics (optional)</dt>
              <dd className="text-ink/75">
                {analyticsConfig.enabled
                  ? "Aggregate page-view statistics that help improve the site. Loaded only if you accept."
                  : "No analytics are currently configured on this site, so rejecting changes nothing."}
              </dd>
            </div>
          </dl>
        ) : null}

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button onClick={() => decide(true)}>Accept analytics</Button>
          <Button variant="secondary" onClick={() => decide(false)}>
            Reject nonessential
          </Button>
          {!showDetails ? (
            <button
              type="button"
              onClick={() => setShowDetails(true)}
              className="min-h-11 px-2 text-sm font-medium text-lagoon-700 underline underline-offset-4 hover:text-lagoon-900"
            >
              What&apos;s included?
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
