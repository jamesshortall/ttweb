import type {
  AnalyticsReport,
  BreakdownDimension,
  BreakdownRow,
  DailyAggregate,
  MetricTotals,
  TimeseriesPoint,
} from "@/lib/ads/analytics-types";

/**
 * Pure reporting: turn daily-aggregate rows into the numbers the dashboard and
 * CSV exports show. No I/O — the store fetches rows, this shapes them.
 */

export function ctr(clicks: number, impressions: number): number {
  return impressions > 0 ? clicks / impressions : 0;
}

function emptyTotals(): { impressions: number; clicks: number; uniqueClicks: number } {
  return { impressions: 0, clicks: 0, uniqueClicks: 0 };
}

function withCtr(t: { impressions: number; clicks: number; uniqueClicks: number }): MetricTotals {
  return { ...t, ctr: ctr(t.clicks, t.impressions) };
}

export function totals(rows: DailyAggregate[]): MetricTotals {
  const acc = emptyTotals();
  for (const r of rows) {
    acc.impressions += r.impressions;
    acc.clicks += r.clicks;
    acc.uniqueClicks += r.unique_clicks;
  }
  return withCtr(acc);
}

/** Group rows by a dimension, summing metrics; sorted by impressions desc. */
export function breakdown(
  rows: DailyAggregate[],
  dimension: BreakdownDimension,
  labels?: Map<string, string>,
): BreakdownRow[] {
  const map = new Map<string, { impressions: number; clicks: number; uniqueClicks: number }>();
  for (const r of rows) {
    const key = (r[dimension] ?? "(none)") || "(none)";
    const acc = map.get(key) ?? emptyTotals();
    acc.impressions += r.impressions;
    acc.clicks += r.clicks;
    acc.uniqueClicks += r.unique_clicks;
    map.set(key, acc);
  }
  return [...map.entries()]
    .map(([key, t]) => ({ key, label: labels?.get(key) ?? key, ...withCtr(t) }))
    .sort((a, b) => b.impressions - a.impressions || b.clicks - a.clicks);
}

export function timeseries(rows: DailyAggregate[]): TimeseriesPoint[] {
  const map = new Map<string, { impressions: number; clicks: number; uniqueClicks: number }>();
  for (const r of rows) {
    const acc = map.get(r.day) ?? emptyTotals();
    acc.impressions += r.impressions;
    acc.clicks += r.clicks;
    acc.uniqueClicks += r.unique_clicks;
    map.set(r.day, acc);
  }
  return [...map.entries()]
    .map(([day, t]) => ({ day, ...withCtr(t) }))
    .sort((a, b) => a.day.localeCompare(b.day));
}

/** Full dashboard report. `labels` maps ids → human names (advertiser/campaign). */
export function buildReport(rows: DailyAggregate[], labels?: Map<string, string>): AnalyticsReport {
  return {
    totals: totals(rows),
    timeseries: timeseries(rows),
    byCampaign: breakdown(rows, "campaign_id", labels),
    byAd: breakdown(rows, "ad_id", labels),
    byPlacement: breakdown(rows, "placement_key", labels),
    byDevice: breakdown(rows, "device"),
    byPage: breakdown(rows, "page_path"),
  };
}
