import type { SuccessStory } from "@/lib/cms/types";

/**
 * Real redemption examples — editable and extendable in Sanity (successStory
 * documents). Values are the actual figures from Jim's redemptions; the
 * cents-per-point estimate is computed from them and always labelled as an
 * estimate based on the comparable cash price.
 */
export const fallbackSuccessStories: SuccessStory[] = [
  {
    slug: "qatar-qsuites-boston-singapore",
    title: "Qatar Airways QSuites to Singapore",
    route: "Boston (BOS) → Doha (DOH) → Singapore (SIN)",
    airline: "Qatar Airways",
    cabin: "QSuites business class",
    pointsUsed: 75_000,
    pointsUnit: "points",
    taxesFeesUsd: 279,
    cashValueUsd: 7_000,
    summary:
      "A lie-flat suite with a closing door for roughly the cash price of an economy ticket — one of the most sought-after business class products in the sky, booked with points.",
    whyValuable: [
      "QSuites is widely considered one of the best business class products flying: a private suite with a sliding door, lie-flat bed, and dine-on-demand service — for more than 17 hours of flying time.",
      "The comparable cash fare for this itinerary was around $7,000. After subtracting the $279 in taxes and fees, the points covered roughly $6,700 of value — an estimated 9¢ per point, several times the typical baseline valuation of a transferable point.",
      "Because the points came from a transferable currency, they could have gone to many programs — choosing the right transfer partner is what unlocked this price.",
    ],
    context: [
      "QSuites award space at this level is limited and unpredictable — it typically requires flexible dates and booking when space appears, not when it's convenient.",
      "The cash price used for comparison is the fare on the same flights around the time of booking; premium-cabin cash fares swing widely, so the cents-per-point figure is an estimate, not a fixed exchange rate.",
    ],
    image: {
      src: "/images/success-stories/qsuites-boston-singapore.svg",
      alt: "Placeholder artwork representing a night flight in a business class cabin",
    },
    highlight: "Estimated 9¢ per point in value",
  },
  {
    slug: "austrian-business-boston-vienna",
    title: "Last-Minute Austrian Airlines Business Class to Vienna",
    route: "Boston (BOS) → Vienna (VIE)",
    airline: "Austrian Airlines",
    cabin: "Business class",
    pointsUsed: 70_000,
    pointsUnit: "miles",
    taxesFeesUsd: 58,
    cashValueUsd: 7_900,
    summary:
      "A last-minute transatlantic business class seat — when the cash fare had climbed to nearly $8,000 — booked with 70,000 miles and $58 in taxes and fees.",
    whyValuable: [
      "This is where points and miles shine brightest: last-minute premium fares are often at their most expensive exactly when award pricing stays flat. The cash fare here was approximately $7,900; the award cost 70,000 miles plus $58.",
      "Net of taxes and fees, that's roughly $7,840 in value — an estimated 11¢ per mile, an exceptional result by any measure.",
      "Airlines sometimes open premium award space close to departure to fill unsold seats. Knowing which programs to check — and having miles ready in the right place — is what turns that pattern into a booked seat.",
    ],
    context: [
      "Last-minute award space is a pattern, not a promise: it appears on some flights and not others, and it can vanish in hours.",
      "The near-$8,000 comparison fare reflects last-minute pricing that most travelers would never pay in cash — which is exactly why the cents-per-mile figure is presented as an estimate of comparable value, not money saved.",
    ],
    image: {
      src: "/images/success-stories/austrian-boston-vienna.svg",
      alt: "Placeholder artwork representing an aerial view of Vienna",
    },
    highlight: "Estimated 11¢ per mile in value",
  },
  {
    slug: "qatar-qsuites-boston-dubai",
    title: "Qatar Airways QSuites to Dubai",
    route: "Boston (BOS) → Doha (DOH) → Dubai (DXB)",
    airline: "Qatar Airways",
    cabin: "QSuites business class",
    pointsUsed: 75_000,
    pointsUnit: "points",
    taxesFeesUsd: 268,
    cashValueUsd: 5_666,
    summary:
      "The same award-winning QSuites product — a private business class suite with a closing door — flown Boston to Dubai via Doha, booked with 75,000 points and $268 in taxes and fees.",
    whyValuable: [
      "QSuites is widely regarded as one of the best business class products in the sky: a private suite with a sliding door, a lie-flat bed, and dine-on-demand service across two long flights via Doha.",
      "The comparable cash fare for this itinerary was around $5,666. After subtracting the $268 in taxes and fees, the points covered roughly $5,400 of value — an estimated 7¢ per point, comfortably above the typical baseline valuation of a transferable point.",
      "Because the points came from a transferable currency, they could have moved to several programs — choosing the right transfer partner is what unlocked this price.",
    ],
    context: [
      "QSuites award space is limited and unpredictable — it usually takes flexible dates and booking when space appears, not when it's convenient.",
      "The cash price used for comparison is the fare on the same flights around the time of booking; premium-cabin fares swing widely, so the cents-per-point figure is an estimate, not a fixed exchange rate.",
    ],
    image: {
      src: "/images/success-stories/qsuites-boston-singapore.svg",
      alt: "Placeholder artwork representing a night flight in a business class cabin",
    },
    highlight: "Estimated 7¢ per point in value",
  },
];

/** Shared honesty disclaimer shown wherever redemption examples appear. */
export const successStoryDisclaimer = [
  "Award availability changes constantly and is never guaranteed.",
  "Loyalty program rules, award pricing, and transfer partners change without notice.",
  "Taxes, fees, and surcharges vary by program, route, and date.",
  "Cash prices fluctuate; every cents-per-point figure is an estimate based on a comparable cash price at the time of booking.",
  "Transfer availability between programs is not guaranteed.",
  "These examples show what is possible — they are not a promise that any specific redemption can be reproduced.",
];
