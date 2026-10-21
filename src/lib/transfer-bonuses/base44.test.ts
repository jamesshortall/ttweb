import { afterEach, describe, expect, it, vi } from "vitest";
import { Base44Error, fetchCurrentBonuses, isBase44Configured } from "./base44";

/**
 * The failure paths matter more than the happy one here: every one of them
 * ends with the page keeping its previous data, so each needs to be
 * distinguishable in a log at six in the morning.
 */

const configured = { BASE44_APP_ID: "app-123", BASE44_ACCESS_TOKEN: "token-abc" };
let env: Record<string, string | undefined> = { ...configured };

vi.mock("@/lib/env", () => ({ serverEnv: () => env }));

function respondWith(body: unknown, init?: { ok?: boolean; status?: number }) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: init?.ok ?? true,
    status: init?.status ?? 200,
    json: async () => body,
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
  env = { ...configured };
});

describe("isBase44Configured", () => {
  it("is false until both halves are present", () => {
    env = {};
    expect(isBase44Configured()).toBe(false);
    env = { BASE44_APP_ID: "app-123" };
    expect(isBase44Configured()).toBe(false);
    env = { ...configured };
    expect(isBase44Configured()).toBe(true);
  });
});

describe("fetchCurrentBonuses", () => {
  it("requests the TransferBonus entity with a bearer token", async () => {
    const fetchMock = respondWith([]);
    await fetchCurrentBonuses();

    const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://app.base44.com/api/apps/app-123/entities/TransferBonus");
    expect((options.headers as Record<string, string>).Authorization).toBe("Bearer token-abc");
    // A cached feed would quietly serve yesterday's bonuses.
    expect(options.cache).toBe("no-store");
  });

  it("returns the records upstream sends", async () => {
    respondWith([{ bonus_key: "amex::ana" }]);
    await expect(fetchCurrentBonuses()).resolves.toEqual([{ bonus_key: "amex::ana" }]);
  });

  it("names the token on a 401, because that one needs a human", async () => {
    respondWith(null, { ok: false, status: 401 });
    await expect(fetchCurrentBonuses()).rejects.toThrow(/401.*BASE44_ACCESS_TOKEN/);
  });

  it("reports an upstream server error by status", async () => {
    respondWith(null, { ok: false, status: 503 });
    await expect(fetchCurrentBonuses()).rejects.toThrow("Base44 returned 503");
  });

  it("refuses a body that is not an array", async () => {
    // The entity endpoint returns a bare array; an envelope here would mean
    // the endpoint moved, and treating it as empty would trip the guard with
    // a misleading reason.
    respondWith({ items: [], has_more: false });
    await expect(fetchCurrentBonuses()).rejects.toThrow("unexpected shape");
  });

  it("refuses a body that is not JSON at all", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => {
          throw new SyntaxError("Unexpected token <");
        },
      }),
    );
    await expect(fetchCurrentBonuses()).rejects.toThrow("unexpected shape");
  });

  it("survives a network failure without leaking the cause", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("fetch failed")));
    await expect(fetchCurrentBonuses()).rejects.toThrow(Base44Error);
    await expect(fetchCurrentBonuses()).rejects.toThrow("Request to Base44 failed (TypeError)");
  });

  it("refuses to call out when unconfigured", async () => {
    env = {};
    const fetchMock = respondWith([]);
    await expect(fetchCurrentBonuses()).rejects.toThrow("not configured");
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
