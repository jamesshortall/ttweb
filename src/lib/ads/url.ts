import { createHmac, timingSafeEqual } from "node:crypto";
import type { Advertisement, ReferralParams } from "@/lib/ads/types";

/**
 * URL safety + tracked click construction.
 *
 * Two hard rules enforced here and again at redirect time:
 *  1. Only http(s) destinations. javascript:, data:, and custom schemes are
 *     rejected — an ad with an unsafe URL can never activate or redirect.
 *  2. Clicks route through a signed, tamper-proof token so the destination
 *     cannot be swapped by editing the visible href.
 */

const SAFE_SCHEMES = new Set(["http:", "https:"]);

export function isSafeHttpUrl(value: string | undefined | null): boolean {
  if (!value) return false;
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return false;
  }
  return SAFE_SCHEMES.has(parsed.protocol);
}

/** Parse the CMS "key=value" per-line custom params into safe entries. */
export function parseCustomParams(raw: string | undefined): [string, string][] {
  if (!raw) return [];
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line): [string, string] | null => {
      const eq = line.indexOf("=");
      if (eq <= 0) return null;
      const key = line.slice(0, eq).trim();
      const val = line.slice(eq + 1).trim();
      return key ? [key, val] : null;
    })
    .filter((entry): entry is [string, string] => entry !== null);
}

/**
 * Append UTM + referral parameters to a destination URL. Never overwrites a
 * parameter the destination already specifies. Returns the input unchanged if
 * it is not a safe http(s) URL (the caller validates separately).
 */
export function appendReferralParams(
  destinationUrl: string,
  referral: ReferralParams | undefined,
): string {
  if (!isSafeHttpUrl(destinationUrl)) return destinationUrl;
  const url = new URL(destinationUrl);
  const setIfAbsent = (key: string, value: string | undefined) => {
    if (value && !url.searchParams.has(key)) url.searchParams.set(key, value);
  };
  setIfAbsent("utm_source", referral?.utmSource);
  setIfAbsent("utm_medium", referral?.utmMedium);
  setIfAbsent("utm_campaign", referral?.utmCampaign);
  setIfAbsent("utm_content", referral?.utmContent);
  setIfAbsent("utm_term", referral?.utmTerm);
  setIfAbsent("ref", referral?.referralId);
  for (const [key, value] of parseCustomParams(referral?.customParams)) {
    setIfAbsent(key, value);
  }
  return url.toString();
}

/** The final destination a click should land on, with tracking params applied. */
export function buildDestinationUrl(ad: Advertisement): string | null {
  if (!ad.destinationUrl || !isSafeHttpUrl(ad.destinationUrl)) return null;
  return appendReferralParams(ad.destinationUrl, ad.referral);
}

// ── Signed click tokens ──────────────────────────────────────────────────────

export interface ClickTokenPayload {
  /** Final destination (already tracked). */
  u: string;
  ad: string;
  cmp?: string;
  adv?: string;
  pl: string;
}

function base64url(input: Buffer | string): string {
  return Buffer.from(input).toString("base64url");
}

function sign(data: string, secret: string): string {
  return createHmac("sha256", secret).update(data).digest("base64url");
}

export function encodeClickToken(payload: ClickTokenPayload, secret: string): string {
  const body = base64url(JSON.stringify(payload));
  return `${body}.${sign(body, secret)}`;
}

export function decodeClickToken(token: string, secret: string): ClickTokenPayload | null {
  const dot = token.indexOf(".");
  if (dot <= 0) return null;
  const body = token.slice(0, dot);
  const providedSig = token.slice(dot + 1);
  const expectedSig = sign(body, secret);
  const a = Buffer.from(providedSig);
  const b = Buffer.from(expectedSig);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as ClickTokenPayload;
    // Re-validate the destination on the way out — defense in depth.
    if (!isSafeHttpUrl(payload.u)) return null;
    return payload;
  } catch {
    return null;
  }
}

/**
 * The href a rendered ad should link to.
 * - With a signing secret: a same-origin `/api/ads/click` URL that records the
 *   click, then redirects to the validated destination.
 * - Without a secret: the direct (validated) destination, so ads still work —
 *   click tracking is simply off until a secret is configured.
 * Returns null when the ad has no safe destination (it must not render a link).
 */
export function buildClickHref(ad: Advertisement, secret: string | undefined): string | null {
  const destination = buildDestinationUrl(ad);
  if (!destination) return null;
  if (!secret) return destination;
  const token = encodeClickToken(
    {
      u: destination,
      ad: ad.id,
      cmp: ad.campaignId,
      adv: ad.advertiserId,
      pl: ad.placementKeys[0] ?? "",
    },
    secret,
  );
  return `/api/ads/click?t=${encodeURIComponent(token)}`;
}
