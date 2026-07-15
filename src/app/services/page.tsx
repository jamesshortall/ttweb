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
import { JsonLd } from "@/components/seo/JsonLd";
import { serviceJsonLd, webPageJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Points and Miles Services — Consultations, Strategy, and Audits",
  description:
    "One-on-one points and miles consultations, credit card strategy sessions, award travel search assistance, loyalty program reviews, and points portfolio audits — plus the free CardMaster app.",
  alternates: { canonical: "/services" },
};

export const revalidate = 3600;

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
        description="Education-first services sized to your situation — from one conversation to a complete portfolio audit. Every engagement starts with a free consultation, and pricing is discussed there, person to person."
        crumbs={[{ name: "Services", path: "/services" }]}
      />

      <section aria-labelledby="services-list" className="py-16 sm:py-20">
        <Container>
          <h2 id="services-list" className="sr-only">
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
                balances, credit card benefits, statement credits, annual fees, and expiration
                dates — free, for your whole household. It&apos;s the same tool Jim uses to manage
                his own points.
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
              accounts, your options, and the trade-offs. It is not financial, legal, or tax
              advice; no travel is booked on your behalf; and no outcome — approvals, availability,
              or point values — can be guaranteed. Pricing for paid services is discussed during
              your free consultation.
            </p>
          </div>
        </Container>
      </section>

      <section aria-labelledby="services-faq" className="bg-sand-50 py-16 sm:py-20">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="FAQ" title="Questions people ask before booking" align="center" />
          <h2 id="services-faq" className="sr-only">
            Services FAQ
          </h2>
          <div className="mt-10">
            <FaqAccordion faqs={faqs} />
          </div>
        </Container>
      </section>

      <ConsultationCTA />
    </>
  );
}
