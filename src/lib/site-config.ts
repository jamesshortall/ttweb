/**
 * Public site configuration.
 *
 * Safe for client components: only NEXT_PUBLIC_* values (inlined at build
 * time) and static brand constants live here. Sensible fallbacks keep the
 * site fully functional with no environment configuration at all.
 */

export const siteConfig = {
  name: "Travel Technician",
  tagline: "Turn your points into unforgettable travel.",
  supportingTagline: "Turn everyday spending into extraordinary travel.",
  description:
    "Travel Technician helps beginners learn how to earn, organize, and redeem points and miles — with free tools, plain-language education, and one-on-one strategy help from Jim Shortall.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.traveltechnician.info",
  cardmasterUrl:
    process.env.NEXT_PUBLIC_CARDMASTER_URL ?? "https://cardmaster.traveltechnician.info",
  blogUrl: process.env.NEXT_PUBLIC_BLOG_URL ?? "https://blog.traveltechnician.info",
  instagramUrl:
    process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "https://instagram.com/the_travel_technician",
  facebookUrl: process.env.NEXT_PUBLIC_FACEBOOK_URL ?? "https://www.facebook.com/TravelTechnician",
  /** Empty until the real Calendly link is configured — see .env.example. */
  calendlyUrl: process.env.NEXT_PUBLIC_CALENDLY_URL ?? "",
  founder: {
    name: "Jim Shortall",
    shortName: "Jim",
    /** Formal name reserved for legal/metadata contexts only. */
    legalName: "James Shortall",
    role: "Founder, Travel Technician",
  },
  /**
   * Public contact email. Rendered obfuscated (see ObfuscatedEmail component)
   * and only on the contact + legal pages to limit spam harvesting.
   */
  contactEmail: { user: "jim", domain: "traveltechnician.info" },
} as const;

export const analyticsConfig = {
  provider: process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER ?? "",
  id: process.env.NEXT_PUBLIC_ANALYTICS_ID ?? "",
  cookieless: process.env.NEXT_PUBLIC_ANALYTICS_COOKIELESS === "true",
  get enabled(): boolean {
    return (this.provider === "plausible" || this.provider === "google") && this.id.length > 0;
  },
} as const;

/** Absolute URL for a site path — used by metadata and structured data. */
export function absoluteUrl(path = "/"): string {
  return new URL(path, siteConfig.url).toString();
}
