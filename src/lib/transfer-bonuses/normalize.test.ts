import { describe, expect, it } from "vitest";
import {
  isCurrent,
  isUnconfirmed,
  isoDate,
  normalizeFeed,
  runKey,
  type TransferBonus,
} from "./normalize";
import { liveFeedFixture, marriottToMarriott, wellFormedRecord } from "./__fixtures__/feed";

/** Pull one bonus out of a normalized feed by its upstream key. */
function find(bonuses: TransferBonus[], key: string): TransferBonus {
  const match = bonuses.find((bonus) => bonus.bonusKey === key);
  if (!match) throw new Error(`fixture missing ${key}`);
  return match;
}

describe("normalizeFeed", () => {
  it("accepts every record in the live feed", () => {
    const { accepted, rejected } = normalizeFeed(liveFeedFixture);
    expect(accepted).toHaveLength(14);
    expect(rejected).toEqual([]);
  });

  it("never copies upstream's personal data through", () => {
    const { accepted } = normalizeFeed(liveFeedFixture);
    // The whole record, serialized — a field leaking in by any route shows up.
    const serialized = JSON.stringify(accepted);
    expect(serialized).not.toContain("created_by");
    expect(serialized).not.toContain("example.com");
    expect(serialized).not.toContain("no-reply.base44.com");
  });

  it("turns upstream's empty-string dates into nulls", () => {
    const { accepted } = normalizeFeed(liveFeedFixture);
    // Open-ended: no end date at all.
    expect(find(accepted, "wyndham::united airlines").endDate).toBeNull();
    // No start date, but a real end date.
    expect(find(accepted, "capital one::japan airlines").startDate).toBeNull();
    expect(find(accepted, "capital one::japan airlines").endDate).toBe("2026-10-24");
  });

  it("keeps ratios upstream writes in unusual forms", () => {
    const { accepted } = normalizeFeed(liveFeedFixture);
    expect(find(accepted, "capital one::japan airlines").transferRatio).toBe("2:1.5");
    expect(find(accepted, "marriott::air canada").transferRatio).toBe("3:1");
    // An empty ratio is absent, not an empty string.
    expect(find(accepted, "wyndham::united airlines").transferRatio).toBeNull();
  });

  it("rejects a bonus whose programs are the same", () => {
    const { accepted, rejected } = normalizeFeed([marriottToMarriott]);
    expect(accepted).toEqual([]);
    expect(rejected).toEqual([
      { bonusKey: "marriott::marriott", reason: "from and to are the same program" },
    ]);
  });

  it("reports rejections instead of silently shrinking the feed", () => {
    const { accepted, rejected } = normalizeFeed([...liveFeedFixture, marriottToMarriott]);
    expect(accepted).toHaveLength(14);
    expect(rejected).toHaveLength(1);
  });

  it.each([
    ["an implausibly large percentage", { bonus_percent: 5000 }, "implausible bonus percent"],
    ["a percentage too small to be real", { bonus_percent: 1 }, "implausible bonus percent"],
    ["a non-numeric percentage", { bonus_percent: "lots" }, "implausible bonus percent"],
    ["a missing from-program", { from_program: "" }, "missing program or key"],
    ["an unrecognized status", { status: "pending" }, "unrecognized status"],
    ["a sample record", { is_sample: true }, "sample record"],
  ])("rejects %s", (_label, override, reason) => {
    const { accepted, rejected } = normalizeFeed([{ ...wellFormedRecord, ...override }]);
    expect(accepted).toEqual([]);
    expect(rejected[0]?.reason).toBe(reason);
  });

  it("rejects a window that ends before it starts", () => {
    const { rejected } = normalizeFeed([
      { ...wellFormedRecord, start_date: "2026-11-14", end_date: "2026-10-15" },
    ]);
    expect(rejected[0]?.reason).toBe("end date precedes start date");
  });

  it("collapses duplicate runs rather than writing both", () => {
    const { accepted } = normalizeFeed([wellFormedRecord, { ...wellFormedRecord, bonus_percent: 25 }]);
    expect(accepted).toHaveLength(1);
    // The later record wins, so a correction upstream takes effect.
    expect(accepted[0]?.bonusPercent).toBe(25);
  });
});

describe("runKey", () => {
  it("separates two runs of the same pairing", () => {
    expect(runKey("amex::ana", "2026-03-01", "2026-03-31")).not.toBe(
      runKey("amex::ana", "2026-09-01", "2026-09-30"),
    );
  });

  it("keeps one run stable when its end date is extended", () => {
    // The real case: an organiser extends a live bonus. Keying on the end date
    // would fork a duplicate row mid-run.
    expect(runKey("amex::ana", "2026-03-01", "2026-03-31")).toBe(
      runKey("amex::ana", "2026-03-01", "2026-04-15"),
    );
  });

  it("falls back to the end date when there is no start date", () => {
    expect(runKey("capital one::jal", null, "2026-10-24")).toBe(
      "capital one::jal::2026-10-24",
    );
    // Which still separates this run from a later one.
    expect(runKey("capital one::jal", null, "2027-03-01")).not.toBe(
      runKey("capital one::jal", null, "2026-10-24"),
    );
  });

  it("falls back to 'open' when there are no dates at all", () => {
    expect(runKey("amex::ana", null, null)).toBe("amex::ana::open");
  });
});

describe("isCurrent", () => {
  const bonuses = normalizeFeed(liveFeedFixture).accepted;

  it("hides a bonus upstream marked expired, even with a future end date", () => {
    // Capital One to Japan Airlines: status "expired", end date 2026-10-24.
    // Trusting the date alone would advertise a bonus that no longer exists.
    const bonus = find(bonuses, "capital one::japan airlines");
    expect(bonus.endDate).toBe("2026-10-24");
    expect(isCurrent(bonus, "2026-10-21")).toBe(false);
  });

  it("hides an active bonus whose end date has passed", () => {
    const bonus = find(bonuses, "citi thankyou::avianca lifemiles");
    expect(bonus.status).toBe("active");
    expect(isCurrent(bonus, "2026-10-25")).toBe(false);
  });

  it("shows an active bonus inside its window", () => {
    expect(isCurrent(find(bonuses, "citi thankyou::qatar airways"), "2026-10-21")).toBe(true);
  });

  it("shows an open-ended bonus indefinitely", () => {
    const bonus = find(bonuses, "wyndham::united airlines");
    expect(bonus.endDate).toBeNull();
    expect(isCurrent(bonus, "2027-06-01")).toBe(true);
  });

  it("includes the final day of the window", () => {
    expect(isCurrent(find(bonuses, "citi thankyou::qatar airways"), "2026-10-31")).toBe(true);
  });
});

describe("isUnconfirmed", () => {
  it("flags a bonus upstream has stopped finding", () => {
    const bonuses = normalizeFeed(liveFeedFixture).accepted;
    expect(isUnconfirmed(find(bonuses, "capital one::japan airlines"))).toBe(true);
    expect(isUnconfirmed(find(bonuses, "wyndham::united airlines"))).toBe(false);
  });
});

describe("isoDate", () => {
  it("accepts a calendar date", () => {
    expect(isoDate("2026-10-21")).toBe("2026-10-21");
  });

  it("rejects an empty string, the form upstream uses for absent", () => {
    expect(isoDate("")).toBeNull();
  });

  it("rejects a date that looks valid but is not", () => {
    // new Date() would roll this into March rather than refusing it.
    expect(isoDate("2026-02-31")).toBeNull();
  });

  it.each([["21/10/2026"], ["October 21"], [null], [20261021]])("rejects %p", (value) => {
    expect(isoDate(value)).toBeNull();
  });
});
