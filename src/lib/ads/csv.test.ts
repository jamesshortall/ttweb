import { describe, expect, it } from "vitest";
import { toCsv } from "@/lib/ads/csv";

describe("toCsv", () => {
  it("quotes fields and escapes embedded quotes", () => {
    const csv = toCsv(["a", "b"], [["x", 'has "quote"']]);
    expect(csv).toBe('"a","b"\r\n"x","has ""quote"""');
  });

  it("renders null/undefined as empty and numbers as text", () => {
    const csv = toCsv(["a", "b", "c"], [[null, undefined, 42]]);
    expect(csv).toBe('"a","b","c"\r\n"","","42"');
  });

  it("neutralizes formula injection", () => {
    const csv = toCsv(["x"], [["=SUM(A1:A9)"], ["+1"], ["-2"], ["@cmd"]]);
    expect(csv).toContain('"\'=SUM(A1:A9)"');
    expect(csv).toContain('"\'+1"');
    expect(csv).toContain('"\'-2"');
    expect(csv).toContain('"\'@cmd"');
  });
});
