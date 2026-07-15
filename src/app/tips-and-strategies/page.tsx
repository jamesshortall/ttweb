import type { Metadata } from "next";
import Link from "next/link";
import { getArticles } from "@/lib/cms";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/marketing/PageHero";
import { ArticleCard } from "@/components/marketing/ArticleCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ConsultationCTA } from "@/components/marketing/ConsultationCTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { webPageJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Tips and Strategies — Practical Travel Rewards Playbooks",
  description:
    "A travel rewards strategy library: transfer bonuses, annual fee reviews, family points coordination, award search techniques, and loyalty program tips — all in plain language.",
  alternates: { canonical: "/tips-and-strategies" },
};

export const revalidate = 3600;

export default async function TipsPage() {
  const articles = await getArticles("tips");
  const categories = [...new Set(articles.map((a) => a.category))];

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: metadata.title as string,
          description: metadata.description as string,
          path: "/tips-and-strategies",
        })}
      />
      <PageHero
        eyebrow="Tips & Strategies"
        title="Practical playbooks for real trips"
        description="Past the basics? These are the working strategies — earning, redeeming, organizing, and the judgment calls in between. Educational always; financial advice never."
        crumbs={[{ name: "Tips & Strategies", path: "/tips-and-strategies" }]}
      >
        <ul className="flex flex-wrap gap-2" aria-label="Strategy categories">
          {categories.map((category) => (
            <li
              key={category}
              className="rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-medium text-lagoon-100"
            >
              {category}
            </li>
          ))}
        </ul>
      </PageHero>

      <section aria-labelledby="tips-heading" className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="The library"
            title="Strategies you can put to work this week"
          />
          <h2 id="tips-heading" className="sr-only">
            All tips and strategies
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>

          <div className="mt-14 rounded-3xl border border-sand-200 bg-sand-50 p-7">
            <h2 className="font-display text-lg font-bold text-lagoon-950">
              A note on credit, always worth repeating
            </h2>
            <p className="mt-3 max-w-3xl leading-relaxed text-ink/80">
              None of these strategies is worth paying credit card interest for, and opening new
              cards isn&apos;t right for everyone or every season of life. Everything here is
              education, not financial advice — approvals are up to issuers, and the right pace is
              the one that fits your finances. New to all of this? Start with{" "}
              <Link href="/points-and-miles-101" className="font-semibold text-lagoon-700 underline">
                Points &amp; Miles 101
              </Link>
              .
            </p>
          </div>
        </Container>
      </section>

      <ConsultationCTA
        heading="Want these strategies applied to your accounts?"
        body="A free consultation turns general playbooks into your specific next steps."
      />
    </>
  );
}
