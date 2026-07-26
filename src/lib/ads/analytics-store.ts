import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { serverEnv } from "@/lib/env";
import { aggregateEvents } from "@/lib/ads/aggregate";
import type { DailyAggregate, RawAdEvent } from "@/lib/ads/analytics-types";

/**
 * Server-side reads/writes for advertising analytics. Uses the service-role key
 * (never shipped to the browser); every table denies anon/authenticated access
 * via RLS. All functions fail soft (return empty / false, log the class only) so
 * a reporting hiccup never takes down an admin page.
 */

function client(): SupabaseClient | null {
  const env = serverEnv();
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) return null;
  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}

export function isAnalyticsConfigured(): boolean {
  return client() !== null;
}

export interface AnalyticsFilters {
  from?: string; // YYYY-MM-DD inclusive
  to?: string; // YYYY-MM-DD inclusive
  campaignId?: string;
  advertiserId?: string;
  adId?: string;
  placementKey?: string;
  device?: string;
}

/** Read pre-aggregated daily rows (what the dashboard uses). */
export async function fetchAggregates(filters: AnalyticsFilters): Promise<DailyAggregate[]> {
  const supabase = client();
  if (!supabase) return [];
  try {
    let query = supabase
      .from("ad_daily_aggregates")
      .select(
        "day, ad_id, campaign_id, advertiser_id, placement_key, device, page_path, impressions, clicks, unique_clicks",
      )
      .order("day", { ascending: true })
      .limit(10000);

    if (filters.from) query = query.gte("day", filters.from);
    if (filters.to) query = query.lte("day", filters.to);
    if (filters.campaignId) query = query.eq("campaign_id", filters.campaignId);
    if (filters.advertiserId) query = query.eq("advertiser_id", filters.advertiserId);
    if (filters.adId) query = query.eq("ad_id", filters.adId);
    if (filters.placementKey) query = query.eq("placement_key", filters.placementKey);
    if (filters.device) query = query.eq("device", filters.device);

    const { data, error } = await query;
    if (error) {
      console.error(`[ads] aggregate read failed: ${error.code ?? "unknown"}`);
      return [];
    }
    return (data ?? []) as DailyAggregate[];
  } catch {
    console.error("[ads] aggregate read failed: request error");
    return [];
  }
}

/**
 * Roll raw events in [from, to) into ad_daily_aggregates. Idempotent per window:
 * it recomputes each affected (day, ad, placement, device, page) group and
 * upserts, so re-running the same window is safe. Returns the number of rows
 * written, or -1 on failure.
 */
export async function runAggregation(windowFrom: Date, windowTo: Date): Promise<number> {
  const supabase = client();
  if (!supabase) return -1;
  try {
    const { data, error } = await supabase
      .from("ad_events")
      .select(
        "event_type, ad_id, campaign_id, advertiser_id, placement_key, page_path, device, is_unique, created_at",
      )
      .gte("created_at", windowFrom.toISOString())
      .lt("created_at", windowTo.toISOString())
      .limit(100000);
    if (error) {
      console.error(`[ads] aggregation read failed: ${error.code ?? "unknown"}`);
      return -1;
    }

    const aggregates = aggregateEvents((data ?? []) as RawAdEvent[]);
    if (aggregates.length === 0) return 0;

    const rows = aggregates.map((a) => ({ ...a, updated_at: new Date().toISOString() }));
    const { error: upsertError } = await supabase
      .from("ad_daily_aggregates")
      .upsert(rows, { onConflict: "day,ad_id,placement_key,device,page_path" });
    if (upsertError) {
      console.error(`[ads] aggregation upsert failed: ${upsertError.code ?? "unknown"}`);
      return -1;
    }
    return rows.length;
  } catch {
    console.error("[ads] aggregation failed: request error");
    return -1;
  }
}

/** Dashboard summary counts that don't come from aggregates. */
export async function fetchExpiringSoonCount(): Promise<number | null> {
  // Placeholder for a Sanity-backed count (Phase 4 wires ad status counts here).
  return null;
}
