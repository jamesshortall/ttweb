import type { Service } from "@/lib/cms/types";

/**
 * Paid services — editable in Sanity (service documents).
 * No fixed pricing by design: every service uses a contact/consultation CTA.
 */
export const fallbackServices: Service[] = [
  {
    slug: "points-and-miles-consultation",
    name: "One-on-One Points & Miles Consultation",
    tagline: "A personal session focused on your accounts, your goals, and your next trip.",
    summary:
      "Personalized guidance to help you understand your loyalty accounts, clarify your travel goals, and find the opportunities hiding in the points you already have.",
    icon: "compass",
    description: [
      "Every points situation is different. Maybe you have a pile of points and no idea what they're worth. Maybe you're starting from zero and want to do it right from day one. Maybe you're planning one important trip and want to make your balances stretch as far as they can.",
      "In a one-on-one consultation, Jim walks through your loyalty accounts, your travel goals, and your spending patterns, then helps you build a plain-language plan you can actually follow. No jargon, no pressure, and no assumption that you already know how any of this works.",
    ],
    bestFor: [
      "Beginners who want a clear starting point",
      "People sitting on points they don't know how to use",
      "Anyone planning a big or important trip",
      "Families trying to reduce vacation costs",
    ],
    includes: [
      "A review of your current points, miles, and loyalty accounts",
      "A discussion of your travel goals and timeline",
      "Plain-language explanations of the programs you already use",
      "A prioritized set of next steps tailored to you",
    ],
    boundaries: [
      "Educational guidance only — not financial, legal, or tax advice",
      "Travel Technician does not book travel on your behalf",
    ],
    cta: "Schedule a Free Consultation",
    featured: true,
  },
  {
    slug: "credit-card-strategy",
    name: "Credit Card Strategy Session",
    tagline: "Make sense of the cards you have — and the ones you're considering.",
    summary:
      "Educational guidance about selecting and organizing credit cards based on your travel goals, spending habits, annual fees, benefits, and loyalty programs.",
    icon: "card",
    description: [
      "Credit card rewards are the engine of most points strategies — and also where people get overwhelmed. Annual fees stack up, benefits go unused, and it's hard to know whether a card is earning its keep.",
      "A strategy session looks at your existing cards and your goals, and helps you understand how issuers' ecosystems, earning rates, benefits, and fees fit together. The focus is education: understanding the trade-offs so you can make your own informed decisions.",
    ],
    bestFor: [
      "People whose annual fees have crept up over the years",
      "Anyone unsure which card to use for which purchase",
      "Travelers deciding between competing card ecosystems",
      "Households coordinating cards across two or more people",
    ],
    includes: [
      "A walkthrough of your current cards, fees, and benefits",
      "An explanation of how earning rates and categories work",
      "A framework for evaluating whether a card is worth keeping",
      "Education about issuer ecosystems and transferable points",
    ],
    boundaries: [
      "Education only — not financial advice, and never a recommendation to take on debt",
      "Card approval decisions are made solely by issuers",
      "Opening new cards is not appropriate for everyone; carrying a balance to earn rewards never makes sense",
    ],
    cta: "Discuss Your Points Strategy",
    featured: true,
  },
  {
    slug: "award-travel-assistance",
    name: "Award Travel Search Assistance",
    tagline: "Understand your realistic award options before you transfer a single point.",
    summary:
      "Help understanding possible award routes, airline programs, transfer partners, redemption options, taxes, fees, and the trade-offs between them.",
    icon: "plane",
    description: [
      "Finding award seats is the hardest part of points and miles. Availability is unpredictable, programs price the same seat differently, and taxes and fees can vary by hundreds of dollars depending on how you book.",
      "Award search assistance helps you understand what's realistically available for your trip: which programs can book the flights you want, what they're likely to charge in points and cash, and what the trade-offs are between routings, cabins, and dates. You stay in control and make the bookings yourself — Jim makes sure you understand your options first.",
    ],
    bestFor: [
      "Travelers with a specific trip in mind",
      "Anyone confused by transfer partners and award charts",
      "People who found 'no availability' and don't know what to try next",
      "Premium-cabin hopefuls working with a fixed points budget",
    ],
    includes: [
      "A review of the routes and programs relevant to your trip",
      "Plain-language explanation of transfer partners and pricing",
      "Guidance on taxes, fees, and fuel surcharges by program",
      "A realistic read on availability patterns and backup plans",
    ],
    boundaries: [
      "Travel Technician does not book flights or hotels and is not a travel agency",
      "Award availability changes constantly and is never guaranteed",
    ],
    cta: "Contact Jim for Details",
    featured: true,
  },
  {
    slug: "loyalty-program-review",
    name: "Loyalty Program Review",
    tagline: "Get more out of the programs you already belong to.",
    summary:
      "A guided review of airline, hotel, and transferable-points programs so you understand how to use each one more effectively.",
    icon: "chart",
    description: [
      "Most people belong to more loyalty programs than they realize — and use almost none of them well. Each program has its own earning quirks, elite tiers, sweet spots, and expiration rules.",
      "A loyalty program review looks at the programs you actually use, explains where each one shines and where it falls short, and shows you how they can work together instead of sitting in separate silos.",
    ],
    bestFor: [
      "Travelers loyal to one airline or hotel chain out of habit",
      "People juggling a half-dozen programs with no system",
      "Anyone curious whether their loyalty is actually paying off",
    ],
    includes: [
      "A review of the airline and hotel programs you use",
      "An explanation of each program's strengths and sweet spots",
      "Expiration rules and simple ways to keep balances alive",
      "How transferable currencies connect your programs",
    ],
    boundaries: [
      "Independent education — Travel Technician is not affiliated with any loyalty program",
      "Program rules change; always confirm details with the program directly",
    ],
    cta: "Contact Jim for Details",
  },
  {
    slug: "points-portfolio-audit",
    name: "Points Portfolio Audit",
    tagline: "A complete, technician-style review of everything you've earned.",
    summary:
      "A structured evaluation of your points, miles, credit cards, annual fees, benefits, expiration risks, and travel objectives — with clear next steps.",
    icon: "calculator",
    description: [
      "Think of this as a systems check for your entire points life. An audit inventories every balance, card, fee, and benefit you have, flags points at risk of expiring, identifies benefits you're paying for but not using, and matches what you hold against what you actually want to do with it.",
      "You leave with an organized picture of your portfolio and a prioritized action list — what to use, what to keep, what to watch, and what to rethink.",
    ],
    bestFor: [
      "Long-time collectors who've lost track of what they have",
      "Households with points scattered across many accounts",
      "Anyone paying multiple annual fees without a clear reason",
      "People who want a plan before points expire or devalue",
    ],
    includes: [
      "A full inventory of points, miles, and credit card benefits",
      "Expiration-risk and devaluation-risk flags",
      "An annual-fee versus benefits reality check",
      "A prioritized, written action plan",
    ],
    boundaries: [
      "Educational analysis only — not financial advice",
      "Estimated point values are estimates, not guarantees",
    ],
    cta: "Contact Jim for Details",
  },
];
