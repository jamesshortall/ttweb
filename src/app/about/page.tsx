import type { Metadata } from "next";
import Image from "next/image";
import { aboutPositioning, aboutStory } from "@/content/about";
import { siteConfig } from "@/lib/site-config";
import { getImageCollection } from "@/lib/cms";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/marketing/PageHero";
import { ConsultationCTA } from "@/components/marketing/ConsultationCTA";
import { RotatingImage } from "@/components/media/RotatingImage";
import { ExternalTag } from "@/components/ui/ExternalTag";
import { JsonLd } from "@/components/seo/JsonLd";
import { personJsonLd, webPageJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "About Jim Shortall — The Travel Technician",
  description:
    "Meet Jim Shortall: IT engineer, executive, and points-and-miles strategist who has redeemed more than 5 million points across 30+ countries — and teaches beginners to do the same.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const travelPhotos = await getImageCollection("aboutJim");

  return (
    <>
      <JsonLd
        data={[
          personJsonLd(),
          webPageJsonLd({
            title: metadata.title as string,
            description: metadata.description as string,
            path: "/about",
          }),
        ]}
      />
      <PageHero
        eyebrow="About Jim"
        title="The engineer behind Travel Technician"
        description={aboutPositioning}
        crumbs={[{ name: "About Jim", path: "/about" }]}
      />

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="max-w-3xl">
              {aboutStory.intro.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="mt-5 text-lg leading-relaxed text-ink/85 first:mt-0"
                >
                  {paragraph}
                </p>
              ))}

              {aboutStory.sections.map((section) => (
                <section key={section.heading} className="mt-12">
                  <h2 className="font-display text-2xl font-bold text-lagoon-950 sm:text-3xl">
                    {section.heading}
                  </h2>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 40)} className="mt-4 leading-relaxed text-ink/85">
                      {paragraph}
                    </p>
                  ))}
                </section>
              ))}
            </div>

            <aside className="space-y-8 lg:pt-2" aria-label="About Jim highlights">
              <figure>
                <Image
                  src="/images/jim/jim-portrait.svg"
                  alt="Jim Shortall, founder of Travel Technician"
                  width={680}
                  height={850}
                  className="w-full rounded-3xl shadow-lg"
                />
                <figcaption className="mt-2 text-center text-sm text-ink/70">
                  Jim Shortall — replace with final portrait before launch
                </figcaption>
              </figure>

              <div className="relative h-56 overflow-hidden rounded-3xl shadow-lg">
                <RotatingImage
                  images={travelPhotos.images}
                  intervalMs={travelPhotos.intervalMs}
                  sizes="(min-width: 1024px) 20rem, 100vw"
                />
                <p className="absolute bottom-3 left-3 rounded-full bg-lagoon-950/75 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                  From Jim&apos;s travels
                </p>
              </div>

              <div className="rounded-3xl border border-lagoon-100 bg-lagoon-50/60 p-6">
                <h2 className="font-display text-lg font-bold text-lagoon-950">
                  {aboutStory.credibility.heading}
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {aboutStory.credibility.items.map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm leading-snug text-ink/85">
                      <span aria-hidden="true" className="mt-0.5 text-palm-600">
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl border border-lagoon-100 bg-white p-6">
                <h2 className="font-display text-lg font-bold text-lagoon-950">Follow along</h2>
                <p className="mt-2 text-sm text-ink/75">
                  Trip photos, redemption wins, and quick tips between blog posts.
                </p>
                <div className="mt-4 flex flex-col gap-2.5">
                  <a
                    href={siteConfig.instagramUrl}
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-between gap-2 rounded-xl bg-lagoon-800 px-4 py-3 font-semibold text-white transition-colors hover:bg-lagoon-900"
                  >
                    Instagram <ExternalTag label="External" />
                  </a>
                  <a
                    href={siteConfig.facebookUrl}
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-between gap-2 rounded-xl bg-lagoon-800 px-4 py-3 font-semibold text-white transition-colors hover:bg-lagoon-900"
                  >
                    Facebook <ExternalTag label="External" />
                  </a>
                </div>
              </div>
            </aside>
          </div>

          {/* Travel philosophy */}
          <section aria-labelledby="philosophy-heading" className="mt-20">
            <h2
              id="philosophy-heading"
              className="font-display text-2xl font-bold text-lagoon-950 sm:text-3xl"
            >
              {aboutStory.philosophy.heading}
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {aboutStory.philosophy.items.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-lagoon-100 bg-white p-6 shadow-sm"
                >
                  <h3 className="font-display font-bold text-lagoon-950">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/75">{item.description}</p>
                </div>
              ))}
            </div>
          </section>
        </Container>
      </section>

      <ConsultationCTA
        heading="Curious what Jim would do with your points?"
        body="A free consultation is the easiest way to find out. No preparation required — just bring your questions."
      />
    </>
  );
}
