# Content Editing Guide (for Jim)

How to change anything on the site without touching application code.

> **Just want to manage photos?** See [PHOTO-ADMIN.md](PHOTO-ADMIN.md) for a start-to-finish,
> non-technical walkthrough of adding and swapping images yourself.

**The one concept to understand:** every piece of content has two possible homes —

1. **Sanity Studio** (the CMS) — once configured, this is the editing home. Log in, edit,
   click **Publish**, and the change appears on the live site. With the publish webhook set
   up (see [DEPLOYMENT.md → publish webhook](DEPLOYMENT.md#instant-updates-publish-webhook))
   that takes a few seconds; without it, the site still refreshes itself hourly. Either way
   there is **no rebuild and no code** — this is how you add or swap photos on your own.
2. **Fallback files** in `src/content/` — plain, readable TypeScript files the site uses
   whenever Sanity is not configured or a collection is empty. Editing these requires a
   redeploy.

If Sanity isn't set up yet, make every edit below in the listed fallback file instead —
each file mirrors the Studio fields one-to-one.

---

## Edit homepage copy

- **Studio:** Site Settings → _Homepage hero headline_ / _supporting copy_.
- **Fallback:** `src/content/site.ts` → `fallbackHomepageSettings`.

Section copy for "How Travel Technician Helps" and "Why Work With Jim" lives in
`src/app/page.tsx` (`howHelps`, `whyJim`) — small, clearly labeled lists at the top of the
file.

## Change statistics

- **Studio:** Statistics — edit _value_, _label_, _description_, drag by _sort order_.
- **Fallback:** `src/content/site.ts` → `fallbackStats`.

## Update the estimated travel value

The fourth homepage statistic ships as the placeholder `$[VALUE]` with a “Final figure
pending” badge.

- **Studio:** Statistics → _In estimated travel value_ → set the real value (e.g.
  `$150,000+`) and switch **Placeholder value?** off.
- **Fallback:** in `fallbackStats`, set `value: "$150,000+"` (your real figure) and
  `isPlaceholder: false`.

## Add a service

- **Studio:** Services → New. Fill name, tagline, summary, icon, detail paragraphs,
  “what's included”, “great fit if…”, honest boundaries, CTA label; toggle **Featured** to
  surface it on the homepage. The detail page appears automatically at `/services/<slug>`.
- **Fallback:** copy an existing object in `src/content/services.ts`.
- Keep the boundaries honest: no fixed prices, no financial advice, no booking.

## Add a success story

- **Studio:** Success Stories → New. Enter route, airline, cabin, points, unit, taxes/fees,
  comparable cash price — **the cents-per-point figure is calculated automatically** and
  always labeled an estimate. Fill “why valuable” and “context/limitations” (required
  honesty section), upload an image with alt text.
- **Fallback:** copy an object in `src/content/success-stories.ts`; put the image in
  `public/images/success-stories/`.

## Add a resource

- **Studio:** Resources → New. Pick a category (typing a new category name creates that
  section automatically) and a kind — _external_ and _blog_ kinds are automatically labeled
  as leaving the site.
- **Fallback:** `src/content/resources.ts`.

## Add a tip, or a Points & Miles 101 article

Both hubs share one article system:

- **Studio:** Articles → New → choose the hub (_Points & Miles 101_ or _Tips & Strategies_),
  then add sections (heading + paragraphs + optional bullets) and key takeaways. The page
  appears at `/points-and-miles-101/<slug>` or `/tips-and-strategies/<slug>`.
- **Fallback:** `src/content/articles-101.ts` or `src/content/tips.ts`.
- Write plainly, explain jargon on first use, and keep credit-responsibility caveats in
  anything that discusses cards.

## Add CardMaster screenshots

- **Studio:** CardMaster Screenshots → New — upload, write alt text describing what's
  visible, add a caption. Order via _sort order_.
- **Fallback:** drop the file in `public/images/cardmaster/` and list it in
  `src/content/cardmaster.ts` → `fallbackCardMasterScreenshots`.
- Redact any real account data before uploading. Sizing guidance: docs/IMAGES.md.

## Add personal travel photos / change rotating images

- **Studio:** Rotating Image Collections → open a collection (_Homepage hero_, _Destination
  gallery_, _Success stories hero_, _About Jim_) → add/remove images (alt text required).
  The rotation interval lives on the same document — keep it around 60000 ms.
- **Fallback:** put files in the right `public/images/` folder and edit
  `src/content/images.ts`.
- The first image in a collection is the one visitors see initially — lead with the best.

## Update legal-page text

- **Studio:** Legal Pages → pick the page → edit intro/sections → update _Last updated_.
- **Fallback:** `src/content/legal.ts`.
- These are drafts until legal review — see docs/LAUNCH-CHECKLIST.md.

## Activate the newsletter (when a provider is chosen)

1. **Studio:** Site Settings → Newsletter → _Mode_. `coming-soon` (default) shows the
   announcement; `hidden` removes the section; `active` is for a wired-up provider.
2. Switching to `active` before integration shows an honest "not configured" notice rather
   than a fake form — by design.
3. Integration (developer task, ~an hour): add the provider's subscribe call behind a small
   server route and swap the notice in
   `src/components/marketing/NewsletterSection.tsx` for the form. The section, settings,
   and CMS toggle are already in place.

## Add featured blog posts

- **Studio:** Featured Blog Posts → New — real title, full URL on
  blog.traveltechnician.info, excerpt, date. These show in the Blog page's Featured row and
  serve as the recent-posts fallback when the RSS feed is unavailable.
- Prefer configuring `BLOG_RSS_URL` so recent posts appear automatically.

## Update SEO metadata

- Page titles/descriptions live at the top of each file in `src/app/*/page.tsx`
  (`export const metadata`). Articles and services derive theirs from title + description
  fields, so editing content in the Studio updates SEO automatically.
- The sitewide description/tagline: `src/lib/site-config.ts`.

## Replace logos

Drop the final files over the four placeholders in `public/images/brand/` **keeping the
same filenames** (`logo-primary.svg`, `logo-horizontal.svg`, `logo-square.svg`,
`logo-light.svg`) — every reference updates automatically. PNG versions are fine too:
update the extensions in `src/components/layout/Header.tsx`, `Footer.tsx`, and
`src/lib/structured-data.ts`.

## Update social links

Set `NEXT_PUBLIC_INSTAGRAM_URL` / `NEXT_PUBLIC_FACEBOOK_URL` in the hosting provider's
environment settings (defaults live in `src/lib/site-config.ts`). Header/footer/contact/
about update together.
