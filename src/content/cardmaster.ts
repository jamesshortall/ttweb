import type { CardMasterFeature, CardMasterScreenshot } from "@/lib/cms/types";

/** CardMaster feature cards — editable in Sanity (cardmasterFeature documents). */
export const fallbackCardMasterFeatures: CardMasterFeature[] = [
  {
    title: "Track points and miles balances",
    description:
      "One dashboard for every airline, hotel, and transferable-points balance you have — no more logging into ten programs to remember what you've earned.",
    icon: "chart",
  },
  {
    title: "Track credit card benefits and credits",
    description:
      "Airline fee credits, dining credits, travel credits — see every recurring benefit on your cards and whether you've used it yet this year.",
    icon: "card",
  },
  {
    title: "Track annual fees",
    description:
      "Know exactly when each annual fee posts and what you're getting for it, so keep-or-cancel decisions happen on your schedule, not the bank's.",
    icon: "calculator",
  },
  {
    title: "Expiration reminders",
    description:
      "Get reminded before points and miles expire, while there's still time to extend or use them. Expired points are the most expensive mistake in this hobby.",
    icon: "bell",
  },
  {
    title: "Household management",
    description:
      "Manage cards and balances for multiple household members in one account — the way families actually earn and use points together.",
    icon: "users",
  },
  {
    title: "Built by a points traveler",
    description:
      "CardMaster is the tool Jim built to run his own 5-million-point strategy — shaped by real use, not by what looks good in a demo.",
    icon: "wrench",
  },
];

export const fallbackCardMasterScreenshots: CardMasterScreenshot[] = [
  {
    src: "/images/cardmaster/screenshot-dashboard.svg",
    alt: "Placeholder screenshot of the CardMaster points dashboard listing loyalty balances",
    caption: "Every balance in one dashboard",
  },
  {
    src: "/images/cardmaster/screenshot-benefits.svg",
    alt: "Placeholder screenshot of CardMaster benefit and statement-credit tracking",
    caption: "Benefits and credits, tracked through the year",
  },
  {
    src: "/images/cardmaster/screenshot-household.svg",
    alt: "Placeholder screenshot of CardMaster household card management",
    caption: "Cards for the whole household",
  },
];

export const cardMasterHowItWorks = [
  {
    title: "Request an account",
    description:
      "Register at cardmaster.traveltechnician.info. New accounts require approval, which keeps the platform limited to real people.",
  },
  {
    title: "Add your programs and cards",
    description:
      "Enter the loyalty programs, balances, cards, benefits, and annual fees you want to track. CardMaster never connects to your bank accounts.",
  },
  {
    title: "Stay organized automatically",
    description:
      "See everything in one dashboard, get reminded before points expire, and check off statement credits as you use them.",
  },
];
