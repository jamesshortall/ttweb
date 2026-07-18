import { describe, expect, it } from "vitest";
import {
  centsPerPoint,
  cn,
  formatCentsPerPoint,
  formatNumber,
  formatUsd,
  shuffledRotation,
} from "@/lib/utils";

describe("centsPerPoint", () => {
  it("computes the QSuites example (~9.0¢)", () => {
    expect(centsPerPoint(7000, 279, 75_000)).toBeCloseTo(8.96, 1);
  });

  it("computes the Austrian example (~11.2¢)", () => {
    expect(centsPerPoint(7900, 58, 70_000)).toBeCloseTo(11.2, 1);
  });

  it("returns 0 for non-positive points", () => {
    expect(centsPerPoint(1000, 0, 0)).toBe(0);
  });
});

describe("formatters", () => {
  it("formats cents-per-point to one decimal with cent sign", () => {
    expect(formatCentsPerPoint(8.957)).toBe("9.0¢");
  });

  it("formats numbers and USD", () => {
    expect(formatNumber(75_000)).toBe("75,000");
    expect(formatUsd(7000)).toBe("$7,000");
  });
});

describe("cn", () => {
  it("joins truthy class names only", () => {
    expect(cn("a", false, undefined, "b", null)).toBe("a b");
  });
});

describe("shuffledRotation", () => {
  it("returns a permutation of all indices", () => {
    const order = shuffledRotation(8);
    expect([...order].sort((a, b) => a - b)).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
  });

  it("never starts with the previous image (no repeat across cycles)", () => {
    for (let i = 0; i < 200; i++) {
      const previous = i % 5;
      const order = shuffledRotation(5, previous);
      expect(order[0]).not.toBe(previous);
    }
  });

  it("handles single-image collections", () => {
    expect(shuffledRotation(1, 0)).toEqual([0]);
  });
});
