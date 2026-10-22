import { isoDate, type RawTransferBonus, type RejectedBonus } from "./normalize";

/**
 * Normalizing the historical feed.
 *
 * Separate from the current-bonus normalizer because the two entities are not
 * the same shape: history carries its own `history_key`, a normalized
 * `from_bank` and an `origin`, and has no `miss_count` or `verified_by`. The
 * validation rules are the same, and for good reason — across all 520 rows
 * they reject four, every one of them a pairing with itself.
 */

export interface HistoricBonus {
  /** Upstream's key for one run: "from::to::end_date". */
  historyKey: string;
  /** "from::to" — groups every run of the same pairing. */
  bonusKey: string;
  fromProgram: string;
  toProgram: string;
  fromBank: string | null;
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
  /** "backfill" — reconstructed from archives — or "live", observed running. */
  origin: string | null;
  firstSeenAt: string | null;
  lastVerifiedAt: string | null;
  base44Id: string | null;
}

export interface HistoryNormalizeResult {
  accepted: HistoricBonus[];
  rejected: RejectedBonus[];
}

const MIN_PERCENT = 5;
const MAX_PERCENT = 200;

function text(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function finiteNumber(value: unknown): number | null {
  const parsed = typeof value === "string" ? Number(value) : value;
  return typeof parsed === "number" && Number.isFinite(parsed) ? parsed : null;
}

function normalizeOne(raw: RawTransferBonus): HistoricBonus | RejectedBonus {
  const bonusKey = text(raw.bonus_key) ?? "(no key)";

  if (raw.is_sample === true) return { bonusKey, reason: "sample record" };

  const historyKey = text(raw.history_key);
  const fromProgram = text(raw.from_program);
  const toProgram = text(raw.to_program);
  if (!historyKey || !text(raw.bonus_key) || !fromProgram || !toProgram) {
    return { bonusKey, reason: "missing program or key" };
  }

  // The only rule that fires on the real archive: four Marriott Bonvoy rows
  // whose from-program was lost in extraction, leaving the program paired
  // with itself. Never a transfer bonus.
  if (fromProgram.toLowerCase() === toProgram.toLowerCase()) {
    return { bonusKey, reason: "from and to are the same program" };
  }

  const bonusPercent = finiteNumber(raw.bonus_percent);
  if (bonusPercent === null || bonusPercent < MIN_PERCENT || bonusPercent > MAX_PERCENT) {
    return { bonusKey, reason: "implausible bonus percent" };
  }

  const startDate = isoDate(raw.start_date);
  const endDate = isoDate(raw.end_date);
  if (startDate && endDate && endDate < startDate) {
    return { bonusKey, reason: "end date precedes start date" };
  }

  // Whitelist, never a spread — upstream records carry an email address.
  return {
    historyKey,
    bonusKey,
    fromProgram,
    toProgram,
    fromBank: text(raw.from_bank),
    fromProgramType: text(raw.from_program_type),
    toProgramType: text(raw.to_program_type),
    bonusPercent,
    transferRatio: text(raw.transfer_ratio),
    startDate,
    endDate,
    status: text(raw.status) ?? "expired",
    sourceName: text(raw.source_name),
    sourceUrl: text(raw.source_url),
    notes: text(raw.notes),
    origin: text(raw.origin),
    firstSeenAt: text(raw.first_seen_at),
    lastVerifiedAt: text(raw.last_verified_at),
    base44Id: text(raw.id),
  };
}

function isRejection(value: HistoricBonus | RejectedBonus): value is RejectedBonus {
  return "reason" in value;
}

export function normalizeHistoryFeed(
  raw: readonly RawTransferBonus[],
): HistoryNormalizeResult {
  const accepted = new Map<string, HistoricBonus>();
  const rejected: RejectedBonus[] = [];

  for (const record of raw) {
    const result = normalizeOne(record);
    if (isRejection(result)) rejected.push(result);
    else accepted.set(result.historyKey, result);
  }

  return { accepted: [...accepted.values()], rejected };
}
