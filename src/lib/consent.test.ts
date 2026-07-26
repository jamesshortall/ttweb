import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { readConsent, writeConsent } from "@/lib/consent";

describe("consent storage", () => {
  beforeEach(() => window.localStorage.clear());
  afterEach(() => window.localStorage.clear());

  it("defaults advertising to false and round-trips both flags", () => {
    writeConsent(true, true);
    expect(readConsent()).toMatchObject({ analytics: true, advertising: true });
    writeConsent(true);
    expect(readConsent()).toMatchObject({ analytics: true, advertising: false });
  });

  it("reads legacy decisions (no advertising field) as advertising=false", () => {
    window.localStorage.setItem(
      "tt-cookie-consent",
      JSON.stringify({ analytics: true, decidedAt: new Date().toISOString() }),
    );
    expect(readConsent()).toMatchObject({ analytics: true, advertising: false });
  });

  it("returns null for malformed data", () => {
    window.localStorage.setItem("tt-cookie-consent", JSON.stringify({ nope: 1 }));
    expect(readConsent()).toBeNull();
  });
});
