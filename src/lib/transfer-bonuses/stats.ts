import type { HistoricBonus } from "./history";

/**
 * Per-pairing statistics — the point of the history page.
 *
 * A list of past bonuses is a record. What someone deciding whether to
 * transfer today actually needs is the pattern: how often this pairing runs,
 * how big it usually is, whether today's offer is good by its own standards,
 * and roughly when the next one is due.
 */

export interface PairingStats {
  bonusKey: string;
  fromProgram: string;
  toProgram: string;
  runs: HistoricBonus[];
  runCount: number;
  averagePercent: number;
  bestPercent: number;
  /** Start date of the most recent run, when known. */
  lastRunStart: string | null;
  /** Month numbers (1-12) this pairing most often starts in, commonest first. */
  typicalMonths: number[];
  /** Median days between the starts of consecutive runs. Null under 2 dated runs. */
  medianGapDays: number | null;
  /** How much of the evidence is reconstructed rather than observed. */
  backfilledRuns: number;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function monthName(month: number): string {
  return MONTH_NAMES[month - 1] ?? "";
}

function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 1) return sorted[mid] ?? null;
  const low = sorted[mid - 1];
  const high = sorted[mid];
  return low !== undefined && high !== undefined ? (low + high) / 2 : null;
}

/**
 * Group runs into pairings and summarize each.
 *
 * Ordered by run count: a pairing seen twice says far less about what to
 * expect than one seen twenty times, so the most-evidenced sit first.
 */
export function summarizePairings(history: readonly HistoricBonus[]): PairingStats[] {
  const groups = new Map<string, HistoricBonus[]>();
  for (const run of history) {
    const existing = groups.get(run.bonusKey);
    if (existing) existing.push(run);
    else groups.set(run.bonusKey, [run]);
  }

  const stats: PairingStats[] = [];
  for (const [bonusKey, unsorted] of groups) {
    // Newest first, undated runs last.
    const runs = [...unsorted].sort((a, b) =>
      (b.startDate ?? "0000").localeCompare(a.startDate ?? "0000"),
    );
    const first = runs[0];
    if (!first) continue;

    const percents = runs.map((run) => run.bonusPercent);
    const starts = runs.map((run) => run.startDate).filter((d): d is string => d !== null);

    const monthCounts = new Map<number, number>();
    for (const start of starts) {
      const month = Number(start.slice(5, 7));
      monthCounts.set(month, (monthCounts.get(month) ?? 0) + 1);
    }
    const typicalMonths = [...monthCounts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0] - b[0])
      .slice(0, 2)
      .map(([month]) => month);

    // Gaps between consecutive runs, oldest to newest.
    const ascending = [...starts].sort();
    const gaps: number[] = [];
    for (let i = 1; i < ascending.length; i += 1) {
      const previous = ascending[i - 1];
      const current = ascending[i];
      if (!previous || !current) continue;
      const days = Math.round(
        (Date.parse(`${current}T00:00:00Z`) - Date.parse(`${previous}T00:00:00Z`)) / 86_400_000,
      );
      if (Number.isFinite(days) && days > 0) gaps.push(days);
    }

    stats.push({
      bonusKey,
      fromProgram: first.fromProgram,
      toProgram: first.toProgram,
      runs,
      runCount: runs.length,
      averagePercent:
        Math.round((percents.reduce((sum, p) => sum + p, 0) / percents.length) * 10) / 10,
      bestPercent: Math.max(...percents),
      lastRunStart: starts[0] ?? null,
      typicalMonths,
      medianGapDays: median(gaps),
      backfilledRuns: runs.filter((run) => run.origin === "backfill").length,
    });
  }

  return stats.sort((a, b) => b.runCount - a.runCount || b.averagePercent - a.averagePercent);
}

/**
 * How a live bonus compares with its own history — the question the page
 * exists to answer. Deliberately silent below three prior runs: two points
 * are not a pattern, and a confident claim from thin evidence is worse than
 * no claim at all.
 */
export function verdictForOffer(stats: PairingStats, offerPercent: number): string | null {
  if (stats.runCount < 3) return null;
  if (offerPercent >= stats.bestPercent) return "matches the best this pairing has ever run";
  if (offerPercent > stats.averagePercent) return "above its average";
  if (offerPercent === stats.averagePercent) return "about average";
  return "below its average";
}

/** Roughly how often this pairing comes round, in plain words. */
export function cadence(stats: PairingStats): string | null {
  const gap = stats.medianGapDays;
  if (gap === null || stats.runCount < 3) return null;
  if (gap <= 75) return "roughly every couple of months";
  if (gap <= 150) return "roughly twice a year";
  if (gap <= 290) return "once or twice a year";
  if (gap <= 460) return "roughly once a year";
  return "less than once a year";
}
