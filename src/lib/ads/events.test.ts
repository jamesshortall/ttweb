import { describe, expect, it } from "vitest";
import { buildDedupHash, isLikelyBot } from "@/lib/ads/events";

describe("isLikelyBot", () => {
  it("flags common crawlers and tools", () => {
    expect(isLikelyBot("Googlebot/2.1 (+http://www.google.com/bot.html)")).toBe(true);
    expect(isLikelyBot("curl/8.0")).toBe(true);
    expect(isLikelyBot("python-requests/2.31")).toBe(true);
    expect(isLikelyBot("SomeHeadlessChrome")).toBe(true);
  });

  it("treats a missing UA as bot", () => {
    expect(isLikelyBot(null)).toBe(true);
    expect(isLikelyBot("")).toBe(true);
  });

  it("passes a normal browser UA", () => {
    expect(
      isLikelyBot(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605 Version/17 Safari/605",
      ),
    ).toBe(false);
  });
});

describe("buildDedupHash", () => {
  const meta = { ip: "203.0.113.5", userAgent: "Mozilla/5.0 Safari" };

  it("is stable for the same ad + visitor signal", () => {
    expect(buildDedupHash("ad1", meta)).toBe(buildDedupHash("ad1", meta));
  });

  it("differs across ads, IPs, and user agents", () => {
    const base = buildDedupHash("ad1", meta);
    expect(buildDedupHash("ad2", meta)).not.toBe(base);
    expect(buildDedupHash("ad1", { ...meta, ip: "198.51.100.9" })).not.toBe(base);
    expect(buildDedupHash("ad1", { ...meta, userAgent: "Other" })).not.toBe(base);
  });

  it("never contains the raw IP", () => {
    expect(buildDedupHash("ad1", meta)).not.toContain("203.0.113.5");
  });
});
