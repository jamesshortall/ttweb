import type { Metadata } from "next";
import { getImageCollection, getSuccessStories } from "@/lib/cms";
import { successStoryDisclaimer } from "@/content/success-stories";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/marketing/PageHero";
import { SuccessStoryCard } from "@/components/marketing/SuccessStoryCard";
import { ConsultationCTA } from "@/components/marketing/ConsultationCTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { webPageJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Success Stories — Real Points and Miles Redemptions",
  description:
    "Real redemptions with real numbers: Qatar Airways QSuites to Singapore for 75,000 points, last-minute Austrian business class to Vienna for 70,000 miles — with honest math and honest caveats.",
  alternates: { canonical: "/success-stories" },
};

export const revalidate = 3600;

export default async function SuccessStoriesPage() {
  const [stories, heroImages] = await Promise.all([
    getSuccessStories(),
    getImageCollection("successStories"),
  ]);

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: metadata.title as string,
          description: metadata.description as string,
          path: "/success-stories",
        })}
      />
      <PageHero
        eyebrow="Success stories"
        title="Real redemptions, real numbers"
        description="These are trips Jim actually booked with points — routes, costs, and value math included. They show what deliberate strategy makes possible, alongside the honest context about why every redemption is different."
        crumbs={[{ name: "Success Stories", path: "/success-stories" }]}
        imageCollection={heroImages}
      />

      <section aria-label="Redemption stories" className="py-16 sm:py-20">
        <Container className="max-w-4xl space-y-12">
          {stories.map((story) => (
            <SuccessStoryCard key={story.slug} story={story} />
          ))}

          <aside
            aria-labelledby="stories-disclaimer"
            className="rounded-3xl border border-sand-200 bg-sand-50 p-7"
          >
            <h2 id="stories-disclaimer" className="font-display text-lg font-bold text-lagoon-950">
              Before you compare these to your own points
            </h2>
            <ul className="mt-4 space-y-2.5">
              {successStoryDisclaimer.map((line) => (
                <li key={line} className="flex gap-3 text-sm leading-relaxed text-ink/80">
                  <span aria-hidden="true" className="mt-0.5 text-lagoon-600">
                    •
                  </span>
                  {line}
                </li>
              ))}
            </ul>
          </aside>
        </Container>
      </section>

      <ConsultationCTA
        heading="Want to find your own version of these trips?"
        body="Every redemption here started with the same ingredients: flexible points, a clear goal, and a working search process. A free consultation shows you how those apply to your balances."
      />
    </>
  );
}
