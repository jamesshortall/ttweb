import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("renders hero, headline, and primary CTAs", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Travel Technician/);
    await expect(
      page.getByRole("heading", { level: 1, name: /Turn your points into unforgettable travel/ }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Start Using the Free App" })).toHaveAttribute(
      "href",
      /cardmaster\.traveltechnician\.info/,
    );
    await expect(page.getByRole("link", { name: "Get a Points Strategy" })).toHaveAttribute(
      "href",
      "/services",
    );
  });

  test("shows the statistics band including the placeholder-tagged value stat", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByText("5M+", { exact: true })).toBeVisible();
    await expect(page.getByText("30+", { exact: true })).toBeVisible();
    await expect(page.getByText("Final figure pending")).toBeVisible();
  });

  test("newsletter section announces coming soon without a signup input", async ({ page }) => {
    await page.goto("/");
    const newsletter = page.locator("section", {
      has: page.getByRole("heading", { name: /newsletter is coming soon/i }),
    });
    await expect(newsletter.first()).toBeVisible();
    await expect(newsletter.locator("input")).toHaveCount(0);
  });

  test("sends security headers", async ({ page }) => {
    const response = await page.goto("/");
    const headers = response!.headers();
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  });
});

test.describe("Navigation", () => {
  test("desktop navigation reaches every primary page", async ({ page, isMobile }) => {
    test.skip(isMobile === true, "desktop-only navigation");
    await page.goto("/");
    const destinations: Array<[string, string, RegExp]> = [
      ["Start Here", "/points-and-miles-101", /Points and Miles 101/],
      ["Services", "/services", /Personal help with your points strategy/],
      ["Success Stories", "/success-stories", /Real redemptions, real numbers/],
      ["About Jim", "/about", /engineer behind Travel Technician/],
    ];
    for (const [label, path, heading] of destinations) {
      await page
        .getByRole("navigation", { name: "Main" })
        .getByRole("link", { name: label })
        .click();
      await expect(page).toHaveURL(path);
      await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
    }
  });

  test("mobile menu opens, navigates, and closes", async ({ page, isMobile }) => {
    test.skip(isMobile !== true, "mobile-only navigation");
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    await page
      .getByRole("navigation", { name: "Mobile" })
      .getByRole("link", { name: "CardMaster", exact: true })
      .click();
    await expect(page).toHaveURL("/cardmaster");
    await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible();
  });

  test("skip link jumps to main content", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skipLink = page.getByRole("link", { name: "Skip to main content" });
    await expect(skipLink).toBeFocused();
    await skipLink.press("Enter");
    await expect(page).toHaveURL(/#main-content/);
  });

  test("404 page offers a way home", async ({ page }) => {
    const response = await page.goto("/this-route-does-not-exist");
    expect(response!.status()).toBe(404);
    await expect(page.getByText("404")).toBeVisible();
    await expect(page.getByRole("link", { name: "Back to the homepage" })).toBeVisible();
  });
});

test.describe("CardMaster", () => {
  test("landing page links out to the app and states it is free", async ({ page }) => {
    await page.goto("/cardmaster");
    const launchLinks = page.getByRole("link", { name: "Start Using CardMaster" });
    await expect(launchLinks.first()).toHaveAttribute(
      "href",
      "https://cardmaster.traveltechnician.info",
    );
    await expect(page.getByText("100% free · New accounts require approval")).toBeVisible();
    await expect(page.getByText(/never asks for banking credentials/).first()).toBeVisible();
  });
});

test.describe("Blog integration", () => {
  test("blog page links to the external blog without fake posts", async ({ page }) => {
    await page.goto("/blog");
    await expect(
      page.getByRole("link", { name: "Visit the Travel Technician Blog" }).first(),
    ).toHaveAttribute("href", "https://blog.traveltechnician.info");
    // No RSS configured in this environment → fallback card, never invented posts.
    await expect(page.getByText("Fresh tips are on the blog")).toBeVisible();
  });
});

test.describe("Success stories", () => {
  test("shows both real redemptions with honest math and disclaimer", async ({ page }) => {
    await page.goto("/success-stories");
    await expect(page.getByRole("heading", { name: /QSuites to Singapore/ })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Austrian Airlines Business Class/ }),
    ).toBeVisible();
    await expect(page.getByText("75,000 points", { exact: true })).toBeVisible();
    await expect(page.getByText("70,000 miles", { exact: true })).toBeVisible();
    await expect(page.getByText(/Estimated value: 9\.0¢ per point/)).toBeVisible();
    await expect(page.getByText(/Estimated value: 11\.2¢ per mile/)).toBeVisible();
    await expect(
      page.getByText("Award availability changes constantly and is never guaranteed."),
    ).toBeVisible();
  });
});

test.describe("Footer", () => {
  test("contains required links and the independence disclaimer", async ({ page }) => {
    await page.goto("/");
    const footer = page.getByRole("contentinfo");
    await expect(footer.getByRole("link", { name: "Privacy Policy" })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Terms of Use" })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Disclaimer" })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Accessibility Statement" })).toBeVisible();
    await expect(footer.getByRole("button", { name: "Cookie Preferences" })).toBeVisible();
    await expect(footer.getByText(/not affiliated with.*any airline/)).toBeVisible();
    await expect(footer.getByRole("link", { name: /Instagram/ })).toHaveAttribute(
      "href",
      "https://instagram.com/the_travel_technician",
    );
  });
});

test.describe("SEO plumbing", () => {
  test("serves sitemap.xml and robots.txt", async ({ request }) => {
    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.ok()).toBeTruthy();
    const body = await sitemap.text();
    expect(body).toContain("/points-and-miles-101");
    expect(body).toContain("/success-stories");

    const robots = await request.get("/robots.txt");
    expect(robots.ok()).toBeTruthy();
    expect(await robots.text()).toContain("Sitemap:");
  });

  test("homepage exposes JSON-LD for Organization, Person, and WebSite", async ({ page }) => {
    await page.goto("/");
    const jsonLd = await page.locator('script[type="application/ld+json"]').allTextContents();
    const types = jsonLd.flatMap((raw) => {
      const parsed = JSON.parse(raw) as { "@type"?: string };
      return parsed["@type"] ? [parsed["@type"]] : [];
    });
    expect(types).toEqual(expect.arrayContaining(["Organization", "Person", "WebSite"]));
  });
});
