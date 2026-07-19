import type { AdCreative, Advertisement, AdRequestContext, Device } from "@/lib/ads/types";
import { isSafeHttpUrl } from "@/lib/ads/url";
import { targetableDevice } from "@/lib/ads/device";

/**
 * Pure ad-selection logic — no I/O, fully deterministic when given an rng, so
 * every rule below is unit-tested. The resolver (resolve.ts) feeds it the
 * candidate ads; the component renders whatever it returns (or collapses).
 */

/** Statuses under which an ad may serve, subject to its schedule window. */
const SERVEABLE_STATUSES = new Set(["active", "scheduled"]);
/** Campaign statuses that don't block their ads. */
const SERVEABLE_CAMPAIGN_STATUSES = new Set(["active", "scheduled"]);

function withinSchedule(ad: Advertisement, now: Date): boolean {
  if (ad.startDate && new Date(ad.startDate).getTime() > now.getTime()) return false;
  if (ad.endDate && new Date(ad.endDate).getTime() <= now.getTime()) return false;
  return true;
}

function matchesDevice(ad: Advertisement, device: Device): boolean {
  if (ad.deviceTarget === "all") return true;
  return ad.deviceTarget === targetableDevice(device);
}

function matchesPage(ad: Advertisement, pagePath: string): boolean {
  if (ad.pageTargetMode === "all") return true;
  const listed = ad.pagePaths.includes(pagePath);
  return ad.pageTargetMode === "include" ? listed : !listed;
}

/** Does the ad have the content its type needs to render safely? */
export function hasRenderableContent(ad: Advertisement): boolean {
  switch (ad.adType) {
    case "image":
      return ad.creatives.length > 0 && isSafeHttpUrl(ad.destinationUrl);
    case "text":
      return !!ad.headline && isSafeHttpUrl(ad.destinationUrl);
    case "video":
      return isSafeHttpUrl(ad.videoUrl);
    case "html":
      return !!ad.html;
    case "network":
      return true; // network slot renders itself once configured (Phase 2)
    default:
      return false;
  }
}

/** All rules an ad must pass to be eligible for a given request. */
export function isEligible(ad: Advertisement, ctx: AdRequestContext): boolean {
  if (!ad.approved) return false;
  if (!SERVEABLE_STATUSES.has(ad.status)) return false;
  if (!SERVEABLE_CAMPAIGN_STATUSES.has(ad.campaignStatus)) return false;
  if (!withinSchedule(ad, ctx.now)) return false;
  if (!ad.placementKeys.includes(ctx.placementKey)) return false;
  if (!matchesDevice(ad, ctx.device)) return false;
  if (!matchesPage(ad, ctx.pagePath)) return false;
  if (!hasRenderableContent(ad)) return false;
  return true;
}

export function filterEligible(ads: Advertisement[], ctx: AdRequestContext): Advertisement[] {
  return ads.filter((ad) => isEligible(ad, ctx));
}

export interface SelectOptions {
  /** Injectable randomness in [0, 1) for deterministic tests. */
  rng?: () => number;
  /** Avoid re-showing this ad id when alternatives exist. */
  avoidId?: string;
}

/**
 * Choose one ad from a candidate list:
 *  1. Keep only the highest-priority tier (admin override).
 *  2. Optionally drop the just-shown ad if others remain.
 *  3. Weighted-random within the tier (weight 0 opts an ad out of rotation;
 *     if every candidate is weight 0, fall back to equal chance).
 */
export function selectAd(
  candidates: Advertisement[],
  { rng = Math.random, avoidId }: SelectOptions = {},
): Advertisement | null {
  if (candidates.length === 0) return null;

  const topPriority = Math.max(...candidates.map((ad) => ad.priority));
  let tier = candidates.filter((ad) => ad.priority === topPriority);

  if (avoidId && tier.length > 1) {
    const withoutAvoided = tier.filter((ad) => ad.id !== avoidId);
    if (withoutAvoided.length > 0) tier = withoutAvoided;
  }

  if (tier.length === 1) return tier[0] ?? null;

  const weights = tier.map((ad) => (ad.weight > 0 ? ad.weight : 0));
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);

  if (totalWeight <= 0) {
    // Every candidate opted out of weighting — equal chance.
    const index = Math.floor(rng() * tier.length) % tier.length;
    return tier[index] ?? null;
  }

  let threshold = rng() * totalWeight;
  for (let i = 0; i < tier.length; i++) {
    threshold -= weights[i] ?? 0;
    if (threshold < 0) return tier[i] ?? null;
  }
  return tier[tier.length - 1] ?? null;
}

/** Pick the best creative for the viewer's device, falling back to responsive. */
export function pickCreative(ad: Advertisement, device: Device): AdCreative | null {
  if (ad.creatives.length === 0) return null;
  const target = targetableDevice(device);
  return (
    ad.creatives.find((c) => c.variant === target) ??
    ad.creatives.find((c) => c.variant === "responsive") ??
    ad.creatives[0] ??
    null
  );
}
