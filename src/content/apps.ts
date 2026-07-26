import type { IconName } from "@/lib/cms/types";
import { siteConfig } from "@/lib/site-config";

/**
 * The Travel Technician suite — every app and web property, in one registry.
 *
 * Add a new app by appending one entry here; the /apps hub, navigation, and
 * sitemap pick it up automatically. Keep descriptions honest — never invent
 * features an app doesn't have.
 */

export type AppStatus = "live" | "coming-soon";
export type AppKind = "app" | "site";

export interface AppEntry {
  id: string;
  name: string;
  /** One-line summary shown under the name. */
  tagline: string;
  /** A sentence or two for the hub card. */
  description: string;
  url: string;
  /**
   * Card visual. An uploaded photo/logo (`image`) wins when present; otherwise
   * the built-in duotone `icon` is used. At least one should be set.
   */
  image?: { src: string; alt: string };
  icon?: IconName;
  status: AppStatus;
  kind: AppKind;
  /** Short badge, e.g. "Free", "New". Optional. */
  badge?: string;
  /** Call-to-action label on the card. */
  cta: string;
  /** True while copy is a placeholder awaiting real product details. */
  needsCopy?: boolean;
}

export const apps: AppEntry[] = [
  {
    id: "cardmaster",
    name: "CardMaster",
    tagline: "Your whole points life, organized.",
    description:
      "A free tracker for loyalty balances, credit-card benefits, statement credits, annual fees, and expiration reminders — for you and your household.",
    url: siteConfig.cardmasterUrl,
    icon: "card",
    status: "live",
    kind: "app",
    badge: "Free",
    cta: "Open CardMaster",
  },
  {
    id: "apppassport",
    name: "AppPassport",
    tagline: "Which of your apps work abroad — and what to download instead.",
    description:
      "Country-by-country guidance on whether your everyday apps — Apple Pay, Google Maps, WhatsApp, Uber and more — actually work where you're headed, with the local alternative to use, how much setup it takes, and a plain-English why. Your pre-trip checklist for your phone.",
    url: siteConfig.passportUrl,
    icon: "globe",
    status: "live",
    kind: "app",
    badge: "New",
    cta: "Open AppPassport",
  },
  {
    id: "blog",
    name: "The Travel Technician Blog",
    tagline: "Field notes, tips, and destinations.",
    description:
      "Deep dives on points, miles, and the trips they unlock — updated regularly on the Travel Technician blog.",
    url: siteConfig.blogUrl,
    icon: "book",
    status: "live",
    kind: "site",
    cta: "Read the blog",
  },
];
