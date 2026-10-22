import type { RawTransferBonus } from "../normalize";

/**
 * A slice of the real archive: the Amex -> Hilton pairing, which has the most
 * runs of any (22 in the live data), plus a one-off and the known-bad
 * Marriott-to-Marriott row.
 *
 * Shapes and values follow the real feed, including the empty-string dates
 * and the `origin` field that distinguishes reconstructed runs from observed
 * ones.
 */

function run(
  start: string,
  end: string,
  percent: number,
  origin = "backfill",
): RawTransferBonus {
  return {
    history_key: `amex membership::hilton::${end}`,
    bonus_key: "amex membership::hilton",
    from_program: "Amex Membership Rewards",
    from_bank: "American Express",
    from_program_type: "Credit Card",
    to_program: "Hilton Honors",
    to_program_type: "Hotel",
    bonus_percent: percent,
    transfer_ratio: "1:2",
    start_date: start,
    end_date: end,
    status: "expired",
    source_url: "https://frequentmiler.com/current-point-transfer-bonuses/",
    source_name: "Frequent Miler",
    notes: "",
    origin,
    first_seen_at: "2026-10-17T19:11:50.453Z",
    last_verified_at: "2026-10-17T19:11:50.453Z",
    id: `id-${end}`,
    created_by: "owner@example.com",
    is_sample: false,
  };
}

/** Five runs of one pairing: two Septembers, two Decembers, one March. */
export const amexHiltonRuns: RawTransferBonus[] = [
  run("2023-09-01", "2023-10-15", 25),
  run("2023-12-01", "2023-12-31", 30),
  run("2024-09-05", "2024-10-20", 35),
  run("2024-12-02", "2024-12-31", 50),
  run("2025-03-10", "2025-04-30", 20, "live"),
];

/** A pairing seen exactly once — no pattern worth stating. */
export const oneOffRun: RawTransferBonus = {
  history_key: "brex::singapore::2025-06-30",
  bonus_key: "brex::singapore",
  from_program: "Brex",
  to_program: "Singapore KrisFlyer",
  from_program_type: "Credit Card",
  to_program_type: "Airline",
  bonus_percent: 30,
  transfer_ratio: "1:1",
  start_date: "2025-06-01",
  end_date: "2025-06-30",
  status: "expired",
  source_name: "Frequent Miler",
  source_url: "https://frequentmiler.com/current-point-transfer-bonuses/",
  origin: "backfill",
  id: "id-brex",
  is_sample: false,
};

/** The extraction failure the validation rules exist to catch. */
export const marriottToMarriottHistory: RawTransferBonus = {
  history_key: "marriott::marriott::2026-10-15",
  bonus_key: "marriott::marriott",
  from_program: "Marriott Bonvoy",
  to_program: "Marriott Bonvoy",
  from_program_type: "Hotel",
  to_program_type: "Hotel",
  bonus_percent: 70,
  start_date: "",
  end_date: "2026-10-15",
  status: "expired",
  source_url: "https://awardtravelfinder.com/transfer-bonuses/chase-ultimate-rewards",
  source_name: "Award Travel Finder",
  origin: "backfill",
  id: "id-marriott",
  is_sample: false,
};

export const historyFixture: RawTransferBonus[] = [
  ...amexHiltonRuns,
  oneOffRun,
  marriottToMarriottHistory,
];
