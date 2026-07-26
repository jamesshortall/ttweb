/**
 * Shared analytics shapes for aggregation, reporting, and the admin dashboard.
 * Types only — safe to import anywhere.
 */

export type AdEventType = "impression" | "click";

/** A raw event row as stored in ad_events (subset the aggregator needs). */
export interface RawAdEvent {
  event_type: AdEventType;
  ad_id: string;
  campaign_id: string | null;
  advertiser_id: string | null;
  placement_key: string;
  page_path: string | null;
  device: string;
  is_unique: boolean;
  created_at: string;
}

/** One daily aggregate row (matches ad_daily_aggregates). */
export interface DailyAggregate {
  day: string; // YYYY-MM-DD
  ad_id: string;
  campaign_id: string | null;
  advertiser_id: string | null;
  placement_key: string;
  device: string;
  page_path: string | null;
  impressions: number;
  clicks: number;
  unique_clicks: number;
}

export interface MetricTotals {
  impressions: number;
  clicks: number;
  uniqueClicks: number;
  /** Click-through rate as a fraction (clicks / impressions), 0 when no impressions. */
  ctr: number;
}

export interface BreakdownRow extends MetricTotals {
  key: string;
  label: string;
}

export interface TimeseriesPoint extends MetricTotals {
  day: string;
}

export type BreakdownDimension =
  | "campaign_id"
  | "ad_id"
  | "advertiser_id"
  | "placement_key"
  | "device"
  | "page_path";

export interface AnalyticsReport {
  totals: MetricTotals;
  timeseries: TimeseriesPoint[];
  byCampaign: BreakdownRow[];
  byAd: BreakdownRow[];
  byPlacement: BreakdownRow[];
  byDevice: BreakdownRow[];
  byPage: BreakdownRow[];
}
