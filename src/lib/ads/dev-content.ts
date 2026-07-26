import type { Advertisement, PlacementZone } from "@/lib/ads/types";

/**
 * Development-only seed content.
 *
 * Used ONLY when the CMS is unconfigured AND NODE_ENV !== "production", so a
 * developer can see the ad pipeline render end-to-end without a Sanity project.
 * These are obviously-labeled MOCK ads — never real advertisers, endorsements,
 * or campaign results. Production with an unconfigured CMS shows nothing (every
 * placement collapses), exactly as specified.
 */

export const devPlacementZones: Record<string, PlacementZone> = {
  "points-101-inline": {
    key: "points-101-inline",
    internalName: "Points 101 — inline",
    enabled: true,
    supportedFormats: ["image", "text"],
    deviceAvailability: "all",
  },
};

export const devAdvertisements: Advertisement[] = [
  {
    id: "dev-sample-image-ad",
    name: "[MOCK] Sample inline image ad",
    adType: "image",
    status: "active",
    approved: true,
    campaignId: "dev-campaign",
    campaignStatus: "active",
    advertiserId: "dev-advertiser",
    advertiserDisplayName: "Sample Advertiser (mock)",
    headline: "Your Message Here",
    description: "Sample placement — development seed content only.",
    creatives: [
      {
        variant: "responsive",
        src: "/images/ads/sample-inline.svg",
        alt: "Sample advertisement placeholder",
        width: 728,
        height: 180,
      },
    ],
    destinationUrl: "https://www.traveltechnician.info/",
    ctaLabel: "Learn more",
    placementKeys: ["points-101-inline"],
    deviceTarget: "all",
    pageTargetMode: "all",
    pagePaths: [],
    weight: 1,
    priority: 0,
    disclosure: { enabled: true, label: "Advertisement" },
  },
];

export function isDevSeedEnabled(): boolean {
  return process.env.NODE_ENV !== "production";
}
