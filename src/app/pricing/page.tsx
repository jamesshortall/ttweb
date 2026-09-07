import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/marketing/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { CalendlyButton } from "@/components/scheduling/CalendlyButton";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { JsonLd } from "@/components/seo/JsonLd";
import { webPageJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Pricing — Independent Points and Miles Consulting",
  description:
    "Clear, upfront pricing for one-on-one points and miles help from Travel Technician: consultations, card strategy, portfolio audits, and award flight search. Independent and unbiased — no affiliate links, no referral commissions, no bank, airline, or hotel relationships.",
  alternates: { canonical: "/pricing" },
};

/* ───────────────────────────────────────────────────────────────────────────
 * PRICES — single source of truth.
 *
 * Every price that renders on this page comes from the structures below. To
 * change what a service costs, edit it here once (e.g. raise the Starter
 * Session to "$129") and it updates everywhere it displays.
 *
 * Note: the FAQ and the footer disclaimer restate the $50 research fee in
 * prose (they are approved copy, kept verbatim), so if that fee ever changes,
 * update those two sentences too.
 * ────────────────────────────────────────────────────────────────────────── */

const RESEARCH_FEE = "$50";
const RUSH_FEE = "$75";

interface ServiceCard {
  id: string;
  name: string;
  /** Large headline price. Omitted for gift certificates. */
  price?: string;
  /** Bold format / turnaround line under the price. */
  format?: string;
  /** Descriptive paragraph(s). */
  paras?: string[];
  bullets?: string[];
  /** Emphasis line after the bullets. */
  closing?: string;
  /** Italic caveat. */
  note?: string;
  /** Booking button label. */
  cta: string;
  /** The distinct, no-cost entry point (rendered outlined). */
  free?: boolean;
}

