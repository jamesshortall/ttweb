import type { AnalyticsFilters } from "@/lib/ads/analytics-store";

/** Parse dashboard/API query params into analytics filters, with a default 30-day window. */
export function parseFilters(params: URLSearchParams): AnalyticsFilters {
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  const today = new Date();
  const defaultFrom = new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000);

  const pick = (k: string) => {
    const v = params.get(k)?.trim();
    return v ? v : undefined;
  };

  return {
    from: pick("from") ?? iso(defaultFrom),
    to: pick("to") ?? iso(today),
    campaignId: pick("campaign"),
    advertiserId: pick("advertiser"),
    adId: pick("ad"),
    placementKey: pick("placement"),
    device: pick("device"),
  };
}
