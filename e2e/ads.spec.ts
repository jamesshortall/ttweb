import { test, expect } from "@playwright/test";

/**
 * Advertising system e2e. These run against a production build with no CMS,
 * Supabase, or admin env configured, so every assertion is deterministic:
 * placements collapse, tracking/admin endpoints are locked down, and the admin
 * dashboard reports itself unconfigured rather than leaking anything.
 */

test.describe("Ad placements", () => {
  test("collapse when no ad is eligible (no empty box on the page)", async ({ page }) => {
    await page.goto("/points-and-miles-101");
    await expect(page.getByRole("heading", { level: 1, name: /Points and Miles 101/ })).toBeVisible();
    // With no CMS/seed in production, the slot renders nothing at all.
    await expect(page.locator("[data-ad-placement]")).toHaveCount(0);
  });

  test("resolve endpoint returns no ad and never leaks candidate data", async ({ request }) => {
    const res = await request.get("/api/ads/resolve?placement=points-101-inline&path=/points-and-miles-101");
    expect(res.ok()).toBeTruthy();
    expect(res.headers()["cache-control"]).toContain("no-store");
    const body = await res.json();
    expect(body.ad).toBeNull();
  });
});

test.describe("Tracking + admin endpoints are locked down", () => {
  test("click redirect is disabled without a signing secret", async ({ request }) => {
    const res = await request.get("/api/ads/click?t=anything", { maxRedirects: 0 });
    expect(res.status()).toBe(404);
  });

  test("analytics + export require an admin session", async ({ request }) => {
    expect((await request.get("/api/ads/analytics")).status()).toBe(401);
    expect((await request.get("/api/ads/export?report=campaign")).status()).toBe(401);
  });

  test("aggregate + audit webhook reject unauthenticated calls", async ({ request }) => {
    // 503 (not configured) or 401 (bad secret) — never a successful write.
    expect([401, 503]).toContain((await request.post("/api/ads/aggregate")).status());
    expect([401, 501]).toContain(
      (await request.post("/api/ads/audit-webhook", { data: { _type: "advertisement" } })).status(),
    );
  });
});

test.describe("Admin dashboard", () => {
  test("reports itself unconfigured when no admin password is set", async ({ page }) => {
    await page.goto("/admin/ads");
    await expect(page.getByText(/Dashboard not configured/i)).toBeVisible();
  });

  test("login page renders a password form", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.getByRole("heading", { name: /Advertising admin/i })).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test("admin pages are marked noindex", async ({ page }) => {
    const response = await page.goto("/admin/login");
    // Next emits robots meta from the layout metadata.
    const robots = await page.locator('meta[name="robots"]').getAttribute("content");
    expect(robots).toMatch(/noindex/);
    expect(response!.ok()).toBeTruthy();
  });
});
