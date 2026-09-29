import { afterEach, describe, expect, it } from "vitest";
import { buildContentSecurityPolicy } from "./csp";

/**
 * The CSP is assembled from the environment at build time. A feature whose
 * hosts are missing from the policy is not degraded — it is blocked outright
 * by the browser, which is how the Turnstile widget silently failed to render
 * in production. These tests pin each feature's hosts to its own variables.
 */

const TURNSTILE_HOST = "https://challenges.cloudflare.com";

/** Read one directive out of the assembled policy string. */
function directive(policy: string, name: string): string {
  const found = policy.split("; ").find((part) => part.startsWith(`${name} `));
  return found ?? "";
}

const originalEnv = { ...process.env };

afterEach(() => {
  process.env = { ...originalEnv };
});

describe("buildContentSecurityPolicy", () => {
  it("omits Turnstile when no site key is configured", () => {
    delete process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    expect(buildContentSecurityPolicy()).not.toContain(TURNSTILE_HOST);
  });

  it("allows the Turnstile script, its iframe and its callbacks when configured", () => {
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = "0x4TEST";
    const policy = buildContentSecurityPolicy();
    // The widget needs all three: the script loads, renders in an iframe, and
    // posts back to Cloudflare. Missing any one of them breaks the challenge.
    expect(directive(policy, "script-src")).toContain(TURNSTILE_HOST);
    expect(directive(policy, "frame-src")).toContain(TURNSTILE_HOST);
    expect(directive(policy, "connect-src")).toContain(TURNSTILE_HOST);
  });

  it("keeps frame-src closed when nothing needs to be framed", () => {
    delete process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    delete process.env.NEXT_PUBLIC_CALENDLY_URL;
    delete process.env.AD_HTML_EMBEDS_ENABLED;
    delete process.env.NEXT_PUBLIC_ADSENSE_ENABLED;
    expect(buildContentSecurityPolicy()).toContain("frame-src 'none'");
  });

  it("always denies objects and foreign framing", () => {
    const policy = buildContentSecurityPolicy();
    expect(policy).toContain("object-src 'none'");
    expect(policy).toContain("frame-ancestors 'none'");
  });
});
