import type { Metadata } from "next";
import Image from "next/image";
import { getCardMasterFeatures, getCardMasterScreenshots, getFaqs } from "@/lib/cms";
import { cardMasterHowItWorks } from "@/content/cardmaster";
import { siteConfig } from "@/lib/site-config";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/marketing/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqJsonLd, softwareApplicationJsonLd, webPageJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "CardMaster — Free Points and Miles Tracker",
  description:
    "CardMaster is the free points and miles tracker from Travel Technician: loyalty balances, credit card benefits, statement credits, annual fees, and expiration reminders for your whole household.",
  alternates: { canonical: "/cardmaster" },
};

export const revalidate = 3600;

export default async function CardMasterPage() {
  const [features, screenshots, faqs] = await Promise.all([
    getCardMasterFeatures(),
    getCardMasterScreenshots(),
    getFaqs("cardmaster"),
  ]);

  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            title: metadata.title as string,
            description: metadata.description as string,
            path: "/cardmaster",
          }),
          softwareApplicationJsonLd(),
          faqJsonLd(faqs),
        ]}
      />
      <PageHero
        eyebrow="Free app"
        title="CardMaster keeps your entire points life organized"
        description="Loyalty balances, credit card benefits, statement credits, annual fees, and expiration reminders — in one free dashboard, for you and your household. Built by Jim to run his own 5-million-point strategy."
        crumbs={[{ name: "CardMaster", path: "/cardmaster" }]}
      >
        <div className="flex flex-wrap items-center gap-4">
          <ButtonLink href={siteConfig.cardmasterUrl} external size="lg">
            Start Using CardMaster
          </ButtonLink>
          <p className="text-sm font-medium text-lagoon-100">
            100% free · New accounts require approval
          </p>
        </div>
      </PageHero>

      {/* The problem it solves */}
      <section aria-labelledby="cm-why" className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Why it exists"
            title="Spreadsheets weren't built for this"
            description="A points strategy generates a surprising amount of bookkeeping: a dozen loyalty balances, cards with rotating credits, annual fees on different anniversaries, and miles that quietly expire. Miss one detail and real money evaporates — an unused $200 credit here, 40,000 expired miles there. CardMaster replaces the spreadsheet (and the memory) with a system."
            align="center"
          />
          <h2 id="cm-why" className="sr-only">
            Why CardMaster exists
          </h2>
        </Container>
      </section>

      {/* Feature cards */}
      <section aria-labelledby="cm-features" className="bg-lagoon-50/60 py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Features" title="Everything it tracks for you" align="center" />
          <h2 id="cm-features" className="sr-only">
            CardMaster features
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-2xl border border-lagoon-100 bg-white p-7 shadow-sm">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-lagoon-800 text-white">
                  <Icon name={feature.icon} />
                </span>
                <h3 className="font-display mt-5 text-lg font-bold text-lagoon-950">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/75">{feature.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Screenshots */}
      <section aria-labelledby="cm-screens" className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="A look inside"
            title="Clear enough for the whole household"
            description="Current images are placeholders — final screenshots are added via /public/images/cardmaster (see the content guide)."
            align="center"
          />
          <h2 id="cm-screens" className="sr-only">
            CardMaster screenshots
          </h2>
          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {screenshots.map((screenshot) => (
              <figure key={screenshot.src}>
                <Image
                  src={screenshot.src}
                  alt={screenshot.alt}
                  width={1440}
                  height={900}
                  className="w-full rounded-2xl border border-lagoon-100 shadow-lg"
                />
                <figcaption className="mt-3 text-center text-sm font-medium text-ink/70">
                  {screenshot.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section aria-labelledby="cm-how" className="bg-sand-50 py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="How it works" title="Up and running in three steps" align="center" />
          <h2 id="cm-how" className="sr-only">
            How CardMaster works
          </h2>
          <ol className="mt-12 grid gap-6 md:grid-cols-3">
            {cardMasterHowItWorks.map((step, index) => (
              <li key={step.title} className="rounded-2xl bg-white p-7 shadow-sm">
                <span className="font-display flex h-10 w-10 items-center justify-center rounded-full bg-sunset-600 text-lg font-bold text-white">
                  {index + 1}
                </span>
                <h3 className="font-display mt-4 text-lg font-bold text-lagoon-950">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/75">{step.description}</p>
              </li>
            ))}
          </ol>

          <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-lagoon-200 bg-lagoon-50 p-7">
            <h3 className="font-display text-lg font-bold text-lagoon-950">
              About approval and your data
            </h3>
            <p className="mt-3 leading-relaxed text-ink/80">
              New accounts are approved individually — it keeps the platform limited to real people
              and support personal. CardMaster never connects to your bank or card accounts and
              never asks for banking credentials: you enter only the balances and benefits you
              choose to track, and your account is protected by standard authentication. CardMaster
              is a separate application from this website, with separate accounts and data.
            </p>
          </div>

          <div className="mt-12 text-center">
            <ButtonLink href={siteConfig.cardmasterUrl} external size="lg">
              Start Using CardMaster
            </ButtonLink>
            <p className="mt-3 text-sm text-ink/60">Free to use — no credit card required to sign up.</p>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section aria-labelledby="cm-faq" className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="FAQ" title="CardMaster questions, answered" align="center" />
          <h2 id="cm-faq" className="sr-only">
            CardMaster FAQ
          </h2>
          <div className="mt-10">
            <FaqAccordion faqs={faqs} />
          </div>
        </Container>
      </section>
    </>
  );
}
