import type { Metadata } from "next";
import Link from "next/link";
import { getFaqs, getServices } from "@/lib/cms";
import { siteConfig } from "@/lib/site-config";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/marketing/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { ConsultationCTA } from "@/components/marketing/ConsultationCTA";
import { CalendlyButton } from "@/components/scheduling/CalendlyButton";
import { JsonLd } from "@/components/seo/JsonLd";
import { serviceJsonLd, webPageJsonLd } from "@/lib/structured-data";
import {
  awardSearch,
  engagementFaqs,
  independenceParagraphs,
  noPerTravelerFee,
  serviceExtras,
  servicesDisclaimer,
  type ServiceExtra,
} from "@/content/service-extras";

export const metadata: Metadata = {
  title: "Points and Miles Services — Consultations, Strategy, and Audits",
  description:
    "One-on-one points and miles consultations, credit card strategy sessions, award flight search, loyalty program reviews, and points portfolio audits. Independent — no affiliate links, no referral commissions. Every engagement starts with a free 15-minute call.",
  alternates: { canonical: "/services" },
};

export const revalidate = 3600;

/** A short offering with no detail page of its own — read in full here. */
function ExtraCard({ item }: { item: ServiceExtra }) {
  return (
    <article
      className={
        item.free
          ? "flex h-full flex-col rounded-3xl border-2 border-lagoon-800 bg-lagoon-50/50 p-7 shadow-sm"
          : "flex h-full flex-col rounded-3xl border border-lagoon-100 bg-white p-7 shadow-sm transition-shadow hover:shadow-lg"
      }
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-xl font-bold text-lagoon-950">{item.name}</h3>
        {item.free ? (
          <span className="shrink-0 rounded-full bg-lagoon-800 px-3 py-0.5 text-xs font-semibold uppercase tracking-wide text-white">
            No cost
          </span>
        ) : null}
      </div>

      {item.format ? (
        <p className="mt-3 text-sm font-semibold text-lagoon-800">{item.format}</p>
      ) : null}

      {item.paras?.map((para) => (
        <p key={para} className="mt-4 text-sm leading-relaxed text-ink/75">
          {para}
        </p>
      ))}

      {item.bullets ? (
        <ul className="mt-4 space-y-2 text-sm leading-relaxed text-ink/75">
          {item.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-2">
              <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-lagoon-700" />
              {bullet}
            </li>
          ))}
        </ul>
      ) : null}

      {item.closing ? (
        <p className="mt-4 text-sm font-semibold text-lagoon-900">{item.closing}</p>
      ) : null}
      {item.note ? (
        <p className="mt-4 text-sm italic leading-relaxed text-ink/60">{item.note}</p>
      ) : null}

      <div className="mt-6 flex-grow" />
      <CalendlyButton label={item.cta} className="w-full" />
    </article>
  );
}

