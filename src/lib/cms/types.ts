/**
 * Content types shared by the Sanity CMS layer and the built-in fallback
 * content. Everything the site renders flows through these shapes, so pages
 * are agnostic about whether content came from Sanity or from src/content.
 */

export interface SiteStat {
  id: string;
  /** Display value, e.g. "5M+" or the "$[VALUE]" placeholder. */
  value: string;
  label: string;
  description?: string;
  /** True while the value is an unconfirmed placeholder (see launch checklist). */
  isPlaceholder?: boolean;
}

export type IconName =
  | "compass"
  | "card"
  | "plane"
  | "chart"
  | "shield"
  | "bell"
  | "users"
  | "map"
  | "sparkles"
  | "calculator"
  | "luggage"
  | "globe"
  | "book"
  | "wrench"
  | "calendar"
  | "mail"
  | "search"
  | "check";

export interface Service {
  slug: string;
  name: string;
  tagline: string;
  /** Short description for cards and listings. */
  summary: string;
  icon: IconName;
  /** Longer intro paragraphs for the detail page. */
  description: string[];
  bestFor: string[];
  includes: string[];
  /** Honest boundary-setting, e.g. "not financial advice", "no booking". */
  boundaries: string[];
  cta: string;
  featured?: boolean;
}

export interface SuccessStory {
  slug: string;
  title: string;
  route: string;
  airline: string;
  cabin: string;
  pointsUsed: number;
  pointsUnit: "points" | "miles";
  taxesFeesUsd: number;
  cashValueUsd: number;
  summary: string;
  whyValuable: string[];
  context: string[];
  image: { src: string; alt: string };
  highlight?: string;
}

export type ResourceKind = "internal" | "external" | "blog" | "download" | "checklist";

export interface Resource {
  title: string;
  description: string;
  category: string;
  kind: ResourceKind;
  /** Optional: a resource may instead carry an uploaded PDF (see fileUrl). */
  href?: string;
  /** CDN URL of a PDF uploaded to Sanity; when present it is the link target. */
  fileUrl?: string;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface ArticleSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface Article {
  slug: string;
  title: string;
  description: string;
  collection: "points-101" | "tips";
  category: string;
  readingMinutes: number;
  sections: ArticleSection[];
  keyTakeaways: string[];
}

export interface GlossaryTerm {
  term: string;
  definition: string;
}

export interface FeaturedBlogPost {
  title: string;
  url: string;
  excerpt: string;
  publishedAt?: string;
}

export interface CardMasterFeature {
  title: string;
  description: string;
  icon: IconName;
}

export interface CardMasterScreenshot {
  src: string;
  alt: string;
  caption: string;
}

export interface RotatingImageItem {
  src: string;
  alt: string;
}

export interface RotatingImageCollection {
  id: string;
  /** Rotation interval in milliseconds. */
  intervalMs: number;
  images: RotatingImageItem[];
}

export type NewsletterMode = "coming-soon" | "active" | "hidden";

export interface NewsletterSettings {
  mode: NewsletterMode;
  heading: string;
  body: string;
  topics: string[];
}

/**
 * A single homepage spotlight, normalized from a Sanity reference to an
 * existing article, resource, success story, or service. Null when nothing is
 * selected — the homepage then renders no spotlight (never invented).
 */
export interface HomepageSpotlight {
  /** Small label above the card, e.g. "Featured" or "Editor's pick". */
  eyebrow: string;
  title: string;
  /** Custom blurb, or the item's own description. May be empty. */
  blurb: string;
  /** Resolved link to the item. */
  href: string;
  /** True when the link opens in a new tab (a PDF or external resource). */
  external: boolean;
  /** Short type tag, e.g. "Article", "Guide (PDF)", "Service". */
  kindLabel: string;
}

export interface HomepageSettings {
  heroHeadline: string;
  heroSubheadline: string;
  /** Null until Jim finalizes the estimated-travel-value statistic. */
  estimatedTravelValue: string | null;
  newsletter: NewsletterSettings;
  /** The chosen homepage spotlight, or null when none is selected. */
  spotlight?: HomepageSpotlight | null;
}

/**
 * A published, permission-confirmed client testimonial. The query never
 * returns drafts or unconfirmed quotes, so anything of this shape is safe to
 * display publicly.
 */
export interface Testimonial {
  id: string;
  quote: string;
  attribution: string;
  context?: string;
  rating?: number;
  featured?: boolean;
}
