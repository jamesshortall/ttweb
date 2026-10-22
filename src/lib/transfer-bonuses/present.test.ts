import { describe, expect, it } from "vitest";
import { normalizeFeed, type TransferBonus } from "./normalize";
import { liveFeedFixture } from "./__fixtures__/feed";
import {
  currentBonuses,
  daysRemaining,
  formatPercent,
  formatWindow,
  groupByProgram,
  needsVerifying,
} from "./present";

const ALL = normalizeFeed(liveFeedFixture).accepted;
/** The day the fixture was captured, so the expectations are fixed in time. */
const TODAY = "2026-10-21";

function find(key: string): TransferBonus {
  const match = ALL.find((bonus) => bonus.bonusKey === key);
  if (!match) throw new Error(`fixture missing ${key}`);
  return match;
}

describe("currentBonuses", () => {
  it("shows the live bonuses and no others", () => {
    const live = currentBonuses(ALL, TODAY);
    // 14 in the feed, less the two Capital One runs upstream marked expired.
    expect(live).toHaveLength(12);
    expect(live.map((bonus) => bonus.bonusKey)).not.toContain("capital one::japan airlines");
  });

  it("leads with the biggest bonus", () => {
    const live = currentBonuses(ALL, TODAY);
    // Someone scanning this page wants the largest bonus, not the one ending
    // soonest — Wyndham to United at 100%.
    expect(live[0]?.bonusKey).toBe("wyndham::united airlines");
    expect(live[0]?.bonusPercent).toBe(100);
  });

  it("breaks ties on the closer deadline", () => {
    const live = currentBonuses(ALL, TODAY);
    const at35 = live.filter((bonus) => bonus.bonusPercent === 35);
    expect(at35).toHaveLength(2);
    const ends = at35.map((bonus) => bonus.endDate);
    expect(ends).toEqual([...ends].sort());
  });

  it("empties out once everything has ended", () => {
    expect(currentBonuses(ALL, "2027-01-01")).toHaveLength(1); // only the open-ended one
  });
});

describe("groupByProgram", () => {
  const groups = groupByProgram(currentBonuses(ALL, TODAY));

  it("gathers each source program once", () => {
    const names = groups.map((group) => group.fromProgram);
    expect(new Set(names).size).toBe(names.length);
    expect(names).toContain("RoveMiles");
  });

  it("orders programs by their best live bonus", () => {
    expect(groups[0]?.fromProgram).toBe("Wyndham");
    const bests = groups.map((group) => group.bonuses[0]?.bonusPercent ?? 0);
    expect(bests).toEqual([...bests].sort((a, b) => b - a));
  });

  it("keeps every live bonus", () => {
    const total = groups.reduce((sum, group) => sum + group.bonuses.length, 0);
    expect(total).toBe(12);
  });
});

describe("formatWindow", () => {
  it("says Ongoing rather than leaving a blank", () => {
    // Upstream sends no end date for an open-ended bonus; a blank cell reads
    // as broken rather than as "no deadline".
    expect(formatWindow(find("wyndham::united airlines"), TODAY)).toBe("Ongoing");
  });

  it("leads with the deadline for a bonus already running", () => {
    expect(formatWindow(find("citi thankyou::qatar airways"), TODAY)).toBe("Through 31 Oct");
  });

  it("shows both ends for a bonus that has not started", () => {
    expect(formatWindow(find("rovemiles::jetblue"), "2026-10-01")).toBe("15 Oct – 14 Nov");
  });

  it("adds the year only when it is not the current one", () => {
    expect(formatWindow(find("rovemiles::jetblue"), "2025-12-01")).toContain("2026");
    expect(formatWindow(find("citi thankyou::qatar airways"), TODAY)).not.toContain("2026");
  });
});

describe("daysRemaining", () => {
  it("counts the days to the deadline", () => {
    expect(daysRemaining(find("citi thankyou::qatar airways"), TODAY)).toBe(10);
  });

  it("is zero on the final day, so the bonus still shows", () => {
    expect(daysRemaining(find("citi thankyou::qatar airways"), "2026-10-31")).toBe(0);
  });

  it("has no answer for an open-ended bonus", () => {
    expect(daysRemaining(find("wyndham::united airlines"), TODAY)).toBeNull();
  });
});

describe("formatPercent", () => {
  it("drops a pointless decimal", () => {
    // Upstream sends floats: 30.0 should read "30%", not "30.0%".
    expect(formatPercent(30)).toBe("30%");
    expect(formatPercent(100)).toBe("100%");
  });

  it("keeps a meaningful one", () => {
    expect(formatPercent(27.5)).toBe("27.5%");
  });
});

describe("needsVerifying", () => {
  it("flags a bonus upstream has stopped finding", () => {
    expect(needsVerifying(find("capital one::japan airlines"))).toBe(true);
  });

  it("leaves a confirmed bonus unflagged", () => {
    expect(needsVerifying(find("wyndham::united airlines"))).toBe(false);
  });
});
