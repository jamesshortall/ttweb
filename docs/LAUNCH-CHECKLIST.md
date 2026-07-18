# Pre-Launch Checklist — every known placeholder

This is the authoritative list of content and configuration that is **deliberately
unfinished** and must be completed before `www.traveltechnician.info` goes live. Nothing on
this list blocks local development or deployment previews.

## Content placeholders

- [ ] **Estimated travel value statistic** — currently renders `$[VALUE]` with a "Final
      figure pending" badge. Set the real figure in Sanity → Statistics (or
      `src/content/site.ts`, `fallbackStats` → `estimated-value`, and set
      `isPlaceholder: false`).
- [ ] **Jim's portrait** — replace `public/images/jim/jim-portrait.svg` placeholder
      (see docs/IMAGES.md for sizes; update references from `.svg` to the new filename).
- [ ] **Jim's ~31 personal travel photos** — add to `public/images/jim/` and
      `public/images/travel/`, then update the rotating collections
      (`src/content/images.ts` or Sanity → Rotating Image Collections).
- [ ] **Destination/hero photography** — replace the generated SVG artwork in
      `public/images/travel/` and `public/images/destinations/` with licensed photos
      (download and optimize locally — do not hotlink Unsplash in production).
- [ ] **CardMaster screenshots** — replace the three wireframe SVGs in
      `public/images/cardmaster/` with real app screenshots (redact any personal data).
- [ ] **Final logo files** — replace the four placeholder logos in `public/images/brand/`
      with the real primary / horizontal / square / light-background versions.
- [ ] **Success-story images** — replace placeholders in `public/images/success-stories/`.

## Configuration placeholders

- [ ] **Calendly URL** — create the free-consultation event and set
      `NEXT_PUBLIC_CALENDLY_URL`. Until then, scheduling buttons route to the contact form.
- [ ] **Contact email delivery** — choose Resend or Postmark, verify the sending domain,
      set `EMAIL_PROVIDER`, `CONTACT_TO_EMAIL`, `EMAIL_FROM_ADDRESS`, and the API key.
      Send a real test message end-to-end.
- [ ] **Blog RSS feed** — confirm the feed URL for blog.traveltechnician.info and set
      `BLOG_RSS_URL` (until then the Blog page shows the fallback/featured cards).
- [ ] **Analytics provider** — decide (Plausible/GA4/none), set
      `NEXT_PUBLIC_ANALYTICS_PROVIDER` + `NEXT_PUBLIC_ANALYTICS_ID`; if cookieless, also
      `NEXT_PUBLIC_ANALYTICS_COOKIELESS=true`.
- [ ] **Hosting provider** — select and deploy per docs/DEPLOYMENT.md; point DNS;
      verify apex→www redirect and SSL.
- [ ] **Sanity project** — create, deploy the Studio, set the two public env vars
      (optional at launch — fallback content is complete).
- [ ] **Newsletter** — remains "Coming Soon" until a provider is chosen; when ready, follow
      docs/CONTENT-GUIDE.md → "Activating the newsletter".

## Review gates

- [ ] **Legal review** — Privacy Policy, Terms of Use, Disclaimer, and Accessibility
      Statement are drafts (`src/content/legal.ts`); two bracketed items
      (`[Retention period pending legal review]`, `[Jurisdiction … pending legal review]`)
      need counsel's input. Update "Last updated" dates after review.
- [ ] **Copy review by Jim** — especially the About page story, service descriptions, and
      the success-story context paragraphs.
- [ ] **Brand-separation audit** — final check that no Fora Travel references, booking
      language, or agency positioning slipped into any content (`grep -ri fora src/` should
      return nothing).
- [ ] **Alt-text pass** — once real photos land, rewrite alt text to describe the actual
      images.

## Technical verification (repeat at launch)

- [ ] `npm run lint && npm run typecheck && npm test` green
- [ ] `npm run build && npm run test:e2e` green (includes Axe WCAG audits)
- [ ] Lighthouse mobile pass on key pages
- [ ] Production checklist in docs/DEPLOYMENT.md completed
