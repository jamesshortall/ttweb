import { describe, expect, it } from "vitest";
import { deviceFromUserAgent, targetableDevice } from "@/lib/ads/device";

describe("deviceFromUserAgent", () => {
  it("detects mobile", () => {
    expect(
      deviceFromUserAgent(
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605 Mobile/15E148",
      ),
    ).toBe("mobile");
    expect(
      deviceFromUserAgent("Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit Mobile Safari"),
    ).toBe("mobile");
  });

  it("detects tablet (iPad + Android-without-mobile)", () => {
    expect(deviceFromUserAgent("Mozilla/5.0 (iPad; CPU OS 17_0) AppleWebKit Safari")).toBe("tablet");
    expect(deviceFromUserAgent("Mozilla/5.0 (Linux; Android 13; SM-X710) AppleWebKit Safari")).toBe(
      "tablet",
    );
  });

  it("detects desktop", () => {
    expect(
      deviceFromUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit Chrome Safari"),
    ).toBe("desktop");
  });

  it("returns unknown for missing UA", () => {
    expect(deviceFromUserAgent(null)).toBe("unknown");
    expect(deviceFromUserAgent("")).toBe("unknown");
  });
});

describe("targetableDevice", () => {
  it("maps unknown to desktop, otherwise identity", () => {
    expect(targetableDevice("unknown")).toBe("desktop");
    expect(targetableDevice("mobile")).toBe("mobile");
    expect(targetableDevice("tablet")).toBe("tablet");
    expect(targetableDevice("desktop")).toBe("desktop");
  });
});
