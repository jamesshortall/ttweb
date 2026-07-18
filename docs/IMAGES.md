# Image & Asset Guide

## Folder structure (`public/images/`)

| Folder             | Contents                                                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `brand/`           | Logos: `logo-primary.svg`, `logo-horizontal.svg`, `logo-square.svg`, `logo-light.svg` (placeholders — replace, keep filenames) |
| `jim/`             | Jim's portrait + personal travel photos                                                                                        |
| `travel/`          | Homepage-hero rotation photos                                                                                                  |
| `destinations/`    | Destination gallery / section backgrounds                                                                                      |
| `cardmaster/`      | CardMaster app screenshots                                                                                                     |
| `success-stories/` | One image per redemption story                                                                                                 |
| `placeholders/`    | Spare generated artwork (safe to delete at launch)                                                                             |

The site now ships Jim's real travel photography and logos under `public/images/`. These
are the built-in fallback assets; once Sanity is configured, photos are managed in the
Studio instead (see [CONTENT-GUIDE.md](CONTENT-GUIDE.md#add-personal-travel-photos--change-rotating-images))
and no code edit is needed to add or swap them.

## Recommended dimensions & aspect ratios

| Use                        | Aspect       | Recommended size | Notes                                                                |
| -------------------------- | ------------ | ---------------- | -------------------------------------------------------------------- |
| Hero / section backgrounds | 16:10        | 1600×1000        | Displayed full-bleed behind a dark overlay; keep key detail centered |
| Destination cards          | 16:10        | 1200×750         |                                                                      |
| Success-story images       | ~2:1         | 1600×800         | Top strip of the story card                                          |
| Jim's portrait             | 4:5          | 800×1000         | Face in upper half; also used small on the homepage                  |
| Travel photos (galleries)  | 16:10 or 3:2 | 1200×750+        | Mixed orientations are fine in Sanity (hotspot crop)                 |
| CardMaster screenshots     | 16:10        | 1440×900         | Capture at 1440px browser width, no personal data                    |
| Square social logo         | 1:1          | 512×512          |                                                                      |

## File-size targets & compression

- Photos: **< 300 KB** each (heroes up to 500 KB); screenshots < 250 KB.
- Export JPEG quality ~75–80, or better: convert to WebP (`npx sharp-cli` or squoosh.app).
- `next/image` serves AVIF/WebP and responsive sizes automatically — but it can't fix a
  10 MB original, so compress before committing.
- Strip EXIF data (location!) from personal photos: `exiftool -all= photo.jpg` or any
  export-for-web option.

## Naming conventions

`kebab-case`, content-first, no spaces: `jim-portrait.jpg`, `hero-maldives-lagoon.jpg`,
`dest-vienna-skyline.jpg`, `screenshot-dashboard.png`, `qsuites-boston-singapore.jpg`.
Keep the folder prefixes above so ownership stays obvious.

## Replacing a placeholder

1. Optimize the new image (sizes above) and drop it into the matching folder.
2. Search for the placeholder path, e.g. `grep -rn "jim-portrait" src/`, and update the
   path + `width`/`height` props if the extension changed.
3. Rewrite the **alt text** to describe the real image (see below).
4. If the image belongs to a rotating collection, update `src/content/images.ts` (or the
   Sanity _Rotating Image Collections_ document).

Using Unsplash during development is fine — download the file locally (do **not** hotlink
`images.unsplash.com` in production), keep a note of the photographer for courtesy credit,
and confirm the Unsplash license covers the use.

## Alt text

- Describe what's _in_ the image for someone who can't see it: "Overwater bungalows at
  sunrise in the Maldives", not "beach photo".
- Decorative flourishes (gradient glows, dividers) are marked `aria-hidden` in code — no
  alt needed.
- In Sanity, alt text is a required field on every image; in fallback content it's the
  `alt` property next to each `src`.

## Adding photos to galleries and rotating sections

Rotating collections are defined in `src/content/images.ts` (fallback) or Sanity →
_Rotating Image Collections_ (`homeHero`, `destinations`, `successStories`, `aboutJim`).
Add `{ src, alt }` entries — order matters only for the first frame shown; afterwards
rotation is randomized with no immediate repeats. Keep 3–6 images per collection and the
interval at ~60 s.
