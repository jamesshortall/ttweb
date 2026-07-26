import { createHash, createHmac } from "node:crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { serverEnv } from "@/lib/env";
import { adConfig } from "@/lib/ads/config";
import type { Device } from "@/lib/ads/types";

/**
 * Server-side recording of ad impressions and clicks into Supabase.
 *
 * Privacy: no raw IP and no persistent identifier are ever stored. Unique-click
 * deduplication uses a salted one-way hash of a short-lived signal (ad id +
 * minimized IP + coarse UA) checked inside a configurable window — see
 * docs/ADVERTISING.md → "How unique clicks are calculated". First-party,
 * non-fingerprinting, and collected at the minimum needed to report.
 */

/** Common crawlers/bots we exclude from counts (best-effort, extend as needed). */
const BOT_UA_PATTERN =
  /bot|crawler|spider|crawling|slurp|mediapartners|googlebot|bingbot|duckduckbot|baiduspider|yandex|sogou|exabot|facebookexternalhit|facebot|ia_archiver|semrush|ahrefs|mj12bot|dotbot|petalbot|headless|curl|wget|python-requests|axios|node-fetch|monitor|uptime|pingdom|lighthouse/i;

export function isLikelyBot(userAgent: string | null | undefined): boolean {
  if (!userAgent) return true; // no UA → treat as non-human
  return BOT_UA_PATTERN.test(userAgent);
}

export interface RequestMeta {
  ip: string | null;
  userAgent: string | null;
}

/**
 * A salted, one-way dedup key. Uses AD_REDIRECT_SIGNING_SECRET as the salt when
 * present (so the value can't be reversed without server access); otherwise a
 * process-local constant, which still avoids storing raw PII.
 */
export function buildDedupHash(adId: string, meta: RequestMeta): string {
  const secret = serverEnv().AD_REDIRECT_SIGNING_SECRET;
  const ipHash = createHash("sha256")
    .update(meta.ip ?? "no-ip")
    .digest("hex")
    .slice(0, 16);
  const uaHash = createHash("sha256")
    .update(meta.userAgent ?? "no-ua")
    .digest("hex")
    .slice(0, 16);
  const material = `${adId}:${ipHash}:${uaHash}`;
  return secret
    ? createHmac("sha256", secret).update(material).digest("hex")
    : createHash("sha256").update(material).digest("hex");
}

function adEventsClient(): SupabaseClient | null {
  const env = serverEnv();
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) return null;
  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}

export interface AdEventInput {
  adId: string;
  campaignId?: string;
  advertiserId?: string;
  placementKey: string;
  pagePath?: string;
  device: Device;
}

/** Should we record at all right now? */
function trackingActive(meta: RequestMeta): boolean {
  const cfg = adConfig();
  if (!cfg.trackingEnabled || cfg.previewMode) return false;
  if (isLikelyBot(meta.userAgent)) return false;
  return true;
}

export async function recordImpression(input: AdEventInput, meta: RequestMeta): Promise<boolean> {
  if (!trackingActive(meta)) return false;
  const supabase = adEventsClient();
  if (!supabase) return false;
  try {
    const { error } = await supabase.from("ad_events").insert({
      event_type: "impression",
      ad_id: input.adId,
      campaign_id: input.campaignId ?? null,
      advertiser_id: input.advertiserId ?? null,
      placement_key: input.placementKey,
      page_path: input.pagePath ?? null,
      device: input.device,
    });
    if (error) {
      console.error(`[ads] impression insert failed: ${error.code ?? "unknown"}`);
      return false;
    }
    return true;
  } catch {
    console.error("[ads] impression insert failed: request error");
    return false;
  }
}

export async function recordClick(input: AdEventInput, meta: RequestMeta): Promise<boolean> {
  if (!trackingActive(meta)) return false;
  const supabase = adEventsClient();
  if (!supabase) return false;

  const dedupHash = buildDedupHash(input.adId, meta);
  const windowMs = adConfig().uniqueClickWindowHours * 60 * 60 * 1000;
  const since = new Date(Date.now() - windowMs).toISOString();

  try {
    // A prior click for this ad+dedup key inside the window ⇒ not unique.
    const { data: prior } = await supabase
      .from("ad_events")
      .select("id")
      .eq("event_type", "click")
      .eq("ad_id", input.adId)
      .eq("dedup_hash", dedupHash)
      .gte("created_at", since)
      .limit(1);

    const isUnique = !prior || prior.length === 0;

    const { error } = await supabase.from("ad_events").insert({
      event_type: "click",
      ad_id: input.adId,
      campaign_id: input.campaignId ?? null,
      advertiser_id: input.advertiserId ?? null,
      placement_key: input.placementKey,
      page_path: input.pagePath ?? null,
      device: input.device,
      is_unique: isUnique,
      dedup_hash: dedupHash,
    });
    if (error) {
      console.error(`[ads] click insert failed: ${error.code ?? "unknown"}`);
      return false;
    }
    return true;
  } catch {
    console.error("[ads] click insert failed: request error");
    return false;
  }
}
