"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const CALENDLY_SCRIPT = "https://assets.calendly.com/assets/external/widget.js";
const CALENDLY_CSS = "https://assets.calendly.com/assets/external/widget.css";

declare global {
  interface Window {
    Calendly?: { initPopupWidget: (options: { url: string }) => void };
  }
}

/**
 * Lightweight Calendly integration: nothing from Calendly loads until the
 * visitor clicks (a Core Web Vitals requirement). The widget script is
 * injected on demand and the popup opens when ready; if anything fails, the
 * scheduling page opens directly as a fallback.
 *
 * When NEXT_PUBLIC_CALENDLY_URL is not configured, the button routes to the
 * contact form instead — no fake scheduling flow.
 */
export function CalendlyButton({
  label = "Schedule a Free Consultation",
  className,
}: {
  label?: string;
  className?: string;
}) {
  const [loading, setLoading] = useState(false);
  const url = siteConfig.calendlyUrl;

  const openCalendly = useCallback(() => {
    if (!url) return;
    if (window.Calendly) {
      window.Calendly.initPopupWidget({ url });
      return;
    }
    setLoading(true);

    if (!document.querySelector(`link[href="${CALENDLY_CSS}"]`)) {
      const css = document.createElement("link");
      css.rel = "stylesheet";
      css.href = CALENDLY_CSS;
      document.head.appendChild(css);
    }

    const script = document.createElement("script");
    script.src = CALENDLY_SCRIPT;
    script.async = true;
    script.onload = () => {
      setLoading(false);
      window.Calendly?.initPopupWidget({ url });
    };
    script.onerror = () => {
      setLoading(false);
      window.open(url, "_blank", "noopener,noreferrer");
    };
    document.head.appendChild(script);
  }, [url]);

  const classes = cn(
    "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-sunset-700 px-7 py-3.5 text-base font-semibold text-white shadow-md shadow-sunset-700/20 transition-colors hover:bg-sunset-800 disabled:opacity-70",
    className,
  );

  if (!url) {
    return (
      <Link href="/contact?topic=free-consultation" className={classes}>
        {label}
      </Link>
    );
  }

  return (
    <button type="button" onClick={openCalendly} disabled={loading} className={classes}>
      {loading ? "Opening scheduler…" : label}
    </button>
  );
}
