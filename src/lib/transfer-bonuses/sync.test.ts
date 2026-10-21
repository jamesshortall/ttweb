import { describe, expect, it } from "vitest";
import { abortReason } from "./sync";

/**
 * The guards exist so that a broken upstream cannot blank the page. Getting
 * them wrong is expensive in both directions: too strict and the page silently
 * stops updating, too loose and one bad morning wipes it.
 */
describe("abortReason", () => {
  it("refuses an empty feed", () => {
    expect(abortReason(0, 14)).toBe("feed returned no records");
  });

  it("refuses an empty feed even on the very first run", () => {
    expect(abortReason(0, null)).toBe("feed returned no records");
  });

  it("refuses a feed that has collapsed", () => {
    expect(abortReason(3, 14)).toBe("feed shrank from 14 to 3 records");
  });

  it("allows an ordinary day", () => {
    expect(abortReason(14, 14)).toBeNull();
  });

  it("allows the month-end drop-off", () => {
    // Bonuses genuinely do expire in batches at month end, so the threshold is
    // a tripwire for a broken scraper, not a rule about how fast bonuses end.
    expect(abortReason(8, 14)).toBeNull();
  });

  it("allows a growing feed", () => {
    expect(abortReason(30, 14)).toBeNull();
  });

  it("allows the first run, with nothing to compare against", () => {
    expect(abortReason(14, null)).toBeNull();
  });

  it("allows any feed when the last run saw nothing", () => {
    expect(abortReason(1, 0)).toBeNull();
  });
});
