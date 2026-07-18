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

/** Real CardMaster screenshots. Editable in Sanity (cardmasterScreenshot documents). */
export const fallbackCardMasterScreenshots: CardMasterScreenshot[] = [
  {
    src: "/images/cardmaster/screenshot-dashboard.png",
    alt: "CardMaster overview dashboard showing value realized, open cards, total points, and credit scores",
    caption: "Your whole portfolio at a glance",
  },
  {
    src: "/images/cardmaster/screenshot-points.png",
    alt: "CardMaster points tracker listing balances across credit card, hotel, and airline programs",
    caption: "Every balance, tracked by program",
  },
  {
    src: "/images/cardmaster/screenshot-524.png",
    alt: "CardMaster 5/24 dashboard tracking Chase application eligibility for two household members",
    caption: "Application rules, tracked per person",
  },
  {
    src: "/images/cardmaster/screenshot-trips.png",
    alt: "CardMaster trips and bookings view with an interactive world map of upcoming trips",
    caption: "Trips and bookings on a map",
  },
  {
    src: "/images/cardmaster/screenshot-achievements.png",
    alt: "CardMaster achievements grid showing unlocked and locked progress badges",
    caption: "Progress and achievements",
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
