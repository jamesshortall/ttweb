"use client";

import { useState } from "react";

/**
 * Accessible promo-code chip with copy-to-clipboard. Keyboard operable, with a
 * short "Copied" confirmation announced to assistive tech via aria-live.
 */
export function PromoCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — the code is still visible to copy manually.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-2 rounded-md border border-dashed border-navy-300 bg-white px-2.5 py-1 text-xs font-semibold text-navy-800 transition-colors hover:border-navy-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
      aria-label={`Copy promo code ${code}`}
    >
      <span className="font-mono tracking-wide">{code}</span>
      <span aria-hidden="true" className="text-navy-400">
        {copied ? "✓" : "⧉"}
      </span>
      <span className="sr-only" role="status" aria-live="polite">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </button>
  );
}
