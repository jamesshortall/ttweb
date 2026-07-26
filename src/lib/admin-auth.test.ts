import { describe, expect, it } from "vitest";
import { signSession, verifySession } from "@/lib/admin-auth";

const SECRET = "admin-session-secret";
const NOW = 1_700_000_000_000;

describe("session tokens", () => {
  it("verifies a fresh token", () => {
    const token = signSession(NOW + 60_000, SECRET);
    expect(verifySession(token, SECRET, NOW)).toBe(true);
  });

  it("rejects an expired token", () => {
    const token = signSession(NOW - 1, SECRET);
    expect(verifySession(token, SECRET, NOW)).toBe(false);
  });

  it("rejects a tampered payload or signature", () => {
    const token = signSession(NOW + 60_000, SECRET);
    // Bump the expiry without re-signing.
    const [, sig] = token.split(".");
    const forged = `${NOW + 999_999}.${sig}`;
    expect(verifySession(forged, SECRET, NOW)).toBe(false);
    expect(verifySession(token, "wrong-secret", NOW)).toBe(false);
  });

  it("rejects missing/garbage tokens", () => {
    expect(verifySession(undefined, SECRET, NOW)).toBe(false);
    expect(verifySession("nope", SECRET, NOW)).toBe(false);
  });
});
