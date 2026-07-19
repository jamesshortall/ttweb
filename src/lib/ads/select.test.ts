import { describe, expect, it } from "vitest";
import {
  filterEligible,
  hasRenderableContent,
  isEligible,
  pickCreative,
  selectAd,
} from "@/lib/ads/select";
import type { Advertisement, AdRequestContext } from "@/lib/ads/types";

const NOW = new Date("2025-06-15T12:00:00Z");

function ctx(overrides: Partial<AdRequestContext> = {}): AdRequestContext {
  return {
    placementKey: "slot",
    device: "desktop",
    pagePath: "/points-and-miles-101",
    preview: false,
    now: NOW,
    ...overrides,
  };
}

function ad(overrides: Partial<Advertisement> = {}): Advertisement {
  return {
    id: "ad1",
    name: "Ad",
    adType: "image",
    status: "active",
    approved: true,
    campaignId: "cmp1",
    campaignStatus: "active",
    creatives: [{ variant: "responsive", src: "/x.svg", alt: "x" }],
    destinationUrl: "https://example.com/",
    placementKeys: ["slot"],
    deviceTarget: "all",
    pageTargetMode: "all",
    pagePaths: [],
    weight: 1,
    priority: 0,
    disclosure: { enabled: true, label: "Advertisement" },
    ...overrides,
  };
}

describe("isEligible", () => {
  it("passes a fully valid ad", () => {
    expect(isEligible(ad(), ctx())).toBe(true);
  });

  it("requires approval", () => {
    expect(isEligible(ad({ approved: false }), ctx())).toBe(false);
  });

  it("rejects non-serveable statuses", () => {
    for (const status of ["draft", "pending", "paused", "expired", "archived"] as const) {
      expect(isEligible(ad({ status }), ctx())).toBe(false);
    }
    expect(isEligible(ad({ status: "scheduled" }), ctx())).toBe(true);
  });

  it("respects a paused/archived campaign", () => {
    expect(isEligible(ad({ campaignStatus: "paused" }), ctx())).toBe(false);
  });

  it("enforces the schedule window (auto start + auto expire)", () => {
    expect(isEligible(ad({ startDate: "2025-07-01T00:00:00Z" }), ctx())).toBe(false); // not started
    expect(isEligible(ad({ endDate: "2025-06-01T00:00:00Z" }), ctx())).toBe(false); // expired
    expect(
      isEligible(ad({ startDate: "2025-06-01T00:00:00Z", endDate: "2025-07-01T00:00:00Z" }), ctx()),
    ).toBe(true);
  });

  it("matches placement", () => {
    expect(isEligible(ad({ placementKeys: ["other"] }), ctx())).toBe(false);
  });

  it("applies device targeting", () => {
    expect(isEligible(ad({ deviceTarget: "mobile" }), ctx({ device: "desktop" }))).toBe(false);
    expect(isEligible(ad({ deviceTarget: "mobile" }), ctx({ device: "mobile" }))).toBe(true);
    expect(isEligible(ad({ deviceTarget: "desktop" }), ctx({ device: "unknown" }))).toBe(true);
  });

  it("applies include/exclude page targeting", () => {
    expect(
      isEligible(ad({ pageTargetMode: "include", pagePaths: ["/other"] }), ctx()),
    ).toBe(false);
    expect(
      isEligible(ad({ pageTargetMode: "include", pagePaths: ["/points-and-miles-101"] }), ctx()),
    ).toBe(true);
    expect(
      isEligible(ad({ pageTargetMode: "exclude", pagePaths: ["/points-and-miles-101"] }), ctx()),
    ).toBe(false);
  });
});

describe("hasRenderableContent", () => {
  it("image needs a creative and a safe destination", () => {
    expect(hasRenderableContent(ad({ creatives: [] }))).toBe(false);
    expect(hasRenderableContent(ad({ destinationUrl: "javascript:x" }))).toBe(false);
  });
  it("text needs a headline", () => {
    expect(hasRenderableContent(ad({ adType: "text", headline: undefined }))).toBe(false);
    expect(hasRenderableContent(ad({ adType: "text", headline: "Hi" }))).toBe(true);
  });
  it("video needs a safe video url", () => {
    expect(hasRenderableContent(ad({ adType: "video", videoUrl: undefined }))).toBe(false);
    expect(hasRenderableContent(ad({ adType: "video", videoUrl: "https://v/x.mp4" }))).toBe(true);
  });
});

describe("selectAd", () => {
  it("returns null for no candidates and collapses cleanly", () => {
    expect(selectAd([])).toBeNull();
    expect(filterEligible([ad({ approved: false })], ctx())).toHaveLength(0);
  });

  it("keeps only the highest-priority tier", () => {
    const low = ad({ id: "low", priority: 0 });
    const high = ad({ id: "high", priority: 5 });
    const picked = selectAd([low, high], { rng: () => 0.99 });
    expect(picked?.id).toBe("high");
  });

  it("weights selection deterministically", () => {
    const a = ad({ id: "a", weight: 1 });
    const b = ad({ id: "b", weight: 3 });
    // total weight 4; rng 0.1 → 0.4 lands in a's [0,1) slice.
    expect(selectAd([a, b], { rng: () => 0.1 })?.id).toBe("a");
    // rng 0.5 → 2.0 lands in b's [1,4) slice.
    expect(selectAd([a, b], { rng: () => 0.5 })?.id).toBe("b");
  });

  it("falls back to equal chance when all weights are zero", () => {
    const a = ad({ id: "a", weight: 0 });
    const b = ad({ id: "b", weight: 0 });
    expect(selectAd([a, b], { rng: () => 0 })?.id).toBe("a");
  });

  it("avoids the just-shown ad when alternatives exist", () => {
    const a = ad({ id: "a" });
    const b = ad({ id: "b" });
    expect(selectAd([a, b], { rng: () => 0, avoidId: "a" })?.id).toBe("b");
  });
});

describe("pickCreative", () => {
  it("prefers the device variant, then responsive", () => {
    const withVariants = ad({
      creatives: [
        { variant: "responsive", src: "/r.svg", alt: "r" },
        { variant: "mobile", src: "/m.svg", alt: "m" },
      ],
    });
    expect(pickCreative(withVariants, "mobile")?.src).toBe("/m.svg");
    expect(pickCreative(withVariants, "desktop")?.src).toBe("/r.svg");
  });
});
