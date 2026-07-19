import type { NextConfig } from "next";

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
function buildContentSecurityPolicy(): string {
  const scriptHosts: string[] = [];
  const connectHosts: string[] = [];
  const frameHosts: string[] = [];

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

  // Sandboxed HTML/embed ads render in a srcdoc iframe; allow framing from self
  // only when the feature is enabled, so the default policy stays tightest.
  if (process.env.AD_HTML_EMBEDS_ENABLED === "true") {
    frameHosts.push("'self'");
  }

  const directives = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' ${scriptHosts.join(" ")}`.trim(),
    "style-src 'self' 'unsafe-inline' https://assets.calendly.com",
    "img-src 'self' data: blob: https://cdn.sanity.io",
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

const securityHeaders = [
  { key: "Content-Security-Policy", value: buildContentSecurityPolicy() },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  eslint: {
    // Linting runs via `npm run lint` (ESLint CLI); the `next lint` runner has
    // a known circular-structure bug with flat configs.
    ignoreDuringBuilds: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // Placeholder artwork ships as self-authored local SVGs. The sandboxed CSP
    // and attachment disposition below neutralise script execution in SVGs.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
