import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { serverEnv } from "@/lib/env";
import type { TransferBonus } from "./normalize";

/**
 * Supabase persistence for transfer bonuses — see
 * supabase/migrations/0005_transfer_bonuses.sql.
 *
 * Uses the server-only service-role key; both tables deny all
 * anon/authenticated access via RLS.
 */

export type SyncStatus = "succeeded" | "aborted" | "failed";

export interface SyncOutcome {
  status: SyncStatus;
  rowsSeen: number;
  rowsWritten: number;
  rowsRejected: number;
  error?: string;
}

function client(): SupabaseClient | null {
  const env = serverEnv();
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) return null;
  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}

export function isStorageConfigured(): boolean {
  return client() !== null;
}

function toRow(bonus: TransferBonus) {
  return {
    bonus_key: bonus.bonusKey,
    run_key: bonus.runKey,
    from_program: bonus.fromProgram,
    to_program: bonus.toProgram,
    from_program_type: bonus.fromProgramType,
    to_program_type: bonus.toProgramType,
    bonus_percent: bonus.bonusPercent,
    transfer_ratio: bonus.transferRatio,
    start_date: bonus.startDate,
    end_date: bonus.endDate,
    status: bonus.status,
    source_name: bonus.sourceName,
    source_url: bonus.sourceUrl,
    notes: bonus.notes,
    miss_count: bonus.missCount,
    verified_by: bonus.verifiedBy,
    first_seen_at: bonus.firstSeenAt,
    last_verified_at: bonus.lastVerifiedAt,
    base44_id: bonus.base44Id,
    synced_at: new Date().toISOString(),
  };
}

/**
 * Upsert on run_key, so a bonus whose end date was extended updates its own
 * row and a genuinely new run becomes a new one. Nothing is ever deleted —
 * yesterday's bonuses are the history.
 */
export async function upsertTransferBonuses(bonuses: readonly TransferBonus[]): Promise<number> {
  const supabase = client();
  if (!supabase || bonuses.length === 0) return 0;

  const { error } = await supabase
    .from("transfer_bonuses")
    .upsert(bonuses.map(toRow), { onConflict: "run_key" });

  if (error) {
    throw new Error(`Supabase upsert failed: ${error.code ?? "unknown error"}`);
  }
  return bonuses.length;
}

/** How many records the last run that actually wrote saw. Powers the shrink guard. */
export async function lastSuccessfulRowCount(): Promise<number | null> {
  const supabase = client();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("transfer_bonus_syncs")
    .select("rows_seen")
    .eq("status", "succeeded")
    .order("started_at", { ascending: false })
    .limit(1);

  if (error || !data || data.length === 0) return null;
  const seen = (data[0] as { rows_seen: number | null }).rows_seen;
  return typeof seen === "number" ? seen : null;
}

/** When the feed was last successfully read — the page's "Last updated". */
export async function lastSuccessfulSyncAt(): Promise<string | null> {
  const supabase = client();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("transfer_bonus_syncs")
    .select("finished_at")
    .eq("status", "succeeded")
    .order("started_at", { ascending: false })
    .limit(1);

  if (error || !data || data.length === 0) return null;
  return (data[0] as { finished_at: string | null }).finished_at;
}

/** Record how a run went. Best-effort: a logging failure must not fail the run. */
export async function recordSyncRun(startedAt: Date, outcome: SyncOutcome): Promise<void> {
  const supabase = client();
  if (!supabase) return;

  await supabase
    .from("transfer_bonus_syncs")
    .insert({
      started_at: startedAt.toISOString(),
      finished_at: new Date().toISOString(),
      status: outcome.status,
      rows_seen: outcome.rowsSeen,
      rows_written: outcome.rowsWritten,
      rows_rejected: outcome.rowsRejected,
      error: outcome.error ?? null,
    })
    .then(undefined, () => undefined);
}

/**
 * Which of these run keys are not in the table yet — i.e. what is new today.
 *
 * Called before the upsert, because afterwards everything looks pre-existing.
 */
export async function findNewRunKeys(runKeys: readonly string[]): Promise<string[]> {
  const supabase = client();
  if (!supabase || runKeys.length === 0) return [];

  const { data, error } = await supabase
    .from("transfer_bonuses")
    .select("run_key")
    .in("run_key", [...runKeys]);

  if (error || !data) return [];
  const known = new Set(data.map((row) => (row as { run_key: string }).run_key));
  return runKeys.filter((key) => !known.has(key));
}

/** Upsert historical runs on upstream's own history_key. */
export async function upsertBonusHistory(
  runs: readonly import("./history").HistoricBonus[],
): Promise<number> {
  const supabase = client();
  if (!supabase || runs.length === 0) return 0;

  const now = new Date().toISOString();
  const { error } = await supabase.from("transfer_bonus_history").upsert(
    runs.map((run) => ({
      history_key: run.historyKey,
      bonus_key: run.bonusKey,
      from_program: run.fromProgram,
      to_program: run.toProgram,
      from_bank: run.fromBank,
      from_program_type: run.fromProgramType,
      to_program_type: run.toProgramType,
      bonus_percent: run.bonusPercent,
      transfer_ratio: run.transferRatio,
      start_date: run.startDate,
      end_date: run.endDate,
      status: run.status,
      source_name: run.sourceName,
      source_url: run.sourceUrl,
      notes: run.notes,
      origin: run.origin,
      first_seen_at: run.firstSeenAt,
      last_verified_at: run.lastVerifiedAt,
      base44_id: run.base44Id,
      synced_at: now,
    })),
    { onConflict: "history_key" },
  );

  if (error) throw new Error(`Supabase history upsert failed: ${error.code ?? "unknown error"}`);
  return runs.length;
}

/** How many historical runs are stored. Powers the history shrink guard. */
export async function storedHistoryCount(): Promise<number | null> {
  const supabase = client();
  if (!supabase) return null;
  const { count, error } = await supabase
    .from("transfer_bonus_history")
    .select("*", { count: "exact", head: true });
  return error ? null : (count ?? null);
}
