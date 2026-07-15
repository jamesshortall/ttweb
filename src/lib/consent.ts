/**
 * Cookie-consent state, shared by the banner, the preferences dialog, and the
 * analytics loader. Stored in localStorage (a first-party, non-tracking
 * preference) and mirrored through a browser event so all listeners update
 * without a reload.
 */

export const CONSENT_STORAGE_KEY = "tt-cookie-consent";
export const CONSENT_CHANGE_EVENT = "tt-consent-change";
export const CONSENT_OPEN_EVENT = "tt-consent-open";

export interface ConsentState {
  /** Nonessential analytics cookies/scripts. */
  analytics: boolean;
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
    return { analytics: parsed.analytics, decidedAt: parsed.decidedAt };
  } catch {
    return null;
  }
}

export function writeConsent(analytics: boolean): ConsentState {
  const state: ConsentState = { analytics, decidedAt: new Date().toISOString() };
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
