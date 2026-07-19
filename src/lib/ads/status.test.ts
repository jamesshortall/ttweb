import { describe, expect, it } from "vitest";
import { computeEffectiveStatus, needsStatusRewrite } from "@/lib/ads/status";

const NOW = new Date("2025-06-15T12:00:00Z");
const PAST = "2025-06-01T00:00:00Z";
const FUTURE = "2025-07-01T00:00:00Z";

describe("computeEffectiveStatus", () => {
  it("activates a scheduled ad once its start passes", () => {
    expect(computeEffectiveStatus({ status: "scheduled", startDate: PAST }, NOW)).toBe("active");
    expect(computeEffectiveStatus({ status: "scheduled", startDate: FUTURE }, NOW)).toBe(
      "scheduled",
    );
  });

  it("expires scheduled or active ads past their end", () => {
    expect(computeEffectiveStatus({ status: "scheduled", endDate: PAST }, NOW)).toBe("expired");
    expect(computeEffectiveStatus({ status: "active", endDate: PAST }, NOW)).toBe("expired");
  });

  it("keeps an active ad active within its window", () => {
    expect(computeEffectiveStatus({ status: "active", endDate: FUTURE }, NOW)).toBe("active");
    expect(computeEffectiveStatus({ status: "active" }, NOW)).toBe("active");
  });

  it("never auto-changes admin-controlled states", () => {
    for (const status of ["draft", "pending", "paused", "archived", "expired"] as const) {
      expect(computeEffectiveStatus({ status, startDate: PAST, endDate: FUTURE }, NOW)).toBe(status);
    }
  });
});

describe("needsStatusRewrite", () => {
  it("flags only when the computed status differs", () => {
    expect(needsStatusRewrite({ status: "scheduled", startDate: PAST }, NOW)).toBe(true);
    expect(needsStatusRewrite({ status: "active", endDate: FUTURE }, NOW)).toBe(false);
  });
});
