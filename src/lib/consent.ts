/**
 * Cookie-consent state, shared by the banner, the preferences dialog, the
 * analytics loader, and third-party ad-network loading. Stored in localStorage
 * (a first-party, non-tracking preference) and mirrored through a browser event
 * so all listeners update without a reload.
 */

export const CONSENT_STORAGE_KEY = "tt-cookie-consent";
export const CONSENT_CHANGE_EVENT = "tt-consent-change";
export const CONSENT_OPEN_EVENT = "tt-consent-open";

export interface ConsentState {
  /** Nonessential analytics cookies/scripts. */
  analytics: boolean;
  /** Third-party advertising networks (e.g. AdSense). Defaults to false. */
  advertising: boolean;
  /** ISO timestamp of the decision, for future policy-version handling. */
  decidedAt: string;
}

export function readConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConsentState>;
    if (typeof parsed.analytics !== "boolean" || typeof parsed.decidedAt !== "string") {
      return null;
    }
    // `advertising` was added later; older stored decisions default it to false.
    return {
      analytics: parsed.analytics,
      advertising: parsed.advertising === true,
      decidedAt: parsed.decidedAt,
    };
  } catch {
    return null;
  }
}

export function writeConsent(analytics: boolean, advertising = false): ConsentState {
  const state: ConsentState = { analytics, advertising, decidedAt: new Date().toISOString() };
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage unavailable (private mode etc.) — treat as session-only consent.
  }
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: state }));
  return state;
}

/** Ask the consent UI to reopen (used by the footer "Cookie Preferences" link). */
export function openConsentPreferences(): void {
  window.dispatchEvent(new CustomEvent(CONSENT_OPEN_EVENT));
}
