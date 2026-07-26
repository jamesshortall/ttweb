import { describe, expect, it } from "vitest";
import { breakdown, buildReport, ctr, timeseries, totals } from "@/lib/ads/report";
import type { DailyAggregate } from "@/lib/ads/analytics-types";

function agg(overrides: Partial<DailyAggregate>): DailyAggregate {
  return {
    day: "2025-06-15",
    ad_id: "ad1",
    campaign_id: "cmp1",
    advertiser_id: "adv1",
    placement_key: "slot",
    device: "desktop",
    page_path: "/p",
    impressions: 0,
    clicks: 0,
    unique_clicks: 0,
    ...overrides,
  };
}

describe("ctr", () => {
  it("is clicks/impressions, 0 when no impressions", () => {
    expect(ctr(5, 100)).toBeCloseTo(0.05);
    expect(ctr(3, 0)).toBe(0);
  });
});

describe("totals", () => {
  it("sums metrics and computes CTR", () => {
    const t = totals([
      agg({ impressions: 100, clicks: 5, unique_clicks: 4 }),
      agg({ impressions: 100, clicks: 5, unique_clicks: 3 }),
    ]);
    expect(t).toEqual({ impressions: 200, clicks: 10, uniqueClicks: 7, ctr: 0.05 });
  });
});

describe("breakdown", () => {
  it("groups by dimension, sorts by impressions desc, applies labels", () => {
    const rows = [
      agg({ campaign_id: "a", impressions: 10, clicks: 1 }),
      agg({ campaign_id: "b", impressions: 30, clicks: 2 }),
      agg({ campaign_id: "a", impressions: 5, clicks: 0 }),
    ];
    const labels = new Map([
      ["a", "Alpha"],
      ["b", "Beta"],
    ]);
    const out = breakdown(rows, "campaign_id", labels);
    expect(out.map((r) => r.label)).toEqual(["Beta", "Alpha"]);
    expect(out[1]).toMatchObject({ key: "a", impressions: 15, clicks: 1 });
  });

  it("buckets null dimension values as (none)", () => {
    const out = breakdown([agg({ page_path: null, impressions: 4 })], "page_path");
    expect(out[0]?.key).toBe("(none)");
  });
});

describe("timeseries", () => {
  it("sums per day, sorted ascending", () => {
    const out = timeseries([
      agg({ day: "2025-06-16", impressions: 2 }),
      agg({ day: "2025-06-15", impressions: 1 }),
      agg({ day: "2025-06-16", impressions: 3 }),
    ]);
    expect(out.map((p) => p.day)).toEqual(["2025-06-15", "2025-06-16"]);
    expect(out[1]?.impressions).toBe(5);
  });
});

describe("buildReport", () => {
  it("produces every breakdown", () => {
    const report = buildReport([agg({ impressions: 10, clicks: 1, unique_clicks: 1 })]);
    expect(report.totals.impressions).toBe(10);
    expect(report.byCampaign).toHaveLength(1);
    expect(report.byDevice[0]?.key).toBe("desktop");
    expect(report.timeseries).toHaveLength(1);
  });
});
