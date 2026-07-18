import type { Resource } from "@/lib/cms/types";
import { siteConfig } from "@/lib/site-config";

/**
 * Resource library — editable in Sanity (resource documents). Categories are
 * derived from the data, so adding a resource with a new category creates the
 * category automatically.
 */
export const fallbackResources: Resource[] = [
  {
    title: "What Are Points and Miles?",
    description: "The five-minute foundation: what these currencies are and why they matter.",
    category: "Getting Started",
    kind: "internal",
    href: "/points-and-miles-101/what-are-points-and-miles",
  },
  {
    title: "Points and Miles 101 Learning Hub",
    description: "The full beginner curriculum, in plain language and reading order.",
    category: "Getting Started",
    kind: "internal",
    href: "/points-and-miles-101",
  },
  {
    title: "Common Beginner Mistakes (and How to Avoid Them)",
    description: "The mistakes almost everyone makes in year one — skip them entirely.",
    category: "Getting Started",
    kind: "internal",
    href: "/points-and-miles-101/common-beginner-mistakes",
  },
  {
    title: "Airline Miles vs. Hotel Points",
    description: "How the two big loyalty families differ, and why the difference matters.",
    category: "Airline Loyalty Programs",
    kind: "internal",
    href: "/points-and-miles-101/airline-miles-vs-hotel-points",
  },
  {
    title: "Award Search Techniques That Actually Work",
    description: "A practical process for finding award seats without losing your mind.",
    category: "Award Travel Basics",
    kind: "internal",
    href: "/tips-and-strategies/award-search-techniques",
  },
  {
    title: "Transferable Points, Explained",
    description: "Why flexible currencies are the center of a modern points strategy.",
    category: "Transferable Points",
    kind: "internal",
    href: "/points-and-miles-101/transferable-points-explained",
  },
  {
    title: "Making the Most of Transfer Bonuses",
    description: "How periodic transfer bonuses can stretch the points you already have.",
    category: "Transferable Points",
    kind: "internal",
    href: "/tips-and-strategies/maximize-transfer-bonuses",
  },
  {
    title: "The Credit Card Benefit Checklist",
    description: "A simple system for using the credits and perks you already pay for.",
    category: "Credit Card Benefits",
    kind: "internal",
    href: "/tips-and-strategies/credit-card-benefit-checklist",
  },
  {
    title: "The Annual Fee Review",
    description: "A once-a-year ritual that keeps your card lineup honest.",
    category: "Annual Fee Management",
    kind: "internal",
    href: "/tips-and-strategies/annual-fee-review",
  },
  {
    title: "Keeping Your Points Alive",
    description: "Expiration rules by program type, and easy ways to reset the clock.",
    category: "Points Tracking",
    kind: "internal",
    href: "/tips-and-strategies/keeping-points-alive",
  },
  {
    title: "CardMaster — Free Points & Benefits Tracker",
    description: "Track balances, benefits, annual fees, and expirations for your household.",
    category: "CardMaster Guides",
    kind: "external",
    href: siteConfig.cardmasterUrl,
  },
  {
    title: "Getting Started with CardMaster",
    description: "What CardMaster does, how approval works, and how to set up your account.",
    category: "CardMaster Guides",
    kind: "internal",
    href: "/cardmaster",
  },
  {
    title: "The Travel Technician Blog",
    description: "Ongoing tips, redemption stories, and program news from Jim.",
    category: "Travel Tools",
    kind: "blog",
    href: siteConfig.blogUrl,
  },
];
