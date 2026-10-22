/**
 * Offerings that live outside the CMS service catalogue.
 *
 * The five services in Sanity each have their own detail page; these do not,
 * and are short enough to read in full on the services page itself. Kept here
 * rather than inline in the page so the copy is editable in one place.
 *
 * No prices anywhere by design — what an engagement costs is discussed on the
 * free fit call, person to person.
 */

export interface ServiceExtra {
  id: string;
  name: string;
  /** Format and turnaround, shown under the name. */
  format?: string;
  paras?: string[];
  bullets?: string[];
  /** Emphasis line after the bullets. */
  closing?: string;
  /** Italic caveat. */
  note?: string;
  /** Booking button label. */
  cta: string;
  /** The no-cost entry point, rendered distinctly. */
  free?: boolean;
}

export const serviceExtras: ServiceExtra[] = [
  {
    id: "fit-call",
    name: "Free 15-Minute Fit Call",
    format: "15 minutes, video or phone",
    paras: [
      "A short call to find out whether I can actually help you. You tell me what you're trying to do; I tell you which service fits, or that you don't need one. No pitch beyond that.",
    ],
    note: "This is a scoping call, not a consultation — I won't be able to answer strategy questions in fifteen minutes, and I'd rather be upfront than leave you disappointed.",
    cta: "Book a Fit Call",
    free: true,
  },
  {
    id: "trip-blueprint",
    name: "Trip Blueprint",
    format: "One destination, up to 4 travelers, start to finish.",
    paras: [
      "Award flights, the hotel or resort, and the itinerary — planned as one thing instead of three. For the trip you've been saving points toward and don't want to get wrong.",
      "Includes everything in an Award Flight Search plus hotel award strategy, elite-benefit planning, and a day-by-day outline. Booking instructions for all of it; you do the booking.",
    ],
    cta: "Request a Blueprint",
  },
  {
    id: "annual-renewal",
    name: "Annual Card Renewal Review",
    format: "Delivered in 3 business days.",
    paras: [
      "A $695 annual fee posts in three weeks and you're not sure it's still worth it. Send me the card and how you've used it. You get a keep, downgrade, product-change, or cancel recommendation with the math, plus the retention-offer language worth trying first.",
      "The quickest way to find out whether you're about to waste real money.",
    ],
    cta: "Order a Renewal Review",
  },
  {
    id: "small-business",
    name: "Small Business Card Strategy",
    format: "75 minutes, live, plus a written plan.",
    paras: [
      "For the self-employed, side-business owners, and anyone with 1099 income. Business cards sit outside most personal application rules, and most people leave that entirely on the table.",
    ],
    bullets: [
      "Which business cards you qualify for and in what order",
      "Keeping business and personal earning separate and working together",
      "Category strategy against how you actually spend",
      "What counts as a business (more than you'd think) and what doesn't",
    ],
    cta: "Book a Business Session",
  },
  {
    id: "gift-certificates",
    name: "Gift Certificates",
    format: "Good for a year.",
    paras: ["Any service on this page. Good for a year."],
    cta: "Buy a Gift Certificate",
  },
];

/** Award Flight Search: the process, which is the same whatever a trip costs. */
export const awardSearch = {
  heading: "Award Flight Search",
  strapline: "You get the seats. You do the booking.",
  intro:
    "I find the award space, tell you exactly which program to book through, exactly what to transfer and when, and hand you step-by-step instructions. You log into your own accounts and click the last button.",
  steps: [
    "A research fee upfront, agreed before I start. That buys the search itself, and I keep it whether or not the seats exist.",
    "I search, and I watch — space opens and closes constantly.",
    "When I find it, you get written instructions and a heads-up on the clock.",
    "You book. The booking fee is due then.",
  ],
  /** What the booking fee depends on. The figures come on the call. */
  tiersIntro: "What the booking fee comes to depends on where you're going:",
  tiers: [
    "Domestic, Mexico and the Caribbean",
    "International — economy or premium economy",
    "International — business or first",
  ],
  caption:
    "Departing within 10 days? There's a rush fee. Multi-city, stopovers and round-the-world are quoted individually. Every figure is agreed with you before any work starts.",
};

