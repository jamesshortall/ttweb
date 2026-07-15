import type { HomepageSettings, SiteStat } from "@/lib/cms/types";

/** Homepage settings — editable in Sanity (homeSettings) once configured. */
export const fallbackHomepageSettings: HomepageSettings = {
  heroHeadline: "Turn your points into unforgettable travel.",
  heroSubheadline:
    "Learn how to earn, organize, and redeem points and miles with a strategy designed around your goals. Travel Technician helps beginners turn everyday spending into more comfortable and memorable travel.",
  // PLACEHOLDER — the finalized dollar figure has not been provided.
  // Set it in Sanity (or here) before launch; see docs/LAUNCH-CHECKLIST.md.
  estimatedTravelValue: null,
  newsletter: {
    mode: "coming-soon",
    heading: "The Travel Technician newsletter is coming soon",
    body: "Points and miles news, transfer bonuses, program changes, beginner education, and redemption ideas — delivered occasionally, never spammy. Sign-up opens once the newsletter launches.",
    topics: [
      "Points and miles news",
      "Transfer bonuses",
      "Loyalty program changes",
      "Beginner education",
      "Credit card benefit reminders",
      "New blog posts",
      "Travel redemption tips",
    ],
  },
};

/** Homepage statistics — editable in Sanity (statistic documents). */
export const fallbackStats: SiteStat[] = [
  {
    id: "points-redeemed",
    value: "5M+",
    label: "Points and miles redeemed",
    description: "Real redemptions across airline, hotel, and transferable-points programs.",
  },
  {
    id: "countries",
    value: "30+",
    label: "Countries visited",
    description: "First-hand experience with the destinations points can reach.",
  },
  {
    id: "experience",
    value: "3+",
    label: "Years of focused points-and-miles experience",
    description: "Studying programs, tracking changes, and testing strategies.",
  },
  {
    id: "estimated-value",
    // PLACEHOLDER — replace "$[VALUE]" with the finalized estimate before launch.
    value: "$[VALUE]",
    label: "In estimated travel value",
    description: "Estimated value received from points, based on comparable cash prices.",
    isPlaceholder: true,
  },
];
