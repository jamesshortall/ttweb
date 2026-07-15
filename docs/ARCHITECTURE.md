# Architecture

The plan produced from the project specification, and what shipped.

## Recommended architecture (as implemented)

Next.js 15 App Router + TypeScript strict + Tailwind CSS 4, server components by default
with six client islands (header menu, rotating images, contact form, cookie consent,
Calendly button, obfuscated email). All pages statically generated (ISR, 1 h) except
`/contact` (reads a query param) and `/api/contact`.

## CMS selection

**Sanity**, per the preference in the spec — and it survives scrutiny: structured content
with validation, image CDN + hotspot cropping, draft/publish + full revision history,
hosted (zero-ops, free tier), and clean Next.js integration. Payload/Directus require
running a server + database for a site with one editor; a Supabase-custom CMS means
building an editor UI. The deciding architectural feature is our **fallback-first content
layer**: Sanity can be adopted collection-by-collection with no flag day.

## Route structure

```
/                                   Home
/about                              About Jim
/points-and-miles-101               Learning hub ("Start Here")
/points-and-miles-101/[slug]        8 articles (SSG)
/tips-and-strategies                Strategy hub
/tips-and-strategies/[slug]         8 playbooks (SSG)
/services                           Services overview
/services/[slug]                    5 service detail pages (SSG)
/cardmaster                         CardMaster landing page
/success-stories                    Redemption stories
/resources                          Resource library
/blog                               Blog gateway (RSS/CMS cards → external blog)
/contact                            Contact form (+ ?topic= preselect)
/privacy-policy · /terms-of-use · /disclaimer · /accessibility
not-found.tsx                       Custom 404
/api/contact                        POST — validated, rate-limited submission
sitemap.ts · robots.ts · opengraph-image.tsx
```

## Component structure

```
components/
  layout/      Header (client), Footer, Breadcrumbs (+ JSON-LD)
  ui/          Button/ButtonLink, Container, SectionHeading, Icon (inline set),
               FaqAccordion (native <details>), ExternalTag, ObfuscatedEmail (client)
  media/       RotatingImage (client; shuffle, 60s, reduced-motion, hidden-tab pause)
  marketing/   HomeHero, PageHero, StatsSection, CardMasterHighlight, SuccessStoryCard,
               ArticleCard, ArticleView, BlogCards(+fallback), NewsletterSection,
               ConsultationCTA, LegalView
  forms/       ContactForm (client; RHF + shared Zod schema)
  consent/     CookieConsent (client), CookiePreferencesLink, Analytics (consent-gated)
  scheduling/  CalendlyButton (client; loads Calendly only on click)
  seo/         JsonLd
lib/
  cms/         client (lazy Sanity), queries (GROQ), index (getters w/ fallback), types
  env.ts (zod, boot-validated) · site-config.ts · contact-schema.ts · email.ts (drivers)
  contact-storage.ts (Supabase, optional) · rss.ts · rate-limit.ts · consent.ts
  hooks.ts (useSyncExternalStore helpers) · structured-data.ts · utils.ts
content/       Complete fallback content (site, services, stories, resources, articles ×2,
               faqs, glossary, cardmaster, images, navigation, legal, about)
studio/        Separate Sanity Studio workspace (13 schemas)
supabase/      contact_submissions migration (RLS locked down)
```

## Content models

siteSettings (hero copy, estimated-value placeholder, newsletter mode, social links),
statistic, service, successStory, resource, faq (grouped), article (collection: points-101
| tips; sections + takeaways), featuredBlogPost, cardmasterFeature, cardmasterScreenshot,
imageCollection (keyed rotations), legalPage, testimonial (future use — nothing renders
testimonials until real ones exist).

## Assumptions made

- **Canonical domain** `https://www.traveltechnician.info`; apex redirects to www.
- **"Start Here" = Points & Miles 101** in the navigation (friendlier label, same page).
- Success-story cents-per-point is **computed** from the provided figures ((cash − fees) ÷
  points → 9.0¢ and 11.2¢) and always labeled an estimate.
- The free consultation is described as "a relaxed 30-minute conversation" — adjust if the
  real format differs.
- Contact responses "within one to two business days" — adjust to Jim's actual cadence.
- CardMaster copy states it does not connect to bank accounts and uses standard
  authentication — believed accurate from the spec's security-conscious framing; **verify
  against the real app** before launch.
- English (`en-US`) only; light mode only (per spec).
- Placeholder artwork is self-authored SVG rather than downloaded Unsplash files (network
  policy blocked Unsplash in the build environment; also keeps the repo license-clean).
  The docs describe the intended Unsplash-for-dev workflow.

## Known-missing information / assets

Tracked in [LAUNCH-CHECKLIST.md](LAUNCH-CHECKLIST.md): Calendly URL, estimated-travel-value
figure, newsletter provider, analytics provider, hosting provider, blog RSS URL, CardMaster
screenshots, Jim's portrait + travel photos, final logos, legal review (two bracketed
clauses), Sanity project credentials.
