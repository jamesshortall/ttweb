import { sanityClient } from "@/lib/cms/client";
import { adsForPlacementQuery, placementZoneQuery } from "@/lib/ads/queries";
import { filterEligible, selectAd } from "@/lib/ads/select";
import { devAdvertisements, devPlacementZones, isDevSeedEnabled } from "@/lib/ads/dev-content";
import type { Advertisement, AdRequestContext, PlacementZone } from "@/lib/ads/types";

/**
 * Ad resolution: CMS-first, with a development-only seed fallback. Never throws
 * into a page — any failure resolves to "no ad" so the placement collapses
 * cleanly rather than breaking the surrounding content.
 */

async function fetchZone(key: string): Promise<PlacementZone | null> {
  const client = sanityClient();
  if (!client) return isDevSeedEnabled() ? (devPlacementZones[key] ?? null) : null;
  try {
    const zone = await client.fetch<PlacementZone | null>(placementZoneQuery, { key });
    return zone ?? null;
  } catch (error) {
    console.error(`[ads] Placement lookup failed (${key}): ${(error as Error).message}`);
    return null;
  }
}

async function fetchCandidates(key: string): Promise<Advertisement[]> {
  const client = sanityClient();
  if (!client) {
    return isDevSeedEnabled()
      ? devAdvertisements.filter((ad) => ad.placementKeys.includes(key))
      : [];
  }
  try {
    const ads = await client.fetch<Advertisement[]>(adsForPlacementQuery, { key });
    return ads ?? [];
  } catch (error) {
    console.error(`[ads] Candidate lookup failed (${key}): ${(error as Error).message}`);
    return [];
  }
}

/**
 * Resolve the single ad to render for a request, or null to collapse the slot.
 * Applies zone enable/format gating, then the pure eligibility + selection
 * rules in select.ts.
 */
export async function resolveAd(ctx: AdRequestContext): Promise<Advertisement | null> {
  const zone = await fetchZone(ctx.placementKey);
  if (!zone || !zone.enabled) return null;

  const candidates = await fetchCandidates(ctx.placementKey);
  const eligible = filterEligible(candidates, ctx).filter((ad) =>
    // Respect the zone's supported formats.
    zone.supportedFormats.includes(ad.adType),
  );

  return selectAd(eligible);
}
