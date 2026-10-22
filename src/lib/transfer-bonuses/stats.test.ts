import { describe, expect, it } from "vitest";
import { normalizeHistoryFeed } from "./history";
import { amexHiltonRuns, historyFixture } from "./__fixtures__/history";
import { cadence, monthName, summarizePairings, verdictForOffer } from "./stats";

const PAIRINGS = summarizePairings(normalizeHistoryFeed(historyFixture).accepted);
const amexHilton = PAIRINGS.find((p) => p.bonusKey === "amex membership::hilton");
if (!amexHilton) throw new Error("fixture missing the Amex/Hilton pairing");

describe("summarizePairings", () => {
  it("gathers every run of a pairing", () => {
    expect(amexHilton.runCount).toBe(5);
    expect(amexHilton.fromProgram).toBe("Amex Membership Rewards");
    expect(amexHilton.toProgram).toBe("Hilton Honors");
  });

  it("computes the average and the best ever", () => {
    // 25, 30, 35, 50, 20 → mean 32, max 50.
    expect(amexHilton.averagePercent).toBe(32);
    expect(amexHilton.bestPercent).toBe(50);
  });

  it("reports the most recent run, not the first", () => {
    expect(amexHilton.lastRunStart).toBe("2025-03-10");
  });

  it("finds the months this pairing tends to start in", () => {
    // Two Septembers and two Decembers; March once.
    expect(amexHilton.typicalMonths).toEqual([9, 12]);
  });

  it("counts how much of the evidence is reconstructed", () => {
    expect(amexHilton.backfilledRuns).toBe(4);
  });

  it("orders pairings by how much evidence they carry", () => {
    // A pairing seen five times tells you far more than one seen once.
    expect(PAIRINGS[0]?.bonusKey).toBe("amex membership::hilton");
    const counts = PAIRINGS.map((p) => p.runCount);
    expect(counts).toEqual([...counts].sort((a, b) => b - a));
  });

  it("still summarizes a pairing seen only once", () => {
    const brex = PAIRINGS.find((p) => p.bonusKey === "brex::singapore");
    expect(brex?.runCount).toBe(1);
    expect(brex?.medianGapDays).toBeNull();
  });
});

describe("verdictForOffer", () => {
  it("says nothing when the evidence is too thin", () => {
    // Two runs are not a pattern, and a confident claim from thin evidence is
    // worse than no claim.
    const brex = PAIRINGS.find((p) => p.bonusKey === "brex::singapore");
    expect(brex && verdictForOffer(brex, 30)).toBeNull();
  });

  it("recognises an all-time best", () => {
    expect(verdictForOffer(amexHilton, 50)).toBe(
      "matches the best this pairing has ever run",
    );
    expect(verdictForOffer(amexHilton, 60)).toBe(
      "matches the best this pairing has ever run",
    );
  });

  it("places an offer against the average", () => {
    expect(verdictForOffer(amexHilton, 40)).toBe("above its average");
    expect(verdictForOffer(amexHilton, 32)).toBe("about average");
    expect(verdictForOffer(amexHilton, 25)).toBe("below its average");
  });
});

describe("cadence", () => {
  it("describes how often a pairing comes round", () => {
    // Gaps between starts: 91, 279, 88 and 98 days, so a median of 94 — a
    // pairing that turns up each September and December does run about twice
    // a year, and the median is what keeps the one long gap from skewing it.
    expect(amexHilton.medianGapDays).toBe(94.5);
    expect(cadence(amexHilton)).toBe("roughly twice a year");
  });

  it("stays silent when there is too little to go on", () => {
    const brex = PAIRINGS.find((p) => p.bonusKey === "brex::singapore");
    expect(brex && cadence(brex)).toBeNull();
  });
});

describe("monthName", () => {
  it("names a month", () => {
    expect(monthName(9)).toBe("September");
    expect(monthName(12)).toBe("December");
  });

  it("returns empty for a month that does not exist", () => {
    expect(monthName(13)).toBe("");
  });
});

describe("summarizePairings on an empty archive", () => {
  it("returns nothing rather than throwing", () => {
    expect(summarizePairings([])).toEqual([]);
  });
});

describe("the Amex/Hilton runs stand alone", () => {
  it("summarize to one pairing", () => {
    expect(summarizePairings(normalizeHistoryFeed(amexHiltonRuns).accepted)).toHaveLength(1);
  });
});
