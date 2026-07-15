import type { Article } from "@/lib/cms/types";

/**
 * Points & Miles 101 — the beginner curriculum, in intended reading order.
 * Editable and extendable in Sanity (article documents, collection "points-101").
 */
export const fallbackArticles101: Article[] = [
  {
    slug: "what-are-points-and-miles",
    title: "What Are Points and Miles?",
    description:
      "The five-minute foundation: what loyalty currencies are, where they come from, and why people build strategies around them.",
    collection: "points-101",
    category: "Foundations",
    readingMinutes: 5,
    sections: [
      {
        heading: "Loyalty currencies, in plain language",
        paragraphs: [
          "Points and miles are reward currencies issued by airlines, hotel chains, and banks. You earn them by flying, staying, and — most powerfully — by spending on rewards credit cards. You spend them on travel: flights, hotel nights, and sometimes upgrades or other perks.",
          "The word \"miles\" is historical. Airline programs originally rewarded distance flown, so the currency was called miles. Today most programs reward dollars spent, but the name stuck. Functionally, airline miles and hotel or bank points work the same way: they are balances in an account that can be exchanged for travel.",
        ],
      },
      {
        heading: "The three families of currency",
        paragraphs: [
          "Almost everything in this hobby involves one of three currency types, and knowing which one you're holding is the first skill to build.",
        ],
        bullets: [
          "Airline miles — issued by a specific airline's program and mostly redeemable for flights on that airline and its partners.",
          "Hotel points — issued by a hotel chain's program and mostly redeemable for nights at that chain's properties.",
          "Transferable points — issued by banks through their rewards programs, movable to many different airline and hotel partners. These are the most flexible and the center of most modern strategies.",
        ],
      },
      {
        heading: "Why people bother",
        paragraphs: [
          "Used casually, points shave a little off a trip. Used deliberately, they change what kind of travel is possible: business class seats that sell for thousands of dollars, hotel stays that would blow a vacation budget, or simply a family's worth of flights each year without the airfare bill.",
          "The catch is that value is uneven. The same 50,000 points might be worth $400 in one redemption and $2,000 in another. That gap — between careless and deliberate redemption — is the entire reason a points strategy is worth having, and it's what the rest of this hub teaches.",
        ],
      },
    ],
    keyTakeaways: [
      "Points and miles are reward currencies earned from travel and credit card spending.",
      "Airline miles, hotel points, and transferable bank points behave differently — know which you hold.",
      "The value of a point varies wildly by how you redeem it; strategy is about capturing the high end.",
    ],
  },
  {
    slug: "airline-miles-vs-hotel-points",
    title: "Airline Miles vs. Hotel Points",
    description:
      "The two big loyalty families reward different behavior and redeem differently. Here's how to think about each.",
    collection: "points-101",
    category: "Foundations",
    readingMinutes: 6,
    sections: [
      {
        heading: "Airline miles: high ceilings, more homework",
        paragraphs: [
          "Airline miles shine on expensive flights — especially international premium cabins, where a seat selling for $5,000 in cash might cost 70,000–90,000 miles. That's where the eye-popping value in this hobby lives.",
          "The trade-off is complexity. Airlines limit how many seats can be booked with miles (award availability), partner airlines each have their own pricing, and some programs add hefty cash surcharges. Airline miles reward people willing to learn the system and stay flexible on dates.",
        ],
      },
      {
        heading: "Hotel points: steadier, simpler value",
        paragraphs: [
          "Hotel points are the dependable sibling. Most chains let you book a standard room with points whenever one is for sale, so you rarely face the availability wall that frustrates flight redemptions.",
          "Value per point is usually lower and steadier than the best airline redemptions, but hotel points come with practical perks: award nights often avoid resort-fee-style add-ons in some programs, and several chains offer a free night when you book four or five on points. For families, hotel points frequently deliver the most stress-free savings.",
        ],
      },
      {
        heading: "Which should a beginner collect?",
        paragraphs: [
          "For most people the honest answer is: neither, at first. Transferable bank points can become either airline miles or hotel points later, which means you don't have to predict your travel two years in advance. Collect flexibility first, then convert when a real trip takes shape.",
          "The exception is loyalty you already have. If your work or home airport ties you to one airline, or you genuinely stay loyal to one hotel chain, that program's currency (and possibly its co-branded card) can earn its place alongside a transferable core.",
        ],
      },
    ],
    keyTakeaways: [
      "Airline miles offer the highest potential value but demand flexibility and homework.",
      "Hotel points are easier to use and great for families, with steadier but lower value.",
      "Beginners usually do best collecting transferable points and converting later.",
    ],
  },
  {
    slug: "transferable-points-explained",
    title: "Transferable Points, Explained",
    description:
      "Bank-issued flexible currencies are the center of a modern strategy. Here's how transfers work and why flexibility wins.",
    collection: "points-101",
    category: "Foundations",
    readingMinutes: 6,
    sections: [
      {
        heading: "One balance, many destinations",
        paragraphs: [
          "The major card issuers each run a rewards currency that can be transferred to a roster of airline and hotel partners — typically a dozen or more programs each. Earn one balance; decide later whether it becomes airline miles for a flight deal or hotel points for a beach week.",
          "This matters because the best redemption is unpredictable. Award space appears and disappears; programs run promotions; your plans change. Holding transferable points means you commit at the last responsible moment, when you can see the actual deal in front of you.",
        ],
      },
      {
        heading: "How a transfer actually works",
        paragraphs: [
          "You link your loyalty account inside the bank's rewards portal, choose an amount, and confirm. Many transfers land in minutes; some take a day or two. Most transfer at a 1:1 ratio, though some partners differ, and banks periodically run transfer bonuses that stretch your points further.",
          "Two rules keep beginners out of trouble. First, transfers are one-way — once points become airline miles, they never come back. Second, never transfer speculatively: find the award seat or room first, confirm it's bookable, then move exactly the points you need.",
        ],
      },
      {
        heading: "The strategy that falls out of this",
        paragraphs: [
          "Once you understand transfers, the standard advice writes itself: earn everyday spending into a transferable currency, learn the handful of partners that serve your home airport and dream destinations, and keep balances flexible until a real trip appears. It's the setup that keeps every option open while you learn.",
        ],
      },
    ],
    keyTakeaways: [
      "Transferable points can become many different airline or hotel currencies — flexibility is their superpower.",
      "Transfers are one-way and usually instant; never transfer before you've found the award you want.",
      "Earning into a transferable currency is the default modern strategy for beginners.",
    ],
  },
  {
    slug: "how-points-are-earned",
    title: "How Points Are Earned",
    description:
      "Flying and staying earn points — but everyday spending, done thoughtfully and responsibly, is where balances really grow.",
    collection: "points-101",
    category: "Earning",
    readingMinutes: 7,
    sections: [
      {
        heading: "The four earning engines",
        paragraphs: [
          "Nearly every point in your future balance will arrive through one of four channels.",
        ],
        bullets: [
          "Travel itself — flights and hotel stays credit points to the matching program, more if you hold elite status.",
          "Credit card everyday spending — cards earn points per dollar, often with bonus categories like dining, groceries, or travel.",
          "Credit card welcome offers — banks offer large point bonuses for new cards after meeting a minimum spend. This is the fastest legitimate accelerator in the hobby, and also the place where responsibility matters most.",
          "Everything else — shopping portals, dining programs, and promotions add a steady trickle on top.",
        ],
      },
      {
        heading: "A word about credit, before anything else",
        paragraphs: [
          "Points are only free when credit is free. Rewards cards carry high interest rates, and carrying a balance to earn points is always a losing trade — interest will outrun the value of any points earned. If you don't pay cards in full every month, fix that first; the points will still be here when you're ready.",
          "Opening cards also isn't right for everyone or every moment. Applications affect credit profiles, and issuers decide approvals. A mortgage on the horizon, for example, is a common reason to pause. None of this is financial advice — it's the honest context every beginner deserves before the fun parts.",
        ],
      },
      {
        heading: "Matching earning to your life",
        paragraphs: [
          "Good earning strategies are boring on purpose: figure out where your money already goes, then make sure that spending earns the most useful currency at the best rate. A family that spends heavily on groceries needs a different setup than a consultant who lives in airports.",
          "This is also where tracking pays off. Once you hold more than a card or two, remembering which card earns what — and which benefits you've already used — becomes a real chore. That's exactly the problem CardMaster, Travel Technician's free tracker, was built to solve.",
        ],
      },
    ],
    keyTakeaways: [
      "Most points come from credit card spending and welcome offers, not from flying.",
      "Never carry an interest-bearing balance to earn rewards — interest always wins.",
      "Match cards to where your money already goes, and track what each card earns.",
    ],
  },
  {
    slug: "how-points-are-redeemed",
    title: "How Points Are Redeemed",
    description:
      "Redemption is where strategies succeed or fail. Learn what award availability means and how a real booking comes together.",
    collection: "points-101",
    category: "Redeeming",
    readingMinutes: 7,
    sections: [
      {
        heading: "Award availability: the concept that explains everything",
        paragraphs: [
          "The single most important idea in redemption is this: having enough points does not mean you can book the seat. Airlines decide how many seats on each flight can be booked with miles — that allotment is called award availability or award space, and on popular routes in premium cabins it can be scarce.",
          "Hotels are gentler: most chains let you book a standard room with points whenever it's for sale. This difference is why flight redemptions reward planning and flexibility while hotel redemptions mostly just work.",
        ],
      },
      {
        heading: "What a real award booking looks like",
        paragraphs: [
          "A typical high-value flight redemption runs in this order: pick a route and rough dates; find award space using airline sites or search tools; check which programs can book that space and what each charges in points, taxes, and fees; transfer exactly the points needed; book. Notice that finding space comes before transferring points — always.",
          "The same seat can cost meaningfully different amounts through different programs, because partner programs price awards with their own charts and fees. Checking two or three booking options is often worth hundreds of dollars.",
        ],
      },
      {
        heading: "Habits that make redemptions succeed",
        paragraphs: [
          "Flexibility is the master skill: shifting travel by a few days, considering a nearby airport, or flying a different partner routinely turns 'nothing available' into a booked trip. Booking either very early (when schedules open) or fairly late (when airlines release unsold premium seats) beats the crowded middle.",
          "And keep expectations honest: some trips are simply better paid in cash. A good strategy uses points where they're strong and money where points are weak — that judgment is covered in “When to Use Points and When to Pay Cash.”",
        ],
      },
    ],
    keyTakeaways: [
      "Award availability — not your balance — determines what you can book with miles.",
      "Find the award first, compare programs, and only then transfer points.",
      "Date and route flexibility is the most powerful redemption skill you can build.",
    ],
  },
  {
    slug: "why-point-values-vary",
    title: "Why Point Values Vary (and How Taxes and Fees Fit In)",
    description:
      "The same points can be worth half a cent or ten cents each. Understand valuation, taxes, fees, and what 'a good deal' really means.",
    collection: "points-101",
    category: "Redeeming",
    readingMinutes: 6,
    sections: [
      {
        heading: "Cents per point: the measuring stick",
        paragraphs: [
          "To compare redemptions, divide the cash price you'd realistically pay (minus the taxes and fees the award still charges) by the number of points used. That's cents per point. Redeem 70,000 miles for a flight selling at $7,900 with $58 in fees, and you received an estimated 11 cents per mile — exceptional. Redeem the same miles for a $400 economy fare and you got about half a cent.",
          "Treat every such number as an estimate. Cash prices fluctuate daily, and nobody was necessarily going to pay that premium fare in cash. The point of the metric is comparison — separating strong uses of your points from weak ones — not accounting.",
        ],
      },
      {
        heading: "Taxes, fees, and surcharges",
        paragraphs: [
          "Awards are rarely 100% free. Government taxes and airport charges always apply, and some airlines add carrier-imposed surcharges that can run into hundreds of dollars. The same seat can cost $60 in fees through one program and $600 through another, so the program you book through matters as much as the airline you fly.",
          "Before any transfer, price the full award — points plus cash — and compare it against alternatives. A slightly higher points price with far lower fees is often the better deal.",
        ],
      },
      {
        heading: "Why values drift over time",
        paragraphs: [
          "Programs periodically raise award prices or shift to demand-based dynamic pricing — devaluations, in hobby shorthand. The practical consequence: points are not a savings account. Earn with a purpose, redeem within a reasonable horizon, and don't hoard for a someday that programs can reprice out from under you.",
        ],
      },
    ],
    keyTakeaways: [
      "Cents per point = (cash price − award taxes and fees) ÷ points used — always an estimate.",
      "Fees vary enormously by booking program; price the whole award before transferring.",
      "Devaluations punish hoarding — earn deliberately and redeem within a reasonable horizon.",
    ],
  },
  {
    slug: "common-beginner-mistakes",
    title: "Common Beginner Mistakes (and How to Avoid Them)",
    description:
      "Expired points, speculative transfers, unused credits — the predictable mistakes of year one, and simple habits that prevent them.",
    collection: "points-101",
    category: "Foundations",
    readingMinutes: 6,
    sections: [
      {
        heading: "Mistakes of money",
        paragraphs: [
          "The costliest mistakes are financial. Carrying a balance to earn points loses money every single time — rewards run one to a few percent while card interest runs twenty or more. Chasing a welcome offer with spending you wouldn't otherwise do is quieter but similar: buying $1,000 of stuff you didn't need to earn $200 of points is not a win.",
          "The prevention is a rule, not a technique: rewards cards only ever charge what you'd buy anyway, and they're paid in full monthly. If that rule doesn't fit your current situation, points can wait — that's the responsible answer, and anyone who tells you otherwise is selling something.",
        ],
      },
      {
        heading: "Mistakes of organization",
        paragraphs: [
          "Points expire in some programs after periods of inactivity; annual fees renew silently; statement credits reset unused at year-end. None of these are hard to manage — they're just easy to forget, and forgetting has a price. Expired miles are gone; a $95 fee for a card you stopped using is a pure loss.",
          "The fix is a system instead of memory: a tracker that lists every balance, card, fee date, and expiration in one place. That's precisely what CardMaster does for free, including reminders before points expire and a view of which credits you've actually used.",
        ],
      },
      {
        heading: "Mistakes of redemption",
        paragraphs: [
          "The classic redemption errors: transferring points before finding award space (transfers don't reverse), burning high-value transferable points on low-value redemptions a cash payment would've beaten, and refusing all flexibility, then concluding awards 'never' exist. Each is avoidable with the habits from the redemption chapters: search first, compare programs, stay flexible.",
        ],
      },
    ],
    keyTakeaways: [
      "Never carry a balance or manufacture spending for points — the math never works.",
      "Replace memory with a tracking system; expirations and fees punish forgetfulness.",
      "Search before transferring, and compare booking programs before committing points.",
    ],
  },
  {
    slug: "points-or-cash",
    title: "When to Use Points and When to Pay Cash",
    description:
      "Points aren't always the answer. A simple framework for choosing the smarter currency for any trip.",
    collection: "points-101",
    category: "Redeeming",
    readingMinutes: 5,
    sections: [
      {
        heading: "The comparison habit",
        paragraphs: [
          "Every redemption is a purchase with an alternative: the cash price. Before spending points, look up what the same flight or room costs in money, subtract the award's taxes and fees, and compute the cents per point. Then ask one question: is this above or below what a deliberate redemption of this currency usually gets?",
          "As rough guides, transferable points redeemed thoughtfully tend to clear one to two cents each, with premium-cabin sweet spots far higher; hotel points vary by chain. When a redemption falls meaningfully below the value you know you can get elsewhere, cash is usually the smarter spend.",
        ],
      },
      {
        heading: "When cash tends to win",
        paragraphs: ["Some situations are consistently better paid in money:"],
        bullets: [
          "Cheap economy fares and sale prices — awards rarely beat a bargain cash fare.",
          "Refundable-fare needs — cash bookings often carry friendlier change rules than transfers you can't undo.",
          "Earning opportunities — paid stays and flights earn points and elite credit; awards usually don't.",
          "When your balances are small — spending your only points poorly leaves you with neither points nor flexibility.",
        ],
      },
      {
        heading: "When points tend to win",
        paragraphs: [
          "Points shine when cash prices are painful: last-minute travel, peak-season family flights, one-way international tickets, and premium cabins you'd never buy outright. They also win when a devaluation-prone balance is sitting idle — using points well beats watching them lose value.",
          "The underlying principle: points are for beating expensive prices, cash is for taking cheap ones. Hold both, and let the trip decide.",
        ],
      },
    ],
    keyTakeaways: [
      "Always compare the award against the real cash price before redeeming.",
      "Cash wins on cheap fares; points win where cash prices are painful.",
      "Points are a spending currency, not a savings account — use them well, don't hoard.",
    ],
  },
];
