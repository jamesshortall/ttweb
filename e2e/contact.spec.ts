import { test, expect } from "@playwright/test";

test.describe("Contact form", () => {
  test("submits successfully with valid input", async ({ page }) => {
    await page.goto("/contact");
    await page.getByRole("textbox", { name: "Name" }).fill("Ada Traveler");
    await page.getByRole("textbox", { name: "Email" }).fill("ada@example.com");
    await page.getByLabel("What can Jim help you with?").selectOption("free-consultation");
    await page
      .getByRole("textbox", { name: "Message" })
      .fill("I have about 200,000 points and want help planning a trip to Japan next spring.");
    await page.getByRole("checkbox").check();

    // Wait out the server's minimum-fill-time spam heuristic.
    await page.waitForTimeout(3100);
    await page.getByRole("button", { name: "Send Message" }).click();

    await expect(page.getByText("Message sent — thank you!")).toBeVisible({ timeout: 10_000 });
  });

  test("shows accessible errors for an empty submission", async ({ page }) => {
    await page.goto("/contact");
    await page.getByRole("button", { name: "Send Message" }).click();

    await expect(page.getByRole("alert").first()).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Name" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    // Focusable and correctable: errors are tied to fields via aria-describedby.
    await expect(page.getByText("Please enter your name.")).toBeVisible();
    await expect(page.getByText(/Please choose an inquiry category/)).toBeVisible();
  });

  test("preselects the category from the ?topic= query parameter", async ({ page }) => {
    await page.goto("/contact?topic=cardmaster-support");
    await expect(page.getByLabel("What can Jim help you with?")).toHaveValue("cardmaster-support");
  });

  test("API rejects invalid payloads server-side", async ({ request }) => {
    const response = await request.post("/api/contact", {
      data: { name: "x", email: "nope", category: "bad", message: "hi", consent: false },
    });
    expect(response.status()).toBe(422);
    const body = (await response.json()) as { issues?: unknown[] };
    expect(Array.isArray(body.issues)).toBeTruthy();
  });

  test("API rate-limits rapid repeated submissions", async ({ request }) => {
    const payload = {
      name: "Rate Limit Probe",
      email: "probe@example.com",
      category: "general",
      message: "This is a rate limit probe message with enough length to validate.",
      consent: true,
      website: "",
      startedAt: Date.now() - 10_000,
    };
    const statuses: number[] = [];
    for (let i = 0; i < 7; i++) {
      const response = await request.post("/api/contact", {
        data: payload,
        headers: { "x-forwarded-for": "203.0.113.99" },
      });
      statuses.push(response.status());
    }
    expect(statuses).toContain(429);
  });
});