export default async function ServicesPage() {
  const [services, faqs] = await Promise.all([getServices(), getFaqs("general")]);

  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            title: metadata.title as string,
            description: metadata.description as string,
            path: "/services",
          }),
          ...services.map((service) =>
            serviceJsonLd({
              name: service.name,
              description: service.summary,
              path: `/services/${service.slug}`,
            }),
          ),
        ]}
      />
      <PageHero
        eyebrow="Services"
        title="Personal help with your points strategy"
        description="Education-first help from someone who has flown the routes, run the numbers, and takes nothing from credit card companies. Start with a free 15-minute call — I'll tell you honestly whether I can help, and what it would cost."
        crumbs={[{ name: "Services", path: "/services" }]}
      >
        <div className="flex flex-wrap items-center gap-4">
          <CalendlyButton label="Book a Free 15-Minute Call" />
          <ButtonLink href="#services-list" variant="inverse" size="lg">
            See the services <span aria-hidden="true">&darr;</span>
          </ButtonLink>
        </div>
      </PageHero>

      {/* Why this work is paid at all — the reason someone books instead of
          reading a free blog, and the thing no affiliate-funded site can say. */}
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
              Why I Charge &mdash; and Why That&apos;s Good for You
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

      <section id="services-list" aria-labelledby="services-list-heading" className="scroll-mt-24 py-16 sm:py-20">
        <Container>
          <h2 id="services-list-heading" className="sr-only">
            All services
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {services.map((service) => (
              <article
                key={service.slug}
                className="flex flex-col rounded-3xl border border-lagoon-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-lagoon-800 text-white">
                    <Icon name={service.icon} />
                  </span>
                  <h3 className="font-display text-xl font-bold text-lagoon-950">
                    <Link href={`/services/${service.slug}`} className="hover:text-lagoon-700">
                      {service.name}
                    </Link>
                  </h3>
                </div>
                <p className="mt-4 font-medium text-lagoon-800">{service.tagline}</p>
                <p className="mt-2 leading-relaxed text-ink/75">{service.summary}</p>
                <div className="mt-auto flex flex-wrap items-center gap-4 pt-6">
                  <ButtonLink href={`/services/${service.slug}`} variant="secondary">
                    Service details
                  </ButtonLink>
                  <Link
                    href={`/contact?topic=${service.slug === "points-and-miles-consultation" ? "free-consultation" : "points-strategy"}`}
                    className="font-semibold text-sunset-700 hover:underline"
                  >
                    {service.cta} →
                  </Link>
                </div>
              </article>
            ))}

            {/* CardMaster — the free companion to every service */}
            <article className="flex flex-col rounded-3xl bg-lagoon-950 p-8 text-white shadow-lg md:col-span-2">
              <div className="flex items-center gap-4">
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sunset-500 text-white">
                  <Icon name="sparkles" />
                </span>
                <h3 className="font-display text-xl font-bold">CardMaster — free for everyone</h3>
              </div>
              <p className="mt-4 max-w-3xl leading-relaxed text-lagoon-100">
                Every strategy works better with clean data. CardMaster tracks your loyalty
                balances, credit card benefits, statement credits, annual fees, and expiration dates
                — free, for your whole household. It&apos;s the same tool Jim uses to manage his own
                points.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <ButtonLink href={siteConfig.cardmasterUrl} external>
                  Start Using CardMaster
                </ButtonLink>
                <ButtonLink href="/cardmaster" variant="inverse">
                  About the app
                </ButtonLink>
              </div>
            </article>
          </div>

          <div className="mt-14 rounded-3xl border border-sand-200 bg-sand-50 p-7">
            <h2 className="font-display text-lg font-bold text-lagoon-950">
              What these services are — and aren&apos;t
            </h2>
            <p className="mt-3 max-w-3xl leading-relaxed text-ink/80">
              Everything Travel Technician offers is education and guidance: understanding your
              accounts, your options, and the trade-offs. It is not financial, legal, or tax advice;
              no travel is booked on your behalf; and no outcome — approvals, availability, or point
              values — can be guaranteed. What an engagement costs is discussed during your free
              consultation, before any work begins.
            </p>
          </div>
        </Container>
      </section>

      {/* Offerings without a detail page of their own, short enough to read here. */}
      {/* SectionHeading already renders the h2, so this section is labelled by
          it rather than carrying a second, duplicate heading. */}
      <section aria-label="More ways to work together" className="border-t border-lagoon-100 bg-porcelain-50 py-16 sm:py-20">
        <Container>
          <SectionHeading
            as="h2"
            eyebrow="Also available"
            title="More ways to work together"
            description="Start with the free fit call if you're not sure which of these fits — it exists so you don't book the wrong thing."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {serviceExtras.map((item) => (
              <ExtraCard key={item.id} item={item} />
            ))}
          </div>
        </Container>
      </section>

      {/* Award Flight Search — the process, which is the same whatever a trip costs. */}
      <section
        id="award-flight-search"
        aria-labelledby="award-heading"
        className="scroll-mt-24 border-y border-lagoon-100 py-16 sm:py-24"
      >
        <Container>
          <div className="max-w-3xl">
            <h2 id="award-heading" className="font-display text-3xl font-bold text-lagoon-950 sm:text-4xl">
              {awardSearch.heading}
            </h2>
            <p className="mt-3 text-lg font-semibold text-lagoon-800">{awardSearch.strapline}</p>
            <p className="mt-4 text-lg leading-relaxed text-ink/75">{awardSearch.intro}</p>
          </div>

          <h3 className="mt-12 font-display text-lg font-bold text-lagoon-950">How it works</h3>
          <ol className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {awardSearch.steps.map((step, index) => (
              <li
                key={step}
                className="flex flex-col gap-3 rounded-2xl border border-lagoon-100 bg-white p-6"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-lagoon-800 font-display text-base font-bold text-white">
                  {index + 1}
                </span>
                <span className="text-sm leading-relaxed text-ink/80">{step}</span>
              </li>
            ))}
          </ol>

          <p className="mt-10 font-semibold text-lagoon-900">{awardSearch.tiersIntro}</p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {awardSearch.tiers.map((tier) => (
              <li
                key={tier}
                className="rounded-2xl border border-lagoon-100 bg-white px-5 py-4 text-ink/85"
              >
                {tier}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm italic text-ink/60">{awardSearch.caption}</p>

          <div className="mt-6 rounded-2xl border-2 border-lagoon-800 bg-lagoon-50/50 p-6">
            <p className="font-display text-lg font-bold text-lagoon-950">
              {noPerTravelerFee.heading}
            </p>
            {noPerTravelerFee.body.map((para) => (
              <p key={para} className="mt-2 leading-relaxed text-ink/80">
                {para}
              </p>
            ))}
          </div>

          <div className="mt-8">
            <CalendlyButton label="Start a Search" />
          </div>
        </Container>
      </section>

      <section aria-labelledby="services-faq" className="bg-sand-50 py-16 sm:py-20">
        <Container className="max-w-3xl">
          <SectionHeading
            eyebrow="FAQ"
            title="Questions people ask before booking"
            align="center"
          />
          <h2 id="services-faq" className="sr-only">
            Services FAQ
          </h2>
          <div className="mt-10">
            {/* The CMS general FAQs first, then the ones specific to booking
                an engagement — which came from the retired pricing page. */}
            <FaqAccordion faqs={[...faqs, ...engagementFaqs]} name="services-faq" />
          </div>
        </Container>
      </section>

      <section aria-label="Disclaimer" className="border-t border-lagoon-100 bg-porcelain-50 py-10">
        <Container>
          <p className="mx-auto max-w-4xl text-xs leading-relaxed text-ink/55">
            {servicesDisclaimer}
          </p>
        </Container>
      </section>

      <ConsultationCTA />
    </>
  );
}
