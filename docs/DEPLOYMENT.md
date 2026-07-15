# Deployment Guide

The final hosting provider has not been selected. The project is a standard Next.js 15 app
with no vendor-specific APIs, so it deploys cleanly to Vercel (easiest), Netlify,
Cloudflare, AWS, or any IONOS-compatible Node host.

## Option A — Vercel (recommended path of least resistance)

1. Push the repository to GitHub and import it at vercel.com → **Add New Project**.
2. Framework preset: **Next.js** (auto-detected). Build command `next build`, output
   default. Node 20+.
3. Add environment variables (Project → Settings → Environment Variables) from
   `.env.example`. Server-only secrets (`RESEND_API_KEY`, `SANITY_API_TOKEN`,
   `SUPABASE_SERVICE_ROLE_KEY`) must **not** be prefixed `NEXT_PUBLIC_`.
4. Add the domain `www.traveltechnician.info` (Project → Settings → Domains), plus
   `traveltechnician.info` configured to **redirect to www** (Vercel offers this toggle).
5. Deploy. Preview deployments come free with every PR.

## Option B — Generic Node host (IONOS, AWS EC2/Lightsail, any VPS)

```bash
# on the server (Node 20+)
git clone <repo> && cd ttweb
npm ci
cp .env.example .env.production.local   # fill in real values
npm run build
npm run start                            # serves on :3000
```

- Run under a process manager (systemd unit or `pm2 start npm -- start`) and put nginx/Caddy
  in front for TLS and HTTP→HTTPS redirects.
- Static assets are served by Next itself; no extra static hosting needed.
- For AWS serverless or Cloudflare, use their maintained Next.js adapters (`opennext`,
  `@opennextjs/cloudflare`) — no code changes required here.

## DNS for www.traveltechnician.info

| Record  | Host       | Value                                                                       |
| ------- | ---------- | --------------------------------------------------------------------------- |
| CNAME   | `www`      | your host's target (e.g. `cname.vercel-dns.com`)                            |
| A/ALIAS | `@` (apex) | host's apex target (Vercel: `76.76.21.21`) — must end up redirecting to www |

- **Canonical domain is `https://www.traveltechnician.info`** (it's what
  `NEXT_PUBLIC_SITE_URL`, canonicals, sitemap, and JSON-LD use). Configure the apex →
  www redirect at the host or DNS provider (301, preserve path).
- `cardmaster.` and `blog.` subdomains point at their own separate apps — nothing in this
  deployment touches them.

## SSL

Vercel/Netlify/Cloudflare issue and renew certificates automatically once DNS resolves. On
a VPS, use Caddy (automatic) or certbot with nginx. HSTS is already sent by the app
(`Strict-Transport-Security: max-age=63072000; includeSubDomains`) — only enable HSTS
preload after confirming every subdomain (including cardmaster and blog) serves HTTPS.

## Content Security Policy

`next.config.ts` ships an enforced CSP that allows only self + the configured analytics and
Calendly hosts. `script-src` includes `'unsafe-inline'` because Next.js hydration requires
it without a nonce pipeline. To harden further, move the CSP into `middleware.ts` with
per-request nonces (see Next.js CSP docs) — the trade-off is that every page becomes
dynamically rendered, losing full-static output. Revisit after launch if desired.

## Rate limiting at scale

The in-memory limiter protects a single Node process. On serverless (many short-lived
instances) each instance enforces its own window — still useful, not global. For a durable
global limit, back the `RateLimiter` interface (`src/lib/rate-limit.ts`) with Supabase or a
KV store, or enable the host's WAF rate rules (Vercel Firewall / Cloudflare).

## CMS (Sanity Studio) deployment

```bash
cd studio && npm install
SANITY_STUDIO_PROJECT_ID=<id> npm run deploy   # hosts at <name>.sanity.studio
```

Add the production site origin to the Sanity project's CORS origins (no credentials needed
for public published content). The website only needs `NEXT_PUBLIC_SANITY_PROJECT_ID` /
`NEXT_PUBLIC_SANITY_DATASET`; `SANITY_API_TOKEN` is only for draft previews.

## Supabase (optional)

1. Create a project at supabase.com → run `supabase/migrations/0001_contact_submissions.sql`
   in the SQL editor (or `supabase db push` with the CLI).
2. Set `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in the host's env.
3. Verify RLS: the table must show "RLS enabled" with **no** policies — public roles get
   nothing; the server's service-role key bypasses RLS by design.
4. Retention: purge old submissions periodically (SQL example in the migration header) to
   honor the Privacy Policy.

## Production checklist

- [ ] All items in [LAUNCH-CHECKLIST.md](LAUNCH-CHECKLIST.md) resolved
- [ ] `NEXT_PUBLIC_SITE_URL=https://www.traveltechnician.info` set in production env
- [ ] Contact form: provider configured, test submission received end-to-end
- [ ] Apex → www 301 redirect verified (`curl -I https://traveltechnician.info`)
- [ ] `https://www.traveltechnician.info/sitemap.xml` + `/robots.txt` reachable
- [ ] Search Console: property added, sitemap submitted
- [ ] Analytics verified (only after consent) or intentionally left off
- [ ] Lighthouse pass on `/`, `/cardmaster`, `/success-stories` (mobile): Performance ≥ 90,
      Accessibility ≥ 95, SEO ≥ 95
- [ ] `npm run lint && npm run typecheck && npm test && npm run build` green at the deployed commit
- [ ] E2E suite green against a production build

## Rollback

- **Vercel/Netlify**: promote the previous deployment from the dashboard (instant).
- **VPS**: keep the previous build (`git tag` each release); roll back with
  `git checkout <tag> && npm ci && npm run build && systemctl restart <service>`.
- Environment-variable mistakes fail fast at boot (env validation) — fix the variable and
  redeploy; no code rollback needed.
- CMS content mistakes: Sanity keeps full document history — restore prior revisions from
  the Studio's document menu. Deleting all documents of a type safely re-activates the
  built-in fallback content.
