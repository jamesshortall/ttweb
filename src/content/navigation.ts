import { siteConfig } from "@/lib/site-config";

export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
  description?: string;
}

/**
 * Primary navigation. Educational pages are grouped under a "Learn" menu so the
 * first-level bar stays short and well-organized.
 */
export const learnMenu: NavItem[] = [
  {
    label: "Points & Miles 101",
    href: "/points-and-miles-101",
    description: "Start here — the beginner curriculum, in plain language.",
  },
  {
    label: "Tips & Strategies",
    href: "/tips-and-strategies",
    description: "Practical playbooks for earning and redeeming.",
  },
  {
    label: "Success Stories",
    href: "/success-stories",
    description: "Real redemptions, with the honest math.",
  },
  {
    label: "Resources",
    href: "/resources",
    description: "The full beginner-friendly library.",
  },
];

export const primaryNav: NavItem[] = [
  { label: "Services", href: "/services" },
  { label: "CardMaster", href: "/cardmaster" },
  { label: "About Jim", href: "/about" },
  { label: "Blog", href: "/blog", external: false },
];

/** Flat list of every top-level destination, used by the mobile drawer. */
export const mobileNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Points & Miles 101", href: "/points-and-miles-101" },
  { label: "Tips & Strategies", href: "/tips-and-strategies" },
  { label: "Services", href: "/services" },
  { label: "CardMaster", href: "/cardmaster" },
  { label: "Success Stories", href: "/success-stories" },
  { label: "Resources", href: "/resources" },
  { label: "About Jim", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export const footerLearnLinks: NavItem[] = [
  { label: "Points & Miles 101", href: "/points-and-miles-101" },
  { label: "Tips & Strategies", href: "/tips-and-strategies" },
  { label: "Resources", href: "/resources" },
  { label: "Success Stories", href: "/success-stories" },
  { label: "Travel Technician Blog", href: siteConfig.blogUrl, external: true },
];

export const footerCompanyLinks: NavItem[] = [
  { label: "About Jim", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "CardMaster", href: "/cardmaster" },
  { label: "Contact", href: "/contact" },
];

export const footerLegalLinks: NavItem[] = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Use", href: "/terms-of-use" },
  { label: "Disclaimer", href: "/disclaimer" },
  { label: "Accessibility Statement", href: "/accessibility" },
];
