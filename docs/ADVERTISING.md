# Advertising System — Administrator Guide

An administrator-only advertisement system for the public Travel Technician
website. Advertisers, campaigns, ads, placements, and creative are managed in
**Sanity Studio**; impression/click analytics and the audit trail live in
**Supabase (Postgres)**. Ads never appear inside the separate CardMaster app.

> **Status:** Phases 1–2. Image, text, **video**, and **sandboxed HTML/embed**
> ads are supported, with targeting, scheduling, weighted rotation, and status
> logic. The analytics dashboard, CSV export, and the AdSense network layer land
> in later phases. This guide grows with them.

## Architecture at a glance

| Concern                                                        | Home         |
| -------------------------------------------------------------- | ------------ |
| Advertisers, campaigns, ads, creatives, placements, networks   | Sanity CMS   |
| Raw impression/click events, daily aggregates, audit log       | Supabase     |
| Ad resolution, tracking endpoints, signed click redirect       | Next.js      |
| Third-party networks (AdSense …)                               | Disabled     |

Why Supabase and not the IONOS MySQL box: the spec requires Row Level Security
and admin-only policies, which are PostgreSQL/Supabase features (MySQL 8.0 has
no RLS), and the site already runs Supabase for the contact form. One database,
one security model, no DB credentials ever in the browser.

## One-time setup

1. **Database:** run `supabase/migrations/0002_advertising.sql` in the Supabase
   SQL editor (or `supabase db push`). It creates `ad_events`,
   `ad_daily_aggregates`, and `ad_audit_log`, all with RLS enabled and no
   policies (service-role writes only).
2. **Environment** (see `.env.example` → "Advertising"): set
   `AD_REDIRECT_SIGNING_SECRET` (`openssl rand -hex 32`) to enable click
   tracking, and confirm the Supabase URL + service-role key are set. Restart
   the app so the new env is loaded.
3. **Placement zones:** in Studio, create at least one **Placement zone** (e.g.
   key `points-101-inline`) and enable it.

## Creating an advertisement (workflow)

1. **Advertiser** → create the organization (contact/billing fields are private
   and never shown publicly).
2. **Campaign** → attach the advertiser; set status, dates, and any billing
   notes (payment is handled outside the website).
3. **Advertisement** → attach the campaign, choose the type, upload creative +
   **alt text**, set the destination URL, choose placement zone(s), device and
   page targeting, schedule, weight/priority, and disclosure.
4. **Approve** → toggle *Approved by administrator*. **Ads never serve until
   approved** — nothing is auto-approved.
5. **Activate** → set status to `active` (or `scheduled` to auto-start at the
   start date).

An ad becomes eligible only when: approved • status active/scheduled • within
its schedule window • its campaign isn't paused/archived • it targets the
current placement, device, and page • and it has renderable content with a safe
`http(s)` destination.

## How things work

- **Placements** — a page requests one by key: `<AdSlot placement="points-101-inline" />`.
  The host page stays fully static/ISR: it ships without ads, and the slot
  fetches an eligible ad from `/api/ads/resolve` after mount (all targeting,
  creative selection, and click-URL signing happen server-side there). It
  renders it, or **collapses entirely** (no box, no gap) when none is eligible.
- **Rotation** — when several ads are eligible, the highest *priority* tier wins,
  then a *weighted-random* pick (weight 0 opts an ad out; equal chance if all
  are 0). Selection is stable for the page view.
- **Scheduling** — start/expiration are enforced at request time, so expired ads
  stop appearing with no admin action. Business time zone defaults to
  `America/New_York` (`AD_DEFAULT_TIMEZONE`).
- **Impressions** — recorded only when the ad is ≥50% visible for ≥1s
  (IntersectionObserver), never merely because it's in the HTML. Preview mode
  and bots are excluded.
- **Clicks** — routed through a signed `/api/ads/click` redirect that records the
  click, then sends the visitor on with `rel="noopener noreferrer sponsored"`,
  `target="_blank"`, and the configured UTM/referral params.
- **Unique clicks** — a click is "unique" if no prior click for the same ad and
  the same salted, one-way visitor hash exists within
  `AD_UNIQUE_CLICK_WINDOW_HOURS` (default 24). The hash is built from the ad id +
  a minimized IP hash + a coarse UA hash, salted with the signing secret. **No
  raw IP and no persistent fingerprint are ever stored.**
- **Empty placements** — always collapse. In development, unconfigured CMS shows
  clearly-labeled MOCK seed ads; production shows nothing.
- **Disclosure** — paid placements carry a configurable label ("Advertisement",
  "Sponsored", …), styled distinctly from editorial recommendations.

### Ad formats

- **Image** — responsive; add a "Responsive fallback" creative at minimum, plus
  optional desktop/tablet/mobile variants (the most specific match wins). Alt
  text is required.
- **Text** — headline + optional description, in the site's visual system but
  visually distinct from editorial.
- **Video** — never autoplays; shows a poster and loads the source only near the
  viewport; native accessible controls; add a **captions (VTT)** file when the
  video contains speech. The media isn't wrapped in the click link — set a CTA
  label to add a tracked button.
- **HTML / embed** — for reviewed, trusted-partner rich content. Rendered inside
  a **strictly sandboxed iframe** (no scripts, opaque origin, can't touch the
  page or cookies) after server-side sanitization. Script-based third-party
  widgets are out of scope here — those belong to the network layer. **Disabled
  by default:** set `AD_HTML_EMBEDS_ENABLED=true` (which also opens
  `frame-src 'self'` in the CSP) to allow them.
- **Status** — visitor-facing expiry/activation is enforced at read time, so
  scheduled ads go live and expired ads disappear with no admin action. A Phase 3
  job will also rewrite the stored status field to match, for accurate reporting.

## Safety & privacy

- Destinations must be `http(s)` — `javascript:`, `data:`, and custom schemes are
  rejected at creation and again at redirect time.
- Public browsers can never write counts directly; every event goes through a
  validated, rate-limited server route.
- First-party ad analytics collect the minimum needed to report. Third-party
  networks stay disabled until explicitly configured and ad-consent is granted.

## Troubleshooting: my ad isn't showing

Check, in order: the ad is **approved**; status is `active`/`scheduled`; now is
within the schedule; the **campaign** isn't paused/archived; the **placement
zone** exists, is **enabled**, and supports the ad's format; device/page
targeting matches; the destination is a safe `http(s)` URL; and (image ads) at
least one creative with alt text is uploaded. In development, remember the
`points-101-inline` MOCK ad only appears when the CMS is unconfigured.
