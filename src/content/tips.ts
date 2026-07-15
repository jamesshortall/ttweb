import type { Article } from "@/lib/cms/types";

/**
 * Tips & Strategies — practical playbooks for readers past the basics.
 * Editable and extendable in Sanity (article documents, collection "tips").
 */
export const fallbackTips: Article[] = [
  {
    slug: "maximize-transfer-bonuses",
    title: "Making the Most of Transfer Bonuses",
    description:
      "Banks periodically offer 20–40% bonuses when transferring points to partners. Used carefully, they're free leverage; used carelessly, a trap.",
    collection: "tips",
    category: "Transfer Bonuses",
    readingMinutes: 5,
    sections: [
      {
        heading: "What a transfer bonus really is",
        paragraphs: [
          "Several times a year, transferable-points programs offer limited-time bonuses to specific partners — transfer 60,000 points, receive 75,000 or 80,000 miles. When a bonus aligns with an award you actually want, it's a straight discount on the trip: the same seat for 20–30% fewer points.",
        ],
      },
      {
        heading: "The right way to use one",
        paragraphs: [
          "Work backwards from the award, never forwards from the bonus. Find bookable award space first, confirm the total price in miles and fees, then transfer during the bonus window — moving only what the booking needs. The bonus is a multiplier on a good plan, not a reason to create one.",
          "It's equally fine to ignore most bonuses. If the partner doesn't serve your routes, a 30% bonus to a program you'll never use converts flexible points into stranded ones.",
        ],
      },
      {
        heading: "The trap to avoid",
        paragraphs: [
          "Speculative transfers are the classic mistake: moving a big balance 'because the bonus is great' with no award in hand. Transfers are irreversible, availability may never materialize on your routes, and the destination program can devalue. When in doubt, keep points flexible — there will always be another bonus.",
        ],
      },
    ],
    keyTakeaways: [
      "Treat bonuses as discounts on awards you've already found — not reasons to transfer.",
      "Transfer only what the booking needs; keep the rest flexible.",
      "Skipping a bonus is often the right call.",
    ],
  },
  {
    slug: "annual-fee-review",
    title: "The Annual Fee Review: A Once-a-Year Ritual",
    description:
      "A 30-minute yearly review of every card, fee, and benefit keeps your lineup honest — and catches the cards that stopped earning their keep.",
    collection: "tips",
    category: "Annual Fee Reviews",
    readingMinutes: 6,
    sections: [
      {
        heading: "Why fees deserve a ritual",
        paragraphs: [
          "Card lineups grow one good decision at a time — and quietly decay the same way. A card that made sense three years ago may now be a $95 or $550 subscription to benefits you no longer use. Because fees renew silently, the only defense is a scheduled review: once a year, every card, no exceptions.",
        ],
      },
      {
        heading: "The keep-downgrade-cancel framework",
        paragraphs: [
          "For each card, tally what you actually received in the last twelve months: credits you genuinely used (not theoretical ones), points earned above what a no-fee card would have earned, and perks you truly valued. Compare that to the fee.",
        ],
        bullets: [
          "Keep — real value clearly exceeds the fee. Note which benefits justified it and use them again next year.",
          "Downgrade — the card no longer earns its fee, but its history or ecosystem is worth keeping. Issuers can often move you to a no-fee version, preserving the account.",
          "Cancel — no realistic use, no downgrade path. Redeem or transfer any orphaned points first; some currencies vanish when the card closes.",
        ],
      },
      {
        heading: "Make next year's review easy",
        paragraphs: [
          "The review is only painful when the data is scattered. Track each card's fee date, credits, and usage as the year goes — CardMaster does exactly this for free — and next year's decision takes minutes instead of an afternoon of statement archaeology.",
          "One caution: canceling cards can affect your credit profile, and issuers set their own rules about reapplying. Decide with your overall financial picture in mind, not just the points math.",
        ],
      },
    ],
    keyTakeaways: [
      "Review every card annually against the value you actually received.",
      "Downgrading often beats canceling; rescue orphaned points before closing anything.",
      "Tracking benefits during the year makes the review trivial.",
    ],
  },
  {
    slug: "family-points-strategy",
    title: "Points Strategy for Families and Households",
    description:
      "Two adults, coordinated, can roughly double a points strategy — if the household runs a system instead of two solo hobbies.",
    collection: "tips",
    category: "Family Strategies",
    readingMinutes: 6,
    sections: [
      {
        heading: "The household advantage",
        paragraphs: [
          "Most points advice is written for individuals, but families hold the structural edge: two adults can each earn welcome offers, spending can be routed deliberately, and many programs allow pooling or booking for each other. The same habits that earn one seat can earn a family's worth.",
        ],
      },
      {
        heading: "Coordinate, don't duplicate",
        paragraphs: [
          "The common failure mode is two people independently collecting small balances in many programs — enough for nothing, spread everywhere. Coordination means agreeing where the household's points should concentrate, routing shared spending there, and timing card decisions as a team.",
        ],
        bullets: [
          "Concentrate on one or two transferable currencies as the household core.",
          "Check each program's rules for pooling points or booking award travel for family members — many allow it.",
          "Stagger welcome offers between adults instead of doubling up in the same month.",
          "Watch authorized-user fees: sometimes they add real benefits, sometimes just cost.",
        ],
      },
      {
        heading: "The logistics nobody warns you about",
        paragraphs: [
          "Four travelers need four award seats on the same flight — and award space frequently appears in ones and twos. Families win by planning earlier than solo travelers, splitting across two nearby flights when needed, and favoring hotel redemptions, where a points booking for the whole family is rarely rationed.",
          "Household tracking also gets real: multiple people, cards, fee dates, and expirations outgrow both memory and spreadsheets fast. CardMaster's household management exists precisely for this.",
        ],
      },
    ],
    keyTakeaways: [
      "Households that coordinate roughly double their earning power.",
      "Concentrate balances in a shared core instead of scattering them.",
      "Plan award searches earlier — space for four is scarcer than space for one.",
    ],
  },
  {
    slug: "award-search-techniques",
    title: "Award Search Techniques That Actually Work",
    description:
      "A repeatable process for finding award seats: where to search, in what order, and what to do when everything shows 'no availability.'",
    collection: "tips",
    category: "Award Search",
    readingMinutes: 7,
    sections: [
      {
        heading: "Search like a technician, not a tourist",
        paragraphs: [
          "Typing exact dates into one airline's site and giving up is how most people conclude award travel is dead. A working search runs the opposite way: start broad — a whole month if you can — identify which days have space at sane prices, and only then narrow to an itinerary.",
          "Search where the space is visible, too. Partner programs often display the same seats with different pricing and fees, so the program you search through changes both what you see and what you pay.",
        ],
      },
      {
        heading: "A repeatable five-step process",
        paragraphs: ["When a trip gets serious, run the same sequence every time:"],
        bullets: [
          "Define the mission loosely: region, cabin, rough window, and points budget — not one flight on one date.",
          "Open a calendar-style award view to spot which dates have space at all.",
          "Check the same flights through two or three programs that can book them; compare points plus fees.",
          "Consider positioning: a short cash hop to a bigger gateway often unlocks far better long-haul space.",
          "Book what's bookable — award space is not reserved by intention, and good space disappears in hours.",
        ],
      },
      {
        heading: "When nothing shows up",
        paragraphs: [
          "'No availability' usually means 'not this exact request.' Shift by a day or three, try the neighboring gateway, split the party across two flights, fly the outbound on points and the return on cash — or check again near departure, when airlines often release unsold premium seats (the pattern behind the last-minute Vienna redemption in Success Stories).",
          "And know when to stop: if the award costs more points than the trip is worth to you, paying cash is a win, not a defeat.",
        ],
      },
    ],
    keyTakeaways: [
      "Search broad-to-narrow with calendar views, not single dates.",
      "Compare the same seats across multiple booking programs before committing.",
      "Flexibility — dates, airports, routings — converts 'nothing' into booked trips.",
    ],
  },
  {
    slug: "keeping-points-alive",
    title: "Keeping Your Points Alive: Expiration Rules That Bite",
    description:
      "Some programs expire points after 12–24 quiet months. Learn the rules by program type and the near-free ways to reset the clock.",
    collection: "tips",
    category: "Program Rules",
    readingMinutes: 5,
    sections: [
      {
        heading: "The expiration landscape",
        paragraphs: [
          "Expiration policies fall into three rough camps. Bank transferable points generally live as long as the account stays open and in good standing. Many airline programs expire miles after a period of inactivity — commonly 18 or 24 months — though several large programs no longer expire miles at all. Hotel programs are frequently the strictest, with points dying after 12–24 quiet months.",
          "The operative word is inactivity. In most expiring programs, any qualifying earn or redemption resets the entire clock — which makes expiration one of the cheapest problems in the hobby to prevent and one of the most expensive to ignore.",
        ],
      },
      {
        heading: "Near-free ways to reset the clock",
        paragraphs: ["Keeping a balance alive rarely requires flying anywhere:"],
        bullets: [
          "Earn a handful of points through the program's shopping portal or dining program.",
          "Put one purchase on a co-branded card linked to the program.",
          "Transfer a small amount from a bank currency (mind minimums — and remember it's one-way).",
          "Redeem something tiny; small redemptions count as activity too.",
          "Credit an occasional paid flight or stay to the program you're preserving.",
        ],
      },
      {
        heading: "A system beats vigilance",
        paragraphs: [
          "Nobody remembers eight programs' inactivity clocks — and closing a credit card can quietly forfeit that card's points, a separate trap worth checking before any cancellation. Put every balance and its expiration risk in one tracker with reminders (CardMaster does this for free), and the whole problem reduces to acting on a notification a few times a year.",
        ],
      },
    ],
    keyTakeaways: [
      "Know each program's inactivity window — 12–24 months is common outside bank currencies.",
      "Almost any earning or redeeming activity resets the clock cheaply.",
      "Reminders in a tracker beat memory; check point forfeiture rules before closing cards.",
    ],
  },
  {
    slug: "credit-card-benefit-checklist",
    title: "The Credit Card Benefit Checklist",
    description:
      "Annual fees make sense only when the benefits get used. A simple system for capturing the credits you're already paying for.",
    collection: "tips",
    category: "Credit Card Benefits",
    readingMinutes: 5,
    sections: [
      {
        heading: "The benefits you're leaving on the table",
        paragraphs: [
          "Premium cards justify their fees through stacks of credits — airline fees, dining, rideshare, hotel, streaming — many of which quietly reset monthly, semiannually, or yearly. Issuers price these knowing a large share will never be used. Every unused credit is money you paid for and didn't collect.",
        ],
      },
      {
        heading: "Build the checklist once",
        paragraphs: [
          "For each card, list every recurring benefit with three facts: what it's worth, what triggers it, and when it resets. That last column is the whole game — a 'use by December 31' credit remembered in January is worth nothing.",
          "Then match benefits to spending you already do. A dining credit that shifts a restaurant meal to a different card costs nothing to capture; a credit that only pays off if you buy something you didn't want isn't a benefit, it's marketing. Count only the first kind when judging whether a card earns its fee.",
        ],
      },
      {
        heading: "Then let the system run",
        paragraphs: [
          "Reviewing the checklist takes five minutes a month — or none, if your tracker does it for you. CardMaster tracks each card's benefits and statement credits with their reset dates, so 'did we use the airline credit this year?' has an answer instead of a shrug. Come annual-fee time, that usage history is exactly the evidence the keep-or-cancel decision needs.",
        ],
      },
    ],
    keyTakeaways: [
      "List every credit with its value, trigger, and reset date — resets are where value dies.",
      "Only count benefits that map to spending you'd do anyway.",
      "Tracked usage makes annual-fee decisions obvious.",
    ],
  },
  {
    slug: "premium-cabins-for-less",
    title: "Luxury Travel on Points: Premium Cabins Without Premium Prices",
    description:
      "Business class seats selling for thousands are the classic high-value redemption. How realistic are they — and how do you actually land one?",
    collection: "tips",
    category: "Luxury Travel",
    readingMinutes: 6,
    sections: [
      {
        heading: "Why premium cabins are the sweet spot",
        paragraphs: [
          "The gap between cash price and award price is widest at the front of the plane. An economy seat selling for $900 might cost 40,000 miles — around two cents each. A business class seat on the same flight selling for $6,000 might cost 75,000 miles — closer to eight. Same currency, quadruple the value, and a lie-flat bed instead of a middle seat.",
          "That's the honest case for 'luxury on points': it isn't extravagance, it's arithmetic. Points are most rationally spent exactly where cash prices are most irrational.",
        ],
      },
      {
        heading: "What it takes in practice",
        paragraphs: [
          "Premium award space is the scarcest resource in the hobby. The travelers who fly up front on points share habits: they hold transferable currencies that reach many airlines, they plan around availability rather than fixed dates, they check both far-out and last-minute windows, and they treat one or two seats as the realistic prize (four together is rare).",
          "Set expectations accordingly: a couple with flexibility and a healthy transferable balance can reasonably target business class for a special trip. A family of five locked to school-holiday dates usually gets more joy from economy seats and great hotels — also a luxury, differently shaped.",
        ],
      },
      {
        heading: "Keep the value honest",
        paragraphs: [
          "When you land one of these seats, compute the cents-per-point as an estimate against the real cash fare — like the QSuites and Austrian examples in Success Stories (roughly 9¢ and 11¢ respectively). And remember the estimate's limits: you likely weren't going to pay that cash fare. The seat is still magnificent; the number is context, not income.",
        ],
      },
    ],
    keyTakeaways: [
      "Points buy the most value where cash prices are steepest — premium cabins.",
      "Flexibility plus transferable points is the realistic path to the front of the plane.",
      "Cents-per-point on premium awards is an estimate, not savings you'd otherwise spend.",
    ],
  },
  {
    slug: "business-travel-points",
    title: "Business Travelers: Turn Work Trips into Personal Vacations",
    description:
      "If work puts you on planes and in hotels, you're sitting on the easiest points pipeline there is — as long as you set it up deliberately.",
    collection: "tips",
    category: "Business Travel",
    readingMinutes: 5,
    sections: [
      {
        heading: "The double-dip that's usually allowed",
        paragraphs: [
          "In many workplaces, travelers keep the points and status their work trips earn — the company pays the fare, you keep the miles (confirm your employer's policy first). For frequent travelers this compounds fast: loyalty balances, elite status, and card spending all feeding the same accounts, gratis.",
        ],
      },
      {
        heading: "Set the pipeline up once",
        paragraphs: ["A deliberate setup beats habit-driven scattering:"],
        bullets: [
          "Add your loyalty numbers to every corporate booking profile so no stay or flight credits to nowhere.",
          "Concentrate: pick the airline and hotel programs that fit your actual routes, and credit everything there — status comes from focus.",
          "Learn where partner crediting helps: paid flights on one alliance airline can often credit to another program you value more.",
          "If you put reimbursable expenses on a personal rewards card, keep it disciplined and within employer rules — and never let reimbursement timing push you into carrying a balance.",
        ],
      },
      {
        heading: "Elite status: the quiet salary bump",
        paragraphs: [
          "Status earned on the company's dime follows you on personal trips: upgrades, lounge access, late checkout, bonus earning. Mid-tier status from work travel often does more for a family vacation than a pile of points would. Track both — balances and status progress — so year-end requalification pushes happen on purpose, not by accident.",
        ],
      },
    ],
    keyTakeaways: [
      "Confirm policy, then keep every point and status credit your work travel earns.",
      "Concentrate programs to convert scattered trips into status and usable balances.",
      "Status earned at work is a personal-travel benefit — manage it deliberately.",
    ],
  },
];
