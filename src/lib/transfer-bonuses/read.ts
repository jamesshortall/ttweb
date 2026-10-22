import { createClient } from "@supabase/supabase-js";
import { serverEnv } from "@/lib/env";
import type { TransferBonus } from "./normalize";

/**
 * Reading stored bonuses for the public page.
 *
 * Rows are mapped back into the same `TransferBonus` shape the sync writes, so
 * the page uses the very functions the sync's own rules are tested against —
 * there is no second, subtly different idea of "current" living in SQL.
 */

/** Generous: the table grows by a handful of runs a month. */
const MAX_ROWS = 1000;

interface Row {
  bonus_key: string;
  run_key: string;
  from_program: string;
  to_program: string;
  from_program_type: string | null;
  to_program_type: string | null;
  bonus_percent: number | string;
  transfer_ratio: string | null;
  start_date: string | null;
  end_date: string | null;
  status: string;
  source_name: string | null;
  source_url: string | null;
  notes: string | null;
  miss_count: number | null;
  verified_by: string | null;
  first_seen_at: string | null;
  last_verified_at: string | null;
  base44_id: string | null;
}

function toBonus(row: Row): TransferBonus {
  return {
    bonusKey: row.bonus_key,
    runKey: row.run_key,
    fromProgram: row.from_program,
    toProgram: row.to_program,
    fromProgramType: row.from_program_type,
    toProgramType: row.to_program_type,
    // Postgres numeric comes back as a string through PostgREST.
    bonusPercent: Number(row.bonus_percent),
    transferRatio: row.transfer_ratio,
    startDate: row.start_date,
    endDate: row.end_date,
    status: row.status,
    sourceName: row.source_name,
    sourceUrl: row.source_url,
    notes: row.notes,
    missCount: row.miss_count ?? 0,
    verifiedBy: row.verified_by,
    firstSeenAt: row.first_seen_at,
    lastVerifiedAt: row.last_verified_at,
    base44Id: row.base44_id,
  };
}

function client() {
  const env = serverEnv();
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) return null;
  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}

export interface TransferBonusPageData {
  bonuses: TransferBonus[];
  /** When the feed was last read successfully, or null if it never has been. */
  lastUpdated: string | null;
}

/**
 * Everything the page needs, in one call.
 *
 * Returns empty rather than throwing when Supabase is unconfigured or
 * unreachable: the page then says it cannot show bonuses right now, which is
 * honest, instead of the whole route failing.
 */
export async function readTransferBonusPageData(): Promise<TransferBonusPageData> {
  const supabase = client();
  if (!supabase) return { bonuses: [], lastUpdated: null };

  try {
    const [bonusResult, syncResult] = await Promise.all([
      supabase
        .from("transfer_bonuses")
        .select("*")
        .eq("status", "active")
        .order("bonus_percent", { ascending: false })
        .limit(MAX_ROWS),
      supabase
        .from("transfer_bonus_syncs")
        .select("finished_at")
        .eq("status", "succeeded")
        .order("started_at", { ascending: false })
        .limit(1),
    ]);

    if (bonusResult.error) {
      console.error(
        `[transfer-bonuses] Read failed: ${bonusResult.error.code ?? "unknown error"}`,
      );
      return { bonuses: [], lastUpdated: null };
    }

    const syncRow = syncResult.data?.[0] as { finished_at: string | null } | undefined;

    return {
      bonuses: (bonusResult.data ?? []).map((row) => toBonus(row as Row)),
      lastUpdated: syncRow?.finished_at ?? null,
    };
  } catch {
    console.error("[transfer-bonuses] Read failed: request error");
    return { bonuses: [], lastUpdated: null };
  }
}
