import { fetchBonusHistory, fetchCurrentBonuses } from "./base44";
import { normalizeHistoryFeed } from "./history";
import { normalizeFeed, type RejectedBonus, type TransferBonus } from "./normalize";
import {
  findNewRunKeys,
  lastSuccessfulRowCount,
  recordSyncRun,
  storedHistoryCount,
  upsertBonusHistory,
  upsertTransferBonuses,
  type SyncStatus,
} from "./storage";

/**
 * The daily sync.
 *
 * Kept apart from the HTTP route so the guards can be tested without a server.
 * The governing rule throughout: a broken upstream must never blank or corrupt
 * the page. Every failure path leaves the previous data in place.
 */

/**
 * A feed this much smaller than the last good one is treated as broken rather
 * than believed. Transfer bonuses do expire in batches at month end, so the
 * threshold is deliberately loose — this is a tripwire for a broken scraper,
 * not a business rule about how fast bonuses may end.
 */
const MIN_FEED_RATIO = 0.5;

export interface HistorySyncResult {
  rowsSeen: number;
  rowsWritten: number;
  rowsRejected: number;
  error?: string;
}

export interface SyncResult {
  status: SyncStatus;
  rowsSeen: number;
  rowsWritten: number;
  rowsRejected: number;
  rejections: RejectedBonus[];
  /** Bonuses that were not in the table before this run. */
  newBonuses: TransferBonus[];
  error?: string;
  /** The archive, synced alongside. Its failures never fail the main sync. */
  history?: HistorySyncResult;
}

/**
 * Whether to refuse to write, and why. Returns null when the feed looks sane.
 *
 * Pure so the thresholds are testable: getting this wrong in either direction
 * is expensive — too strict and the page silently stops updating, too loose
 * and one bad upstream morning wipes it.
 */
export function abortReason(rowsSeen: number, lastRowCount: number | null): string | null {
  if (rowsSeen === 0) {
    return "feed returned no records";
  }
  if (lastRowCount !== null && lastRowCount > 0 && rowsSeen < lastRowCount * MIN_FEED_RATIO) {
    return `feed shrank from ${lastRowCount} to ${rowsSeen} records`;
  }
  return null;
}

/**
 * The archive, synced alongside the live feed.
 *
 * Deliberately best-effort and reported separately: the history page can be a
 * day stale without anyone being misled, while the current-bonus page cannot.
 * A failure here must never stop today's bonuses from updating.
 */
export async function runHistorySync(): Promise<HistorySyncResult> {
  const empty = { rowsSeen: 0, rowsWritten: 0, rowsRejected: 0 };
  try {
    const raw = await fetchBonusHistory();
    const { accepted, rejected } = normalizeHistoryFeed(raw);

    // Same shape of guard as the live feed: an archive only grows, so a feed
    // smaller than what is already stored means something upstream broke.
    const stored = await storedHistoryCount();
    if (raw.length === 0 || (stored !== null && stored > 0 && raw.length < stored * 0.5)) {
      return {
        ...empty,
        rowsSeen: raw.length,
        rowsRejected: rejected.length,
        error: `history feed returned ${raw.length} records against ${stored ?? "?"} stored`,
      };
    }

    const rowsWritten = await upsertBonusHistory(accepted);
    return { rowsSeen: raw.length, rowsWritten, rowsRejected: rejected.length };
  } catch (error) {
    return { ...empty, error: error instanceof Error ? error.message : "unknown error" };
  }
}

export async function runTransferBonusSync(): Promise<SyncResult> {
  const startedAt = new Date();

  const empty = { rowsSeen: 0, rowsWritten: 0, rowsRejected: 0, rejections: [], newBonuses: [] };

  let raw;
  try {
    raw = await fetchCurrentBonuses();
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown error";
    const result: SyncResult = { ...empty, status: "failed", error: message };
    await recordSyncRun(startedAt, { ...result, error: message });
    return result;
  }

  const { accepted, rejected } = normalizeFeed(raw);

  // The guard counts what upstream SENT, not what survived validation: a feed
  // that is intact but suddenly full of malformed records is a different
  // problem, and one the rejection count already reports.
  const abort = abortReason(raw.length, await lastSuccessfulRowCount());
  if (abort) {
    const result: SyncResult = {
      ...empty,
      status: "aborted",
      rowsSeen: raw.length,
      rowsRejected: rejected.length,
      rejections: rejected,
      error: abort,
    };
    await recordSyncRun(startedAt, { ...result, error: abort });
    return result;
  }

  try {
    const newKeys = new Set(await findNewRunKeys(accepted.map((bonus) => bonus.runKey)));
    const rowsWritten = await upsertTransferBonuses(accepted);
    const result: SyncResult = {
      status: "succeeded",
      rowsSeen: raw.length,
      rowsWritten,
      rowsRejected: rejected.length,
      rejections: rejected,
      newBonuses: accepted.filter((bonus) => newKeys.has(bonus.runKey)),
      history: await runHistorySync(),
    };
    await recordSyncRun(startedAt, result);
    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown error";
    const result: SyncResult = {
      ...empty,
      status: "failed",
      rowsSeen: raw.length,
      rowsRejected: rejected.length,
      rejections: rejected,
      error: message,
    };
    await recordSyncRun(startedAt, { ...result, error: message });
    return result;
  }
}
