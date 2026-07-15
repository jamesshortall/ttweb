import { siteConfig } from "@/lib/site-config";

export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

/**
 * Primary navigation. "Start Here" is the beginner-friendly label for the
 * Points & Miles 101 hub. The blog is an external site and is marked as such.
 */
export const primaryNav: NavItem[] = [
  { label: "Start Here", href: "/points-and-miles-101" },
  { label: "Tips & Strategies", href: "/tips-and-strategies" },
  { label: "Services", href: "/services" },
  { label: "CardMaster", href: "/cardmaster" },
  { label: "Success Stories", href: "/success-stories" },
  { label: "Resources", href: "/resources" },
  { label: "Blog", href: "/blog" },
  { label: "About Jim", href: "/about" },
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
