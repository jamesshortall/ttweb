import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { revalidatePath } from "next/cache";
import { POST } from "./route";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

const ENDPOINT = "https://www.traveltechnician.info/api/revalidate";
const SECRET = "test-secret-value";

function post(init?: { header?: string; query?: string }): Promise<Response> {
  const url = init?.query ? `${ENDPOINT}?secret=${init.query}` : ENDPOINT;
  return POST(
    new Request(url, {
      method: "POST",
      headers: init?.header ? { authorization: `Bearer ${init.header}` } : undefined,
    }),
  );
}

describe("POST /api/revalidate", () => {
  const original = process.env.SANITY_REVALIDATE_SECRET;

  beforeEach(() => {
    vi.mocked(revalidatePath).mockClear();
    process.env.SANITY_REVALIDATE_SECRET = SECRET;
  });
  afterEach(() => {
    process.env.SANITY_REVALIDATE_SECRET = original;
  });

  it("is inert (501) until the secret is configured", async () => {
    delete process.env.SANITY_REVALIDATE_SECRET;
    const res = await post({ header: SECRET });
    expect(res.status).toBe(501);
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("rejects a missing secret", async () => {
    const res = await post();
    expect(res.status).toBe(401);
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("rejects a wrong secret", async () => {
    const res = await post({ header: "not-the-secret" });
    expect(res.status).toBe(401);
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("revalidates the whole tree with the correct secret via header", async () => {
    const res = await post({ header: SECRET });
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toMatchObject({ revalidated: true });
    expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
  });

  it("also accepts the secret as a query parameter", async () => {
    const res = await post({ query: SECRET });
    expect(res.status).toBe(200);
    expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
  });
});
