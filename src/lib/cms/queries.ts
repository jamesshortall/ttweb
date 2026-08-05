/**
 * GROQ queries for every CMS-managed collection. Field projections mirror the
 * types in ./types.ts so Sanity data drops directly into the same components
 * as fallback content.
 */

export const statsQuery = /* groq */ `
*[_type == "statistic"] | order(orderRank asc) {
  "id": _id,
  value,
  label,
  description,
  isPlaceholder
}`;

export const homeSettingsQuery = /* groq */ `
*[_type == "siteSettings"][0] {
  heroHeadline,
  heroSubheadline,
  estimatedTravelValue,
  "newsletter": newsletter {
    mode,
    heading,
    body,
    topics
  }
}`;

export const servicesQuery = /* groq */ `
*[_type == "service"] | order(orderRank asc) {
  "slug": slug.current,
  name,
  tagline,
  summary,
  icon,
  description,
  bestFor,
  includes,
  boundaries,
  cta,
  featured
}`;

export const successStoriesQuery = /* groq */ `
*[_type == "successStory"] | order(orderRank asc) {
  "slug": slug.current,
  title,
  route,
  airline,
  cabin,
  pointsUsed,
  pointsUnit,
  taxesFeesUsd,
  cashValueUsd,
  summary,
  whyValuable,
  context,
  highlight,
  "image": {
    "src": image.asset->url,
    "alt": image.alt
  }
}`;

export const resourcesQuery = /* groq */ `
*[_type == "resource"] | order(category asc, orderRank asc) {
  title,
  description,
  category,
  kind,
  href
}`;

export const faqsQuery = /* groq */ `
*[_type == "faq" && group == $group] | order(orderRank asc) {
  question,
  answer
}`;

export const articlesQuery = /* groq */ `
*[_type == "article" && collection == $collection] | order(orderRank asc) {
  "slug": slug.current,
  title,
  description,
  collection,
  category,
  readingMinutes,
  sections[] { heading, paragraphs, bullets },
  keyTakeaways
}`;

export const featuredBlogPostsQuery = /* groq */ `
*[_type == "featuredBlogPost"] | order(publishedAt desc) [0...6] {
  title,
  url,
  excerpt,
  publishedAt
}`;

export const cardMasterFeaturesQuery = /* groq */ `
*[_type == "cardmasterFeature"] | order(orderRank asc) {
  title,
  description,
  icon
}`;

export const cardMasterScreenshotsQuery = /* groq */ `
*[_type == "cardmasterScreenshot"] | order(orderRank asc) {
  "src": image.asset->url,
  "alt": image.alt,
  caption
}`;

export const imageCollectionQuery = /* groq */ `
*[_type == "imageCollection" && key == $key][0] {
  "id": key,
  intervalMs,
  "images": images[] {
    "src": asset->url,
    "alt": alt
  }
}`;

export const appsQuery = /* groq */ `
*[_type == "app"] | order(orderRank asc) {
  "id": _id,
  name,
  tagline,
  description,
  url,
  "image": select(defined(image.asset) => { "src": image.asset->url, "alt": coalesce(image.alt, name) }),
  icon,
  badge,
  cta,
  "status": coalesce(status, "live"),
  "kind": coalesce(kind, "app")
}`;

/**
 * Published testimonials only, and only those with written permission on file.
 * The published perspective already excludes drafts; the permissionConfirmed
 * gate means an accidental publish still can't surface an unverified quote.
 */
export const testimonialsQuery = /* groq */ `
*[_type == "testimonial" && permissionConfirmed == true] | order(featured desc, orderRank asc, _createdAt desc) {
  "id": _id,
  quote,
  attribution,
  context,
  rating,
  featured
}`;
