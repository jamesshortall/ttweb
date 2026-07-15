# Travel Technician — www.traveltechnician.info

> **Turn your points into unforgettable travel.**

Marketing and education website for **Travel Technician**, Jim Shortall's points-and-miles
brand: beginner education, paid strategy consultations, real redemption stories, and the free
**CardMaster** tracking app.

Travel Technician is independent — not affiliated with any airline, hotel company, bank,
credit card issuer, loyalty program, or travel agency — and this site deliberately contains
no travel-booking functionality.

---

## Technology stack

| Layer          | Choice                                                                 |
| -------------- | ---------------------------------------------------------------------- |
| Framework      | [Next.js 15](https://nextjs.org) (App Router, React Server Components) |
| Language       | TypeScript (strict, `noUncheckedIndexedAccess`)                        |
| Styling        | Tailwind CSS 4 (+ `@tailwindcss/typography`)                           |
| Fonts          | `next/font` — Sora (display) + Inter (body), self-hosted at build      |
| Validation     | Zod (shared client/server schemas)                                     |
| Forms          | React Hook Form + `@hookform/resolvers`                                |
| CMS            | Sanity (schemas in `studio/`; typed GROQ queries via `@sanity/client`) |
| Email          | Provider-agnostic drivers: Resend / Postmark (plain HTTPS, no SDKs)    |
| Database (opt) | Supabase for contact-submission storage (`supabase/migrations/`)       |
| Unit tests     | Vitest + React Testing Library                                         |
| E2E + a11y     | Playwright + `@axe-core/playwright`                                    |
| Lint/format    | ESLint (flat config, `eslint-config-next`) + Prettier                  |

## Architecture decisions

- **Fallback-first content layer.** Every page pulls content through `src/lib/cms`, which
  queries Sanity when `NEXT_PUBLIC_SANITY_PROJECT_ID` is set and silently falls back to the
  complete built-in content in `src/content/`. The site is fully functional with **zero**
  environment configuration — the CMS enriches it, but nothing critical depends on it.
- **Why Sanity.** Of the candidates (Sanity, Payload, Directus, Supabase-custom), Sanity has
  the best combination of structured content modeling, built-in image pipeline + CDN,
  draft/publish workflow, generous free tier (no server to operate), and mature Next.js
  tooling. Payload/Directus would add a database + server to run; a Supabase-custom CMS would
  mean building an editing UI from scratch. The Studio lives in `studio/` as a separate
  workspace so the website bundle stays lean.
- **Server components by default.** Client islands are limited to what needs interactivity:
  header menu, rotating images, contact form, cookie consent, Calendly button, obfuscated
  email. Everything else renders on the server and is statically generated.
- **No booking, no affiliate links.** By design and by brand-separation requirement. The
  Disclaimer explains how any future referral links would be disclosed.
- **Portability.** No Vercel-only APIs; runs anywhere Node 20+ runs (see
  [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)).

More detail: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Local development

### Required software

- Node.js **20.9+** (22 LTS recommended) and npm 10+
- (E2E only) Chromium via `npx playwright install chromium`

### Installation

```bash
git clone <repo-url> && cd ttweb
npm install
cp .env.example .env.local   # optional — the site runs with no configuration
npm run dev                  # http://localhost:3000
```

That's it. With an empty `.env.local` the site renders complete fallback content, the
contact form logs submissions server-side, analytics stay off, and Calendly buttons route to
the contact form.

### Commands

| Command             | Purpose                                                                  |
| ------------------- | ------------------------------------------------------------------------ |
| `npm run dev`       | Development server                                                       |
| `npm run build`     | Production build                                                         |
| `npm run start`     | Serve the production build                                               |
| `npm run preview`   | Build + serve (production preview)                                       |
| `npm run lint`      | ESLint                                                                   |
| `npm run typecheck` | TypeScript                                                               |
| `npm run format`    | Prettier write (`format:check` to verify)                                |
| `npm test`          | Vitest unit + component tests                                            |
| `npm run test:e2e`  | Playwright end-to-end tests (builds implied — run `npm run build` first) |
| `npm run test:a11y` | Playwright + Axe accessibility audits                                    |

In sandboxed/CI environments without downloadable browsers, point Playwright at a system
Chromium: `PLAYWRIGHT_CHROMIUM_EXECUTABLE=/path/to/chrome npm run test:e2e`.

## Environment variables

All variables are **optional for local development**; anything set is validated at startup
by `src/lib/env.ts` (Zod), with cross-checks (e.g. choosing `EMAIL_PROVIDER=resend` without
`RESEND_API_KEY` fails loudly). See [.env.example](.env.example) for the full annotated list:

- **Site URLs** — `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_CARDMASTER_URL`, `NEXT_PUBLIC_BLOG_URL`
- **Social** — `NEXT_PUBLIC_INSTAGRAM_URL`, `NEXT_PUBLIC_FACEBOOK_URL`
- **Scheduling** — `NEXT_PUBLIC_CALENDLY_URL` (placeholder until the real link exists)
- **Blog feed** — `BLOG_RSS_URL`
- **Contact email** — `EMAIL_PROVIDER`, `CONTACT_TO_EMAIL`, `EMAIL_FROM_ADDRESS`,
  `RESEND_API_KEY` / `POSTMARK_SERVER_TOKEN`
- **Analytics** — `NEXT_PUBLIC_ANALYTICS_PROVIDER`, `NEXT_PUBLIC_ANALYTICS_ID`,
  `NEXT_PUBLIC_ANALYTICS_COOKIELESS`
- **Sanity** — `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_TOKEN`
- **Supabase** — `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
  `SUPABASE_SERVICE_ROLE_KEY` (server-only, never exposed to the browser)

## CMS setup (Sanity)

1. `cd studio && npm install`
2. `npx sanity init` — create a project + `production` dataset (or reuse an existing one);
   note the project ID.
3. Run the Studio locally: `SANITY_STUDIO_PROJECT_ID=<id> npm run dev` (defaults in
   `studio/sanity.config.ts` can be edited instead).
4. Point the website at the project: set `NEXT_PUBLIC_SANITY_PROJECT_ID` and
   `NEXT_PUBLIC_SANITY_DATASET` in `.env.local`.
5. Publish content. Any collection left empty in Sanity keeps using the built-in fallback,
   so you can migrate content type by type.
6. Deploy the Studio for editors with `npm run deploy` (hosted at `<name>.sanity.studio`).

Content models: site settings (hero copy, estimated-travel-value, newsletter mode, social
links), statistics, services, success stories, resources, FAQs, articles (101 + tips),
featured blog posts, CardMaster features/screenshots, rotating image collections, legal
pages, and testimonials (future use). Field names intentionally mirror the GROQ projections
in `src/lib/cms/queries.ts`.

## Contact form setup

Server route: `src/app/api/contact/route.ts` — Zod validation (source of truth), honeypot
field, minimum-fill-time check, per-IP rate limiting (5/10 min), and safe error messages
that never echo submitted content.

1. Pick a provider and verify a sending domain there:
   - **Resend**: set `EMAIL_PROVIDER=resend`, `RESEND_API_KEY`
   - **Postmark**: set `EMAIL_PROVIDER=postmark`, `POSTMARK_SERVER_TOKEN`
2. Set `CONTACT_TO_EMAIL` (where inquiries arrive) and `EMAIL_FROM_ADDRESS` (verified sender).
3. Optional Supabase storage: apply `supabase/migrations/0001_contact_submissions.sql` and
   set the Supabase variables. Storage failures never block the visitor; RLS denies all
   public access to the table. Adding SMTP or another provider = implement the small
   `EmailDriver` interface in `src/lib/email.ts`.

## Blog integration

The blog stays a separate site (`blog.traveltechnician.info`). Set `BLOG_RSS_URL` to its
RSS/Atom feed and the Blog page + homepage show recent-article cards, fetched server-side
and cached for 1 hour (the blog is never scraped per-request). Without a feed, CMS-managed
"Featured Blog Post" cards render; with neither, a clear "visit the blog" card appears —
fake posts are never invented. Blog links open in the same tab and are labeled as leading to
the blog.

## Calendly integration

Set `NEXT_PUBLIC_CALENDLY_URL` to the real scheduling link. Buttons load **zero** Calendly
code until clicked (script injected on demand; popup opens when ready; direct link as
fallback). While unset, "Schedule a Free Consultation" routes to the contact form with the
consultation category preselected — no fake scheduling flow.

## Analytics & cookie consent

Disabled until configured. Set `NEXT_PUBLIC_ANALYTICS_PROVIDER` (`plausible` | `google`) and
`NEXT_PUBLIC_ANALYTICS_ID`. Consent-gated by the accessible cookie banner (equal-weight
Accept/Reject, decision stored locally, revisitable via "Cookie Preferences" in the footer).
For cookieless analytics (e.g. Plausible), `NEXT_PUBLIC_ANALYTICS_COOKIELESS=true` loads the
script without requiring prior consent — the banner then only appears via the footer link.

## Security

- Strict security headers + CSP built in `next.config.ts` (analytics/Calendly hosts added
  only when configured); HSTS, nosniff, frame-ancestors 'none', restricted permissions.
- Server-side validation on all inputs; output encoding via React; JSON-LD escaped.
- Rate limiting + honeypot + fill-time heuristic on the contact API.
- No secrets client-side (only `NEXT_PUBLIC_*` reaches the browser); env validated at boot.
- Logging never includes form content — categories and error classes only.
- Supabase RLS denies all public access; service-role key is server-only.
- Dependency auditing: `npm audit` (see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for the CSP
  hardening guidance and known transitive advisories).
- No compliance certifications are claimed — none have been established.

## Accessibility

Target: **WCAG 2.2 AA**. Keyboard operability, skip link, visible focus states, semantic
landmarks/headings, labeled forms with announced errors, AA contrast (verified by Axe in
CI-able e2e tests), reduced-motion support (rotating imagery goes static), alt text
management through content models, and touch-target sizing. Known limitations are listed on
the [Accessibility Statement](src/app/accessibility/page.tsx) (linked services are separate
applications).

## Performance

Static generation for every page (contact page is dynamic for its query param), ~110 kB
first-load JS, self-hosted fonts with `display: swap`, `next/image` with AVIF/WebP,
rotation frames mounted only as needed (no layout shift), third-party scripts loaded only
after consent (analytics) or interaction (Calendly), and hourly ISR for feed-backed content.

## Troubleshooting

| Symptom                                                    | Fix                                                                                                         |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Build fails with "Invalid environment configuration"       | A set variable is malformed — the error names it. Fix or remove it.                                         |
| Contact form always says "provider not configured" in logs | Expected without `EMAIL_PROVIDER`; submissions are logged only.                                             |
| Blog page shows no article cards                           | `BLOG_RSS_URL` unset/unreachable — fallback card is the designed behavior.                                  |
| Playwright can't launch a browser                          | `npx playwright install chromium`, or set `PLAYWRIGHT_CHROMIUM_EXECUTABLE`.                                 |
| Sanity content not appearing                               | Check project ID/dataset, that documents are **published**, and field names match `src/lib/cms/queries.ts`. |
| Fonts fail to download at build                            | Build machines need outbound HTTPS to Google Fonts, or swap `next/font/google` for `next/font/local`.       |

## Further documentation

- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) — Vercel + generic Node deployment, DNS/SSL for
  `www.traveltechnician.info`, redirects, rollback, production checklist
- [docs/CONTENT-GUIDE.md](docs/CONTENT-GUIDE.md) — how Jim edits every piece of content
- [docs/IMAGES.md](docs/IMAGES.md) — image sizes, naming, optimization, replacing placeholders
- [docs/LAUNCH-CHECKLIST.md](docs/LAUNCH-CHECKLIST.md) — every placeholder that must be
  resolved before launch
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — routes, components, content models, decisions
