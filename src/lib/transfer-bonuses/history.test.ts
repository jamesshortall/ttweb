import { describe, expect, it } from "vitest";
import { normalizeHistoryFeed } from "./history";
import {
  amexHiltonRuns,
  historyFixture,
  marriottToMarriottHistory,
} from "./__fixtures__/history";

describe("normalizeHistoryFeed", () => {
  it("accepts the good runs and rejects only the broken one", () => {
    const { accepted, rejected } = normalizeHistoryFeed(historyFixture);
    expect(accepted).toHaveLength(6);
    expect(rejected).toEqual([
      { bonusKey: "marriott::marriott", reason: "from and to are the same program" },
    ]);
  });

  it("keys runs on upstream's history_key, not a derived one", () => {
    // Upstream already identifies a run as pairing + end date; deriving our
    // own key would risk two ideas of the same run.
    const { accepted } = normalizeHistoryFeed(amexHiltonRuns);
    expect(accepted[0]?.historyKey).toBe("amex membership::hilton::2023-10-15");
    expect(new Set(accepted.map((run) => run.historyKey)).size).toBe(5);
  });

  it("groups every run of a pairing under one bonus_key", () => {
    const { accepted } = normalizeHistoryFeed(amexHiltonRuns);
    expect(new Set(accepted.map((run) => run.bonusKey))).toEqual(
      new Set(["amex membership::hilton"]),
    );
  });

  it("keeps the from_bank that only history carries", () => {
    const { accepted } = normalizeHistoryFeed(amexHiltonRuns);
    expect(accepted[0]?.fromBank).toBe("American Express");
  });

  it("distinguishes reconstructed runs from observed ones", () => {
    const { accepted } = normalizeHistoryFeed(amexHiltonRuns);
    expect(accepted.filter((run) => run.origin === "backfill")).toHaveLength(4);
    expect(accepted.filter((run) => run.origin === "live")).toHaveLength(1);
  });

  it("turns an empty start date into null", () => {
    const { accepted } = normalizeHistoryFeed([
      { ...marriottToMarriottHistory, to_program: "Air Canada Aeroplan" },
    ]);
    expect(accepted[0]?.startDate).toBeNull();
    expect(accepted[0]?.endDate).toBe("2026-10-15");
  });

  it("never carries upstream's personal data through", () => {
    const { accepted } = normalizeHistoryFeed(historyFixture);
    const serialized = JSON.stringify(accepted);
    expect(serialized).not.toContain("created_by");
    expect(serialized).not.toContain("example.com");
  });

  it("rejects a record with no history key", () => {
    const [first] = amexHiltonRuns;
    const { accepted, rejected } = normalizeHistoryFeed([{ ...first, history_key: "" }]);
    expect(accepted).toEqual([]);
    expect(rejected[0]?.reason).toBe("missing program or key");
  });
});
