import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end test configuration.
 *
 * `npm run build && npm run start` is used (rather than the dev server) so the
 * tests exercise production behaviour: security headers, static rendering, and
 * image optimisation.
 *
 * PLAYWRIGHT_CHROMIUM_EXECUTABLE (optional): path to a system Chromium for
 * sandboxed/CI environments where `npx playwright install` isn't possible.
 */
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;
const launchOptions = executablePath ? { executablePath } : undefined;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "desktop-chromium",
      use: { ...devices["Desktop Chrome"], launchOptions },
    },
    {
      name: "mobile-chromium",
      use: { ...devices["Pixel 7"], launchOptions },
    },
  ],
  webServer: {
    command: "npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
