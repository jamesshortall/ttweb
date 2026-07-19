import type { Metadata } from "next";
import { getArticles, getFaqs } from "@/lib/cms";
import { glossary } from "@/content/glossary";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/marketing/PageHero";
import { ArticleCard } from "@/components/marketing/ArticleCard";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ConsultationCTA } from "@/components/marketing/ConsultationCTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqJsonLd, webPageJsonLd } from "@/lib/structured-data";
import { AdSlot } from "@/components/ads/AdSlot";

export const metadata: Metadata = {
  title: "Points and Miles 101 — A Beginner's Learning Hub",
  description:
    "Points and miles for beginners, explained in plain language: how travel rewards are earned, what award availability means, transfer partners, taxes and fees, and the mistakes to skip.",
  alternates: { canonical: "/points-and-miles-101" },
};

export const revalidate = 3600;

export default async function Points101Page() {
  const [articles, faqs] = await Promise.all([getArticles("points-101"), getFaqs("general")]);

  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            title: metadata.title as string,
            description: metadata.description as string,
            path: "/points-and-miles-101",
          }),
          faqJsonLd(faqs),
        ]}
      />
      <PageHero
        eyebrow="Start here"
        title="Points and Miles 101"
        description="Everything a beginner needs, in plain language and the right order. No jargon without an explanation, no assumptions, and honest answers about what points can and can't do."
        crumbs={[{ name: "Points & Miles 101", path: "/points-and-miles-101" }]}
      />

      <section aria-labelledby="curriculum-heading" className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="The curriculum"
            title="Read in order, or jump to what you need"
            description="Each guide stands alone, but together they build from 'what is a point?' to booking your own award travel with confidence."
          />
          <h2 id="curriculum-heading" className="sr-only">
            Points and Miles 101 curriculum
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, index) => (
              <ArticleCard key={article.slug} article={article} index={index} />
            ))}
          </div>
        </Container>
      </section>

      <Container>
        {/* Inline sponsor slot — collapses entirely when no ad is eligible. */}
        <AdSlot placement="points-101-inline" />
      </Container>

      <section aria-labelledby="glossary-heading" className="bg-sand-50 py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Glossary"
            title="The vocabulary, decoded"
            description="The terms you'll meet constantly in points and miles — each explained in a sentence or two."
          />
          <h2 id="glossary-heading" className="sr-only">
            Points and miles glossary
          </h2>
          <dl className="mt-10 grid gap-x-10 gap-y-6 sm:grid-cols-2">
            {glossary.map((entry) => (
              <div key={entry.term} className="rounded-2xl bg-white p-5 shadow-sm">
                <dt className="font-display font-bold text-lagoon-950">{entry.term}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-ink/80">{entry.definition}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <section aria-labelledby="faq-heading" className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="FAQ" title="Common beginner questions" align="center" />
          <h2 id="faq-heading" className="sr-only">
            Frequently asked questions
          </h2>
          <div className="mt-10">
            <FaqAccordion faqs={faqs} />
          </div>
        </Container>
      </section>

      <ConsultationCTA
        heading="Prefer to learn with a guide?"
        body="A free consultation can compress months of reading into one conversation about your specific situation."
      />
    </>
  );
}
