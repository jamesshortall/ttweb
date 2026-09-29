import { afterEach, describe, expect, it, vi } from "vitest";

/** Re-import with a given environment; serverEnv caches per module instance. */
async function loadTurnstile(siteKey = "", secret = "") {
  vi.resetModules();
  vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", siteKey);
  vi.stubEnv("TURNSTILE_SECRET_KEY", secret);
  return import("@/lib/turnstile");
}

function mockVerify(response: { ok: boolean; body?: unknown }) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: response.ok,
    status: response.ok ? 200 : 500,
    json: async () => response.body ?? {},
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("turnstile", () => {
  it("reports unconfigured when neither key is set", async () => {
    const { isTurnstileConfigured } = await loadTurnstile();
    expect(isTurnstileConfigured()).toBe(false);
  });

  it("reports configured when both keys are set", async () => {
    const { isTurnstileConfigured } = await loadTurnstile("site", "secret");
    expect(isTurnstileConfigured()).toBe(true);
  });

  it("passes everything through when unconfigured — nothing to verify", async () => {
    const { verifyTurnstileToken } = await loadTurnstile();
    expect(await verifyTurnstileToken(undefined)).toBe(true);
  });

  it("rejects a missing token once configured", async () => {
    const { verifyTurnstileToken } = await loadTurnstile("site", "secret");
    expect(await verifyTurnstileToken(undefined)).toBe(false);
  });

  it("accepts a token Cloudflare confirms", async () => {
    const fetchMock = mockVerify({ ok: true, body: { success: true } });
    const { verifyTurnstileToken } = await loadTurnstile("site", "secret");
    expect(await verifyTurnstileToken("token")).toBe(true);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("rejects a token Cloudflare refuses", async () => {
    mockVerify({ ok: true, body: { success: false, "error-codes": ["invalid-input-response"] } });
    const { verifyTurnstileToken } = await loadTurnstile("site", "secret");
    expect(await verifyTurnstileToken("token")).toBe(false);
  });

  it("fails closed when the verifier is unreachable", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("network down")));
    const { verifyTurnstileToken } = await loadTurnstile("site", "secret");
    expect(await verifyTurnstileToken("token")).toBe(false);
  });

  it("fails closed on a non-OK verifier response", async () => {
    mockVerify({ ok: false });
    const { verifyTurnstileToken } = await loadTurnstile("site", "secret");
    expect(await verifyTurnstileToken("token")).toBe(false);
  });
});
