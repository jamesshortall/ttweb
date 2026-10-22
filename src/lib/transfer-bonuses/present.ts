import { isCurrent, isUnconfirmed, type TransferBonus } from "./normalize";

/**
 * Turning stored bonuses into what the page shows.
 *
 * Pure, and separate from the page, because these are the decisions a reader
 * acts on: which bonuses are live, how a date window reads, and which ones
 * carry a caveat.
 */

export interface ProgramGroup {
  /** The source program, e.g. "Amex Membership Rewards". */
  fromProgram: string;
  bonuses: TransferBonus[];
}

/** Today in the site's own terms. Dates upstream are plain calendar dates. */
export function today(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}

/**
 * The bonuses worth showing, best first.
 *
 * Sorted by percentage rather than by date: someone scanning this page is
 * looking for the biggest bonus, not the one ending soonest. Ties break on the
 * closer deadline, since that is the one to act on first.
 */
export function currentBonuses(
  bonuses: readonly TransferBonus[],
  on: string = today(),
): TransferBonus[] {
  return bonuses
    .filter((bonus) => isCurrent(bonus, on))
    .sort((a, b) => {
      if (b.bonusPercent !== a.bonusPercent) return b.bonusPercent - a.bonusPercent;
      // An open-ended bonus has no deadline, so it sorts last among equals.
      const aEnd = a.endDate ?? "9999-12-31";
      const bEnd = b.endDate ?? "9999-12-31";
      return aEnd.localeCompare(bEnd);
    });
}

/** Group by source program, programs ordered by their best live bonus. */
export function groupByProgram(bonuses: readonly TransferBonus[]): ProgramGroup[] {
  const groups = new Map<string, TransferBonus[]>();
  for (const bonus of bonuses) {
    const existing = groups.get(bonus.fromProgram);
    if (existing) existing.push(bonus);
    else groups.set(bonus.fromProgram, [bonus]);
  }
  return [...groups.entries()]
    .map(([fromProgram, list]) => ({ fromProgram, bonuses: list }))
    .sort((a, b) => (b.bonuses[0]?.bonusPercent ?? 0) - (a.bonuses[0]?.bonusPercent ?? 0));
}

/** "30%", not "30.0%" — upstream sends floats. */
export function formatPercent(value: number): string {
  return `${Number.isInteger(value) ? value : value.toFixed(1)}%`;
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** "5 Oct 2026" from a plain calendar date, with no timezone involved. */
function formatDate(iso: string, withYear: boolean): string {
  const [year, month, day] = iso.split("-");
  const monthName = MONTHS[Number(month) - 1] ?? month ?? "";
  const dayNumber = Number(day);
  return withYear ? `${dayNumber} ${monthName} ${year}` : `${dayNumber} ${monthName}`;
}

/**
 * How a bonus's window reads.
 *
 * An open-ended bonus says "Ongoing" rather than leaving a blank — a missing
 * end date upstream is normal, not an error, and a blank cell reads as broken.
 */
export function formatWindow(bonus: TransferBonus, on: string = today()): string {
  const thisYear = on.slice(0, 4);
  if (!bonus.endDate) return "Ongoing";

  const endYear = bonus.endDate.slice(0, 4);
  const end = formatDate(bonus.endDate, endYear !== thisYear);

  if (!bonus.startDate) return `Through ${end}`;
  // A bonus that started before today is better described by its deadline:
  // when it began is history the reader cannot act on.
  if (bonus.startDate <= on) return `Through ${end}`;
  return `${formatDate(bonus.startDate, false)} – ${end}`;
}

/** How many days remain, for the urgency note. Null when open-ended. */
export function daysRemaining(bonus: TransferBonus, on: string = today()): number | null {
  if (!bonus.endDate) return null;
  const end = Date.parse(`${bonus.endDate}T00:00:00Z`);
  const from = Date.parse(`${on}T00:00:00Z`);
  if (Number.isNaN(end) || Number.isNaN(from)) return null;
  return Math.round((end - from) / 86_400_000);
}

/** A bonus upstream has stopped confirming gets a visible caveat, not a hide. */
export function needsVerifying(bonus: TransferBonus): boolean {
  return isUnconfirmed(bonus);
}
