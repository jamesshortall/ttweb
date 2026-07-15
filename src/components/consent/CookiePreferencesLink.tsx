"use client";

import { openConsentPreferences } from "@/lib/consent";

/** Footer control that reopens the cookie-consent preferences. */
export function CookiePreferencesLink({ className }: { className?: string }) {
  return (
    <button type="button" onClick={openConsentPreferences} className={className}>
      Cookie Preferences
    </button>
  );
}
