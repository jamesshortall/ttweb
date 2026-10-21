/**
 * Turning the CardMaster feed into rows this site will publish.
 *
 * Everything here is pure, because this is where the site decides what a
 * visitor is told about a bonus they may move 200,000 points on. The upstream
 * records are AI-extracted from third-party blogs, so they are treated as
 * untrusted input: fields are copied by whitelist, and anything that fails a
 * plausibility check is rejected and counted rather than quietly published.
 */

/** A record exactly as the Base44 entity endpoint returns it. */
export type RawTransferBonus = Record<string, unknown>;

/** A record this site is willing to store. */
export interface TransferBonus {
  bonusKey: string;
  runKey: string;
  fromProgram: string;
  toProgram: string;
  fromProgramType: string | null;
  toProgramType: string | null;
  bonusPercent: number;
  transferRatio: string | null;
  startDate: string | null;
  endDate: string | null;
  status: string;
  sourceName: string | null;
  sourceUrl: string | null;
  notes: string | null;
  missCount: number;
  verifiedBy: string | null;
  firstSeenAt: string | null;
  lastVerifiedAt: string | null;
  base44Id: string | null;
}

export interface RejectedBonus {
  /** Enough to find the record upstream, never the whole payload. */
  bonusKey: string;
  reason: string;
}

export interface NormalizeResult {
  accepted: TransferBonus[];
  rejected: RejectedBonus[];
}

/** A bonus percentage outside this range is a parsing failure, not a deal. */
const MIN_PERCENT = 5;
const MAX_PERCENT = 200;

/** Upstream sends "" rather than null for an absent value. */
function text(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/**
 * A calendar date, or null. Rejects a well-shaped but impossible date
 * (2026-02-31), which `new Date()` would silently roll forward into March.
 */
export function isoDate(value: unknown): string | null {
  const raw = text(value);
  if (!raw || !/^\d{4}-\d{2}-\d{2}$/.test(raw)) return null;
  const parsed = new Date(`${raw}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().slice(0, 10) === raw ? raw : null;
}

function finiteNumber(value: unknown): number | null {
  const parsed = typeof value === "string" ? Number(value) : value;
  return typeof parsed === "number" && Number.isFinite(parsed) ? parsed : null;
}

/**
 * Identifies one RUN of a pairing.
 *
 * Keyed on the start date, not the end date: an organiser extending a live
 * bonus changes its end date, and keying on that would fork a duplicate row
 * mid-run. Many historical records carry no start date at all, so the end date
 * is the fallback — it still separates this October's Capital One bonus from a
 * future one — and "open" is the last resort for a record with neither.
 */
export function runKey(bonusKey: string, startDate: string | null, endDate: string | null): string {
  return `${bonusKey}::${startDate ?? endDate ?? "open"}`;
}

/**
 * Whether a bonus should be shown today.
 *
 * Both conditions are required. `status` alone would keep showing a bonus
 * whose end date has quietly passed; `end_date` alone would advertise one that
 * upstream has already marked dead — which is a real case, not a hypothetical:
 * Capital One to Japan Airlines read `status: "expired"` with an end date four
 * days in the future, because the scrapers had stopped finding it.
 */
export function isCurrent(bonus: TransferBonus, today: string): boolean {
  if (bonus.status !== "active") return false;
  return bonus.endDate === null || bonus.endDate >= today;
}

/** A bonus upstream has stopped finding, but has not yet marked expired. */
export function isUnconfirmed(bonus: TransferBonus): boolean {
  return bonus.missCount > 0;
}

function normalizeOne(raw: RawTransferBonus): TransferBonus | RejectedBonus {
  const bonusKey = text(raw.bonus_key) ?? "(no key)";

  if (raw.is_sample === true) {
    return { bonusKey, reason: "sample record" };
  }

  const fromProgram = text(raw.from_program);
  const toProgram = text(raw.to_program);
  if (!text(raw.bonus_key) || !fromProgram || !toProgram) {
    return { bonusKey, reason: "missing program or key" };
  }

  // A pairing with itself is never a transfer bonus. This is the rule that
  // catches the known failure: a Marriott-to-Marriott row at 70%, whose source
  // URL pointed at a Chase page — the extraction had lost the from-program.
  if (fromProgram.toLowerCase() === toProgram.toLowerCase()) {
    return { bonusKey, reason: "from and to are the same program" };
  }

  const bonusPercent = finiteNumber(raw.bonus_percent);
  if (bonusPercent === null || bonusPercent < MIN_PERCENT || bonusPercent > MAX_PERCENT) {
    return { bonusKey, reason: "implausible bonus percent" };
  }

  const status = text(raw.status);
  if (status !== "active" && status !== "expired") {
    return { bonusKey, reason: "unrecognized status" };
  }

  const startDate = isoDate(raw.start_date);
  const endDate = isoDate(raw.end_date);
  if (startDate && endDate && endDate < startDate) {
    return { bonusKey, reason: "end date precedes start date" };
  }

  const missCount = finiteNumber(raw.miss_count) ?? 0;

  // Whitelist, never a spread: upstream records carry created_by and
  // created_by_id, which hold a real email address. A field added upstream
  // tomorrow must not be able to reach this site by default.
  return {
    bonusKey,
    runKey: runKey(bonusKey, startDate, endDate),
    fromProgram,
    toProgram,
    fromProgramType: text(raw.from_program_type),
    toProgramType: text(raw.to_program_type),
    bonusPercent,
    transferRatio: text(raw.transfer_ratio),
    startDate,
    endDate,
    status,
    sourceName: text(raw.source_name),
    sourceUrl: text(raw.source_url),
    notes: text(raw.notes),
    missCount: Math.max(0, Math.trunc(missCount)),
    verifiedBy: text(raw.verified_by),
    firstSeenAt: text(raw.first_seen_at),
    lastVerifiedAt: text(raw.last_verified_at),
    base44Id: text(raw.id),
  };
}

function isRejection(value: TransferBonus | RejectedBonus): value is RejectedBonus {
  return "reason" in value;
}

/**
 * Normalize a whole feed, keeping the good records and reporting the rest.
 *
 * A later run of the same pairing wins on a duplicate run key, so one bad
 * upstream duplicate cannot multiply rows.
 */
export function normalizeFeed(raw: readonly RawTransferBonus[]): NormalizeResult {
  const accepted = new Map<string, TransferBonus>();
  const rejected: RejectedBonus[] = [];

  for (const record of raw) {
    const result = normalizeOne(record);
    if (isRejection(result)) {
      rejected.push(result);
      continue;
    }
    accepted.set(result.runKey, result);
  }

  return { accepted: [...accepted.values()], rejected };
}
