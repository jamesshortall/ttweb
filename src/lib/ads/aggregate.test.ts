import { describe, expect, it } from "vitest";
import { aggregateEvents } from "@/lib/ads/aggregate";
import type { RawAdEvent } from "@/lib/ads/analytics-types";

function ev(overrides: Partial<RawAdEvent>): RawAdEvent {
  return {
    event_type: "impression",
    ad_id: "ad1",
    campaign_id: "cmp1",
    advertiser_id: "adv1",
    placement_key: "slot",
    page_path: "/p",
    device: "desktop",
    is_unique: false,
    created_at: "2025-06-15T10:00:00Z",
    ...overrides,
  };
}

describe("aggregateEvents", () => {
  it("groups by day/ad/placement/device/page and counts metrics", () => {
    const rows = aggregateEvents([
      ev({ event_type: "impression" }),
      ev({ event_type: "impression", created_at: "2025-06-15T23:00:00Z" }),
      ev({ event_type: "click", is_unique: true }),
      ev({ event_type: "click", is_unique: false }),
    ]);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      day: "2025-06-15",
      impressions: 2,
      clicks: 2,
      unique_clicks: 1,
    });
  });

  it("splits rows across different days and devices", () => {
    const rows = aggregateEvents([
      ev({ created_at: "2025-06-15T10:00:00Z", device: "mobile" }),
      ev({ created_at: "2025-06-16T10:00:00Z", device: "mobile" }),
      ev({ created_at: "2025-06-15T10:00:00Z", device: "desktop" }),
    ]);
    expect(rows).toHaveLength(3);
  });

  it("treats missing page/device consistently", () => {
    const rows = aggregateEvents([
      ev({ page_path: null, device: "" }),
      ev({ page_path: null, device: "" }),
    ]);
    expect(rows).toHaveLength(1);
    expect(rows[0]?.device).toBe("unknown");
    expect(rows[0]?.impressions).toBe(2);
  });
});
