/**
 * Content Security Policy.
 *
 * Kept in next.config.ts so every route (static and dynamic) receives the same
 * policy without forcing dynamic rendering. `'unsafe-inline'` for scripts is
 * required by Next.js hydration when a nonce-based policy is not used; see
 * docs/DEPLOYMENT.md ("Content Security Policy") for the stricter nonce-based
 * alternative and its trade-offs.
 *
 * Analytics and Calendly hosts are only added when the matching feature is
 * configured, so an unconfigured site ships the tightest policy.
 */
export function buildContentSecurityPolicy(): string {
  const scriptHosts: string[] = [];
  const connectHosts: string[] = [];
  const frameHosts: string[] = [];
  const imgHosts: string[] = [];

  const analyticsProvider = process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER;
  if (analyticsProvider === "plausible") {
    scriptHosts.push("https://plausible.io");
    connectHosts.push("https://plausible.io");
  } else if (analyticsProvider === "google") {
    scriptHosts.push("https://www.googletagmanager.com");
    connectHosts.push(
      "https://www.googletagmanager.com",
      "https://*.google-analytics.com",
      "https://*.analytics.google.com",
    );
  }

  if (process.env.NEXT_PUBLIC_CALENDLY_URL) {
    scriptHosts.push("https://assets.calendly.com");
    frameHosts.push("https://calendly.com", "https://*.calendly.com");
  }

  // Cloudflare Turnstile guards the SMS opt-in. Its script is blocked by the
  // default policy, and the challenge itself renders in an iframe, so both the
  // script and frame hosts are needed — added only when a site key is set.
  if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
    scriptHosts.push("https://challenges.cloudflare.com");
    frameHosts.push("https://challenges.cloudflare.com");
    connectHosts.push("https://challenges.cloudflare.com");
  }

  // Sandboxed HTML/embed ads render in a srcdoc iframe; allow framing from self
  // only when the feature is enabled, so the default policy stays tightest.
  if (process.env.AD_HTML_EMBEDS_ENABLED === "true") {
    frameHosts.push("'self'");
  }

  // Google AdSense hosts, added only when the network is enabled so the default
  // policy carries no third-party ad surface.
  if (process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true") {
    scriptHosts.push("https://pagead2.googlesyndication.com");
    connectHosts.push("https://pagead2.googlesyndication.com");
    frameHosts.push("https://googleads.g.doubleclick.net", "https://tpc.googlesyndication.com");
    imgHosts.push(
      "https://pagead2.googlesyndication.com",
      "https://googleads.g.doubleclick.net",
      "https://tpc.googlesyndication.com",
    );
  }

  const directives = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' ${scriptHosts.join(" ")}`.trim(),
    "style-src 'self' 'unsafe-inline' https://assets.calendly.com",
    `img-src 'self' data: blob: https://cdn.sanity.io ${imgHosts.join(" ")}`.trim(),
    "font-src 'self'",
    `connect-src 'self' ${connectHosts.join(" ")}`.trim(),
    frameHosts.length > 0 ? `frame-src ${frameHosts.join(" ")}` : "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ];

  return directives.join("; ");
}
