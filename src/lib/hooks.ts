"use client";

import { useCallback, useSyncExternalStore } from "react";
import { CONSENT_CHANGE_EVENT, readConsent } from "@/lib/consent";

const noop = () => {};
const emptySubscribe = () => noop;

/** True after hydration; false during SSR and the initial client render. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

/** True once the page has scrolled past `threshold` pixels (false on the server). */
export function useScrolled(threshold = 8): boolean {
  return useSyncExternalStore(
    (callback) => {
      window.addEventListener("scroll", callback, { passive: true });
      return () => window.removeEventListener("scroll", callback);
    },
    () => window.scrollY > threshold,
    () => false,
  );
}

function subscribeToMediaQuery(query: string, callback: () => void): () => void {
  const mql = window.matchMedia(query);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

/** Reactive prefers-reduced-motion (false on the server). */
export function useReducedMotion(): boolean {
  const subscribe = useCallback(
    (callback: () => void) => subscribeToMediaQuery("(prefers-reduced-motion: reduce)", callback),
    [],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

function subscribeToConsent(callback: () => void): () => void {
  window.addEventListener(CONSENT_CHANGE_EVENT, callback);
  return () => window.removeEventListener(CONSENT_CHANGE_EVENT, callback);
}

/** True when the visitor has accepted analytics cookies. */
export function useAnalyticsConsent(): boolean {
  return useSyncExternalStore(
    subscribeToConsent,
    () => readConsent()?.analytics === true,
    () => false,
  );
}

/** True when the visitor has made any consent decision (server assumes yes). */
export function useConsentDecided(): boolean {
  return useSyncExternalStore(
    subscribeToConsent,
    () => readConsent() !== null,
    () => true,
  );
}
