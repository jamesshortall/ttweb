import { createClient } from "@supabase/supabase-js";
import { serverEnv } from "@/lib/env";
import type { HistoricBonus } from "./history";

/**
 * Reading the archive for the history page.
 *
 * Rows come back in the same shape the sync writes, so the statistics module
 * works on one definition of a run whether the data came from upstream or
 * from Postgres.
 */

/** The archive is ~520 rows and grows by a handful a month. */
const MAX_ROWS = 5000;

interface Row {
  history_key: string;
  bonus_key: string;
  from_program: string;
  to_program: string;
  from_bank: string | null;
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
  origin: string | null;
  first_seen_at: string | null;
  last_verified_at: string | null;
  base44_id: string | null;
}

function toRun(row: Row): HistoricBonus {
  return {
    historyKey: row.history_key,
    bonusKey: row.bonus_key,
    fromProgram: row.from_program,
    toProgram: row.to_program,
    fromBank: row.from_bank,
    fromProgramType: row.from_program_type,
    toProgramType: row.to_program_type,
    bonusPercent: Number(row.bonus_percent),
    transferRatio: row.transfer_ratio,
    startDate: row.start_date,
    endDate: row.end_date,
    status: row.status,
    sourceName: row.source_name,
    sourceUrl: row.source_url,
    notes: row.notes,
    origin: row.origin,
    firstSeenAt: row.first_seen_at,
    lastVerifiedAt: row.last_verified_at,
    base44Id: row.base44_id,
  };
}

/** Every stored run. Returns empty rather than throwing when unavailable. */
export async function readBonusHistory(): Promise<HistoricBonus[]> {
  const env = serverEnv();
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) return [];

  try {
    const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });
    const { data, error } = await supabase
      .from("transfer_bonus_history")
      .select("*")
      .order("start_date", { ascending: false })
      .limit(MAX_ROWS);

    if (error) {
      console.error(`[transfer-bonuses] History read failed: ${error.code ?? "unknown error"}`);
      return [];
    }
    return (data ?? []).map((row) => toRun(row as Row));
  } catch {
    console.error("[transfer-bonuses] History read failed: request error");
    return [];
  }
}