/** The differentiator: one fee per reservation, however many people are on it. */
export const noPerTravelerFee = {
  heading: "No per-traveler fees.",
  body: [
    "Everyone on the same reservation — booked from one points account — is included. Finding two seats on one record is the same work as finding one, so you pay once. Most services in this space charge per person.",
    "Being straight with you: award space for more than two travelers is genuinely hard to find. Two is the sweet spot. I'll always try for more, and I won't charge extra if I get them — but if the space has to be split across separate reservations, each one is its own booking fee, and I'll tell you before I start.",
  ],
};

export const independenceParagraphs = [
  "Most points-and-miles websites are paid by banks. When they recommend a card and you're approved, they earn a commission — often several hundred dollars per application. It's legal, it's disclosed in the fine print, and it's how nearly every large site in this space stays in business. Go read the disclosure on any of them.",
  "Travel Technician has no affiliate relationships. Not with a single card issuer, airline, hotel chain, or booking site. No one pays me to point you toward a card.",
  "So when I tell you to cancel a card, skip a bonus, or that the card you're excited about is wrong for you — that advice costs me nothing to give. It's the only advice I have to sell.",
  "That's why this work is paid rather than free.",
];

/**
 * FAQs specific to engagements, shown after the CMS general FAQs.
 *
 * Deliberately excludes "what does it cost" and "can you guarantee a
 * redemption": the CMS general set already answers both, and Jim can edit
 * those in Sanity. Two near-identical questions in one accordion read as
 * carelessness.
 */
export const engagementFaqs = [
  {
    question: "Do you need my account logins?",
    answer:
      "No — and I don't want them. I will never ask for a password, and you should never give one to anyone offering this kind of service. I work from balances and card names you tell me. Everything I hand you, you execute yourself.",
  },
  {
    question: "Do you book the ticket for me?",
    answer:
      "No. I find the space and write out exactly how to get it — which program, which transfer, which dates, what to click. You do the booking in your own account. It stays your reservation, your points, your control.",
  },
  {
    question: "Is there a fee before you start searching?",
    answer:
      "Yes, for award searches. Award searching is the work, and it takes hours whether or not seats turn up. A research fee covers the search itself and is agreed with you before I start. If I find nothing that matches what we agreed on, you owe nothing further and we're square.",
  },
  {
    question: "What if you find the seats but I change my mind?",
    answer:
      "The booking fee is due once I deliver instructions for space matching what we agreed on. That's the finding, not the flying.",
  },
  {
    question: "Do you charge extra for additional travelers?",
    answer:
      "No. As long as everyone is on the same reservation, booked from one points account, it's one fee — finding two seats on one record is the same work as finding one. Most services in this space charge per person; I don't. Being straight with you: award space for more than two travelers is genuinely hard to find. Two is the sweet spot. I'll always try for more, and I won't charge extra if I get them — but if the space has to be split across separate reservations, each one is its own booking fee, and I'll tell you before I start.",
  },
  {
    question: "Are you paid by credit card companies?",
    answer:
      "No. No affiliate links, no referral commissions, no bank, airline, or hotel relationships of any kind. My income from this comes from the people I work for — you.",
  },
  {
    question: "How fast do you work?",
    answer:
      "Portfolio Audits and Award Searches: 5 business days. Renewal Reviews: 3. Live sessions usually book within a week. Traveling inside 10 days? There's a rush fee and I'll move you up.",
  },
  {
    question: "I'm just starting out and have almost no points. Worth it?",
    answer:
      "Maybe nothing yet, honestly. That's what the free call is for — I'll tell you if you're better off reading the free guides for six months first.",
  },
  {
    question: "Refunds?",
    answer:
      "The research fee is non-refundable — it pays for work that's already happened. Live sessions can be rescheduled with 24 hours' notice and refunded in full if you cancel before we meet.",
  },
  {
    question: "Do you sell my information?",
    answer: "No. Not to anyone, ever. No lists, no lead-gen, no partners.",
  },
];

export const servicesDisclaimer =
  "Travel Technician provides educational and advisory services only. I am not a financial advisor, and nothing here is financial, tax, or legal advice — credit card decisions affect your credit and your finances, and they're yours to make. I am not a licensed travel agent and I do not book, sell, or hold travel on your behalf; all bookings are made by you, in your own accounts. I receive no compensation from any credit card issuer, bank, airline, hotel, or booking platform. Award availability is controlled by airlines and cannot be guaranteed by anyone. Point transfers between programs are generally one-way and irreversible.";