const serviceCards: ServiceCard[] = [
  {
    id: "fit-call",
    name: "Free 15-Minute Fit Call",
    price: "Free",
    format: "15 minutes, video or phone",
    paras: [
      "A short call to find out whether I can actually help you. You tell me what you're trying to do; I tell you which service fits, or that you don't need one. No pitch beyond that.",
    ],
    note: "This is a scoping call, not a consultation — I won't be able to answer strategy questions in fifteen minutes, and I'd rather be upfront than leave you disappointed.",
    cta: "Book a Fit Call",
    free: true,
  },
  {
    id: "starter",
    name: "Points & Miles Starter Session",
    price: "$99",
    format: "45 minutes, live.",
    paras: [
      "For people sitting on points they don't know how to use, or standing at the very start wondering if any of this is real.",
    ],
    bullets: [
      "How points actually convert into flights and hotel nights",
      "What your current balances are genuinely worth",
      "The two or three moves that matter most for your situation",
      "What to ignore — most of it",
    ],
    closing: "You leave knowing what to do next, in order.",
    cta: "Book a Starter Session",
  },
  {
    id: "card-strategy",
    name: "Card Strategy Session",
    price: "$179",
    format: "60 minutes, live, plus a written plan within 3 business days.",
    paras: [
      "A full look at the cards you carry and the cards you should. Built around where you want to go, not around what pays a commission.",
    ],
    bullets: [
      "Review of every card in your household and what each is actually earning you",
      "Which annual fees are worth paying and which aren't",
      "Application order and timing, including 5/24 and issuer-specific rules",
      "Which points currencies to concentrate in for your goals",
      "A written plan you keep",
    ],
    cta: "Book a Card Strategy Session",
  },
  {
    id: "portfolio-audit",
    name: "Points Portfolio Audit",
    price: "$249",
    format: "No meeting required. Delivered in 5 business days.",
    paras: ["You send me your balances and card list. I send back a document."],
    bullets: [
      "Every account, every balance, and what each one is really worth",
      "Expiration dates and what it takes to keep each account alive",
      "Keep / downgrade / cancel call on every annual fee, with the reasoning",
      "The transfer paths available to you and which ones I'd use",
      "What's stranded, what's about to expire, and what to do first",
    ],
    closing: "The best value on this page if you're points-rich and time-poor.",
    cta: "Order an Audit",
  },
  {
    id: "trip-blueprint",
    name: "Trip Blueprint",
    price: "$399",
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
    price: "$79",
    format: "Delivered in 3 business days.",
    paras: [
      "A $695 annual fee posts in three weeks and you're not sure it's still worth it. Send me the card and how you've used it. You get a keep, downgrade, product-change, or cancel recommendation with the math, plus the retention-offer language worth trying first.",
      "Cheapest way to find out whether you're about to waste real money.",
    ],
    cta: "Order a Renewal Review",
  },
  {
    id: "small-business",
    name: "Small Business Card Strategy",
    price: "$299",
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

interface AwardTier {
  where: string;
  first: string;
  additional: string;
}

const awardTiers: AwardTier[] = [
  { where: "Domestic, Mexico, Caribbean", first: "$95", additional: "$75" },
  { where: "International — economy / premium economy", first: "$150", additional: "$125" },
  { where: "International — business or first", first: "$250", additional: "$200" },
];

const awardSteps = [
  `${RESEARCH_FEE} research fee upfront. That buys the search itself, and I keep it whether or not the seats exist.`,
  "I search, and I watch — space opens and closes constantly.",
  "When I find it, you get written instructions and a heads-up on the clock.",
  "You book. The per-traveler fee is due then.",
];

const awardCaption = `Departing within 10 days: add ${RUSH_FEE}. Multi-city, stopovers, and round-the-world quoted individually.`;

const faqs = [
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
    question: "What is the $50 research fee for?",
    answer:
      "Award searching is the work, and it takes hours whether or not seats turn up. The $50 pays for the search. If I find nothing that matches what we agreed on, you owe nothing further and we're square.",
  },
  {
    question: "What if you find the seats but I change my mind?",
    answer:
      "The per-traveler fee is due once I deliver instructions for space matching what we agreed on. That's the finding, not the flying.",
  },
  {
    question: "Can you guarantee a specific flight?",
    answer:
      "No, and be careful with anyone who says they can. Airlines control award space and it can appear or vanish in minutes. What I can tell you honestly is whether your trip is realistic and what your best alternative looks like — before you pay me anything past the research fee.",
  },
  {
    question: "Are you paid by credit card companies?",
    answer:
      "No. No affiliate links, no referral commissions, no bank, airline, or hotel relationships of any kind. My income from this comes from the prices on this page.",
  },
  {
    question: "How fast do you work?",
    answer:
      "Portfolio Audits and Award Searches: 5 business days. Renewal Reviews: 3. Live sessions usually book within a week. Traveling inside 10 days? Add the rush fee and I'll move you up.",
  },
  {
    question: "I'm just starting out and have almost no points. Worth it?",
    answer:
      "Probably the Starter Session, and honestly maybe nothing yet. That's what the free call is for — I'll tell you if you're better off reading the free guides for six months first.",
  },
  {
    question: "Refunds?",
    answer:
      "The $50 research fee is non-refundable — it pays for work that's already happened. Live sessions can be rescheduled with 24 hours' notice and refunded in full if you cancel before we meet.",
  },
  {
    question: "Do you sell my information?",
    answer: "No. Not to anyone, ever. No lists, no lead-gen, no partners.",
  },
];

const independenceParagraphs = [
  "Most points-and-miles websites are paid by banks. When they recommend a card and you're approved, they earn a commission — often several hundred dollars per application. It's legal, it's disclosed in the fine print, and it's how nearly every large site in this space stays in business. Go read the disclosure on any of them.",
  "Travel Technician has no affiliate relationships. Not with a single card issuer, airline, hotel chain, or booking site. No one pays me to point you toward a card.",
  "So when I tell you to cancel a card, skip a bonus, or that the card you're excited about is wrong for you — that advice costs me nothing to give. It's the only advice I have to sell.",
  "That's why there's a price on this page.",
];

const footerDisclaimer =
  "Travel Technician provides educational and advisory services only. I am not a financial advisor, and nothing here is financial, tax, or legal advice — credit card decisions affect your credit and your finances, and they're yours to make. I am not a licensed travel agent and I do not book, sell, or hold travel on your behalf; all bookings are made by you, in your own accounts. I receive no compensation from any credit card issuer, bank, airline, hotel, or booking platform. Award availability is controlled by airlines and cannot be guaranteed by anyone. Point transfers between programs are generally one-way and irreversible.";

function ServiceCardView({ card }: { card: ServiceCard }) {
  return (
    <article
      className={
        card.free
          ? "flex h-full flex-col rounded-3xl border-2 border-lagoon-800 bg-lagoon-50/50 p-7 shadow-sm"
          : "flex h-full flex-col rounded-3xl border border-lagoon-100 bg-white p-7 shadow-sm transition-shadow hover:shadow-lg"
      }
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-xl font-bold text-lagoon-950">{card.name}</h3>
        {card.free ? (
          <span className="shrink-0 rounded-full bg-lagoon-800 px-3 py-0.5 text-xs font-semibold uppercase tracking-wide text-white">
            No cost
          </span>
        ) : null}
      </div>

      {card.price ? (
        <p className="mt-4 font-display text-4xl font-bold text-navy-900">{card.price}</p>
      ) : null}
      {card.format ? (
        <p className="mt-1 text-sm font-semibold text-lagoon-800">{card.format}</p>
      ) : null}

      {card.paras?.map((para) => (
        <p key={para} className="mt-4 text-sm leading-relaxed text-ink/75">
          {para}
        </p>
      ))}

      {card.bullets ? (
        <ul className="mt-4 space-y-2 text-sm text-ink/80">
          {card.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-2.5">
              <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sunset-600" />
              <span className="leading-relaxed">{bullet}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {card.closing ? (
        <p className="mt-4 text-sm font-semibold text-lagoon-900">{card.closing}</p>
      ) : null}
      {card.note ? (
        <p className="mt-4 text-sm italic leading-relaxed text-ink/60">{card.note}</p>
      ) : null}

      <div className="mt-6 flex-grow" />
      <CalendlyButton label={card.cta} className="w-full" />
    </article>
  );
}

export default function PricingPage() {
  const awardHeadline = `from ${RESEARCH_FEE} + ${awardTiers[0]!.first}`;

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: metadata.title as string,
          description: metadata.description as string,
          path: "/pricing",
        })}
      />

      <PageHero
        eyebrow="Pricing"
        title="Straight Answers About Points and Miles. No Bank Is Paying Me to Give Them."
        description="One-on-one help from someone who has flown the routes, run the numbers, and takes nothing from credit card companies. Start with a free 15-minute call — I'll tell you honestly whether I can help."
        crumbs={[{ name: "Pricing", path: "/pricing" }]}
      >
        <div className="flex flex-wrap items-center gap-4">
          <CalendlyButton label="Book a Free 15-Minute Call" />
          <ButtonLink href="#services" variant="inverse" size="lg">
            See Pricing <span aria-hidden="true">↓</span>
          </ButtonLink>
        </div>
      </PageHero>

      {/* The independence section — the reason someone pays instead of reading a free blog. */}
      <section aria-labelledby="why-i-charge" className="relative isolate overflow-hidden bg-navy-950">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(55%_60%_at_15%_0%,rgba(199,150,58,0.16),transparent_60%)]"
        />
        <Container className="py-20 sm:py-28">
          <div className="max-w-3xl">
            <p className="eyebrow mb-4 flex items-center gap-3 text-gold-300">
              <span className="rule-gold" aria-hidden="true" />
              Why I charge
            </p>
            <h2
              id="why-i-charge"
              className="text-balance text-3xl font-semibold leading-[1.1] tracking-tight text-white sm:text-4xl md:text-5xl"
            >
              Why I Charge — and Why That&apos;s Good for You
            </h2>
            <div className="mt-8 space-y-6">
              {independenceParagraphs.map((para) => (
                <p key={para} className="text-lg leading-relaxed text-navy-100/90 sm:text-xl">
                  {para}
                </p>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Service cards */}
      <section id="services" aria-labelledby="services-heading" className="scroll-mt-24 py-16 sm:py-24">
        <Container>
          <SectionHeading
            as="h2"
            title="What you can book"
            description="Every engagement is education-first, priced up front, and yours to execute in your own accounts. Start with the free Fit Call if you're not sure which one fits."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {serviceCards.map((card) => (
              <ServiceCardView key={card.id} card={card} />
            ))}
          </div>
        </Container>
      </section>

      {/* Award Flight Search — its own full-width section */}
      <section
        id="award-flight-search"
        aria-labelledby="award-heading"
        className="scroll-mt-24 border-y border-lagoon-100 bg-porcelain-50 py-16 sm:py-24"
      >
        <Container>
          <div className="max-w-3xl">
            <p className="font-display text-3xl font-bold text-navy-900">{awardHeadline}</p>
            <h2 id="award-heading" className="mt-2 font-display text-3xl font-bold text-lagoon-950 sm:text-4xl">
              Award Flight Search
            </h2>
            <p className="mt-3 text-lg font-semibold text-lagoon-800">
              You get the seats. You do the booking.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-ink/75">
              I find the award space, tell you exactly which program to book through, exactly what to
              transfer and when, and hand you step-by-step instructions. You log into your own
              accounts and click the last button.
            </p>
          </div>

          <h3 className="mt-12 font-display text-lg font-bold text-lagoon-950">How it works</h3>
          <ol className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {awardSteps.map((step, index) => (
              <li key={step} className="flex flex-col gap-3 rounded-2xl border border-lagoon-100 bg-white p-6">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-lagoon-800 font-display text-base font-bold text-white">
                  {index + 1}
                </span>
                <span className="text-sm leading-relaxed text-ink/80">{step}</span>
              </li>
            ))}
          </ol>

          <p className="mt-10 font-semibold text-lagoon-900">Per traveler, on top of the research fee:</p>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-lagoon-100">
            <table className="w-full min-w-[36rem] border-collapse text-left">
              <thead>
                <tr className="bg-lagoon-50 text-sm text-lagoon-950">
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Where you&apos;re going
                  </th>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    First traveler
                  </th>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Each additional
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-lagoon-100">
                {awardTiers.map((tier) => (
                  <tr key={tier.where} className="bg-white">
                    <th scope="row" className="px-5 py-4 font-medium text-ink/85">
                      {tier.where}
                    </th>
                    <td className="px-5 py-4 font-display text-lg font-bold text-navy-900">
                      {tier.first}
                    </td>
                    <td className="px-5 py-4 font-display text-lg font-bold text-navy-900">
                      {tier.additional}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm italic text-ink/60">{awardCaption}</p>

          <div className="mt-8">
            <CalendlyButton label="Start a Search" />
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq-heading" className="py-16 sm:py-24">
        <Container className="max-w-3xl">
          <SectionHeading as="h2" eyebrow="Questions" title="Answers before you book" className="max-w-3xl" />
          <div className="mt-10">
            <FaqAccordion faqs={faqs} name="pricing-faq" />
          </div>
        </Container>
      </section>

      {/* Footer disclaimer */}
      <section aria-label="Disclaimer" className="border-t border-lagoon-100 bg-porcelain-50 py-10">
        <Container>
          <p className="mx-auto max-w-4xl text-xs leading-relaxed text-ink/55">{footerDisclaimer}</p>
        </Container>
      </section>
    </>
  );
}
