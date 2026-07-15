import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const pagesToAudit = [
  "/",
  "/about",
  "/points-and-miles-101",
  "/points-and-miles-101/what-are-points-and-miles",
  "/tips-and-strategies",
  "/services",
  "/cardmaster",
  "/success-stories",
  "/resources",
  "/blog",
  "/contact",
  "/privacy-policy",
];

for (const path of pagesToAudit) {
  test(`axe audit: ${path} has no WCAG A/AA violations`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(
      results.violations,
      results.violations
        .map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target).join(", ")}`)
        .join("\n"),
    ).toEqual([]);
  });
}

test("rotating hero is static under prefers-reduced-motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const visibleFrame = page.locator('[aria-hidden="false"] img').first();
  const before = await visibleFrame.getAttribute("alt");
  // Wait past several would-be short intervals — the frame must not change.
  await page.waitForTimeout(1500);
  expect(await visibleFrame.getAttribute("alt")).toBe(before);
  // Reduced motion mounts only the active frame — no hidden preloaded sibling
  // waiting to rotate in.
  const hiddenFrames = page.locator("section").first().locator('[aria-hidden="true"] img');
  expect(await hiddenFrames.count()).toBe(0);
});

test("form errors are announced and associated with fields", async ({ page }) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: "Send Message" }).click();
  const nameInput = page.getByRole("textbox", { name: "Name" });
  const describedBy = await nameInput.getAttribute("aria-describedby");
  expect(describedBy).toContain("contact-name-error");
  await expect(page.locator(`#${describedBy!.split(" ")[0]}`)).toHaveText(
    "Please enter your name.",
  );
});

test("keyboard: FAQ accordion can be operated without a mouse", async ({ page }) => {
  await page.goto("/cardmaster");
  const firstSummary = page.locator("summary").first();
  await firstSummary.focus();
  await page.keyboard.press("Enter");
  const details = page.locator("details").first();
  await expect(details).toHaveAttribute("open", "");
});
