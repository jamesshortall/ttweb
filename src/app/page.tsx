import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/site-config";
import {
  getArticles,
  getFeaturedBlogPosts,
  getHomepageSettings,
  getImageCollection,
  getServices,
  getStats,
  getSuccessStories,
} from "@/lib/cms";
import { serverEnv } from "@/lib/env";
import { fetchBlogFeed } from "@/lib/rss";
import { centsPerPoint, formatCentsPerPoint, formatNumber, formatUsd } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { HomeHero } from "@/components/marketing/HomeHero";
import { StatsSection } from "@/components/marketing/StatsSection";
import { CardMasterHighlight } from "@/components/marketing/CardMasterHighlight";
import { NewsletterSection } from "@/components/marketing/NewsletterSection";
import { ConsultationCTA } from "@/components/marketing/ConsultationCTA";
import { ArticleCard } from "@/components/marketing/ArticleCard";
import { BlogCards, BlogFallbackCard, toBlogCards } from "@/components/marketing/BlogCards";
import { JsonLd } from "@/components/seo/JsonLd";
import { webPageJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: `${siteConfig.name} — Turn your points into unforgettable travel`,
  description:
    "Points and miles for beginners: learn how to earn, organize, and redeem travel rewards, get a personal points strategy, and track everything with the free CardMaster app.",
  alternates: { canonical: "/" },
};

export const revalidate = 3600;

const howHelps = [
  {
    icon: "book" as const,
    title: "Learn the system",
    description:
      "Plain-language education that takes you from \"what's a transfer partner?\" to confidently booking your own award travel.",
    href: "/points-and-miles-101",
    linkLabel: "Start with Points & Miles 101",
  },
  {
    icon: "compass" as const,
    title: "Get a personal strategy",
    description:
      "One-on-one consultations, card strategy sessions, and portfolio audits built around your goals — not generic advice.",
    href: "/services",
    linkLabel: "Explore the services",
  },
  {
    icon: "wrench" as const,
    title: "Track it all with CardMaster",
    description:
      "The free app that keeps every balance, benefit, annual fee, and expiration date organized for your whole household.",
    href: "/cardmaster",
    linkLabel: "Meet CardMaster",
  },
];

const whyJim = [
  {
    title: "Real redemptions, not theory",
    description:
      "More than 5 million points and miles actually redeemed — QSuites to Singapore, last-minute business class to Vienna, and everything in between.",
  },
  {
    title: "A technician's method",
    description:
      "A career IT engineer and executive, Jim treats loyalty programs like systems: mapped, tracked, and turned into repeatable playbooks.",
  },
  {
    title: "Beginner-first teaching",
    description:
      "No jargon without explanation, no pressure, and honest answers about complexity, limitations, and when points aren't the right tool.",
  },
  {
    title: "Independent, always",
    description:
      "No airline, bank, hotel, or agency affiliation — and currently zero affiliate links. The only agenda is your travel.",
  },
];

export default async function HomePage() {
  const env = serverEnv();
  const [settings, stats, services, stories, articles101, heroImages] = await Promise.all([
    getHomepageSettings(),
    getStats(),
    getServices(),
    getSuccessStories(),
    getArticles("points-101"),
    getImageCollection("homeHero"),
  ]);

  const blogItems = env.BLOG_RSS_URL
    ? toBlogCards(await fetchBlogFeed(env.BLOG_RSS_URL, 3))
    : toBlogCards((await getFeaturedBlogPosts()).slice(0, 3));

  const featuredServices = services.filter((s) => s.featured).slice(0, 3);
  const featuredStories = stories.slice(0, 2);

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: metadata.title as string,
          description: metadata.description as string,
          path: "/",
        })}
      />

      <HomeHero
        headline={settings.heroHeadline}
        subheadline={settings.heroSubheadline}
        imageCollection={heroImages}
      />

      <StatsSection stats={stats} />

      {/* How Travel Technician helps */}
      <section aria-labelledby="how-helps" className="py-20">
        <Container>
          <SectionHeading
            eyebrow="How Travel Technician helps"
            title="Three ways to travel better on points"
            description="Whether you're brand new or buried in loyalty accounts, there's a clear starting point."
            align="center"
          />
          <h2 id="how-helps" className="sr-only">
            How Travel Technician helps
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {howHelps.map((item) => (
              <div
                key={item.title}
                className="flex flex-col rounded-2xl border border-lagoon-100 bg-white p-7 shadow-sm"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-lagoon-800 text-white">
                  <Icon name={item.icon} />
                </span>
                <h3 className="font-display mt-5 text-xl font-bold text-lagoon-950">{item.title}</h3>
                <p className="mt-2 leading-relaxed text-ink/75">{item.description}</p>
                <Link
                  href={item.href}
                  className="mt-auto pt-4 font-semibold text-sunset-700 hover:underline"
                >
                  {item.linkLabel} →
                </Link>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Beginners section */}
      <section aria-labelledby="beginners-heading" className="bg-sand-50 py-20">
        <Container>
          <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
            <div className="lg:sticky lg:top-24">
              <SectionHeading
                eyebrow="Points and miles for beginners"
                title="New to points? Start here."
                description="Points and miles look complicated from the outside — a dozen currencies, cryptic rules, and everyone online speaking in acronyms. The 101 hub untangles it in plain language, in the right order."
              />
              <h2 id="beginners-heading" className="sr-only">
                Points and miles for beginners
              </h2>
              <div className="mt-8">
                <ButtonLink href="/points-and-miles-101" variant="secondary" size="lg">
                  Learn About Points and Miles
                </ButtonLink>
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {articles101.slice(0, 4).map((article, index) => (
                <ArticleCard key={article.slug} article={article} index={index} />
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Featured services */}
      <section aria-labelledby="services-heading" className="py-20">
        <Container>
          <SectionHeading
            eyebrow="Featured services"
            title="Strategy help, sized to your situation"
            description="From a single conversation to a full portfolio audit — education first, no fixed-price pressure, and a free consultation to find the right fit."
            align="center"
          />
          <h2 id="services-heading" className="sr-only">
            Featured services
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {featuredServices.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group flex flex-col rounded-2xl border border-lagoon-100 bg-white p-7 shadow-sm transition-shadow hover:shadow-lg"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-sunset-100 text-sunset-700">
                  <Icon name={service.icon} />
                </span>
                <h3 className="font-display mt-5 text-xl font-bold text-lagoon-950 group-hover:text-lagoon-700">
                  {service.name}
                </h3>
                <p className="mt-2 leading-relaxed text-ink/75">{service.summary}</p>
                <span className="mt-auto pt-4 font-semibold text-sunset-700 group-hover:underline">
                  Learn more →
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center">
            <ButtonLink href="/services" variant="outline">
              See all services
            </ButtonLink>
          </div>
        </Container>
      </section>

      <CardMasterHighlight />

      {/* Real redemption examples */}
      <section aria-labelledby="redemptions-heading" className="py-20">
        <Container>
          <SectionHeading
            eyebrow="Real redemption examples"
            title="What points can actually buy"
            description="Not hypotheticals — real trips Jim booked with points, with the honest math and the honest caveats."
            align="center"
          />
          <h2 id="redemptions-heading" className="sr-only">
            Real redemption examples
          </h2>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {featuredStories.map((story) => {
              const cpp = centsPerPoint(story.cashValueUsd, story.taxesFeesUsd, story.pointsUsed);
              return (
                <div
                  key={story.slug}
                  className="relative overflow-hidden rounded-3xl border border-lagoon-100 bg-white shadow-md"
                >
                  <div className="relative h-44">
                    <Image
                      src={story.image.src}
                      alt={story.image.alt}
                      fill
                      sizes="(min-width: 1024px) 36rem, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-7">
                    <h3 className="font-display text-xl font-bold text-lagoon-950">{story.title}</h3>
                    <p className="mt-1 text-sm font-medium text-ink/60">{story.route}</p>
                    <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                      <div>
                        <dt className="inline font-semibold text-lagoon-800">
                          {story.pointsUnit === "miles" ? "Miles: " : "Points: "}
                        </dt>
                        <dd className="inline">{formatNumber(story.pointsUsed)}</dd>
                      </div>
                      <div>
                        <dt className="inline font-semibold text-lagoon-800">Fees: </dt>
                        <dd className="inline">{formatUsd(story.taxesFeesUsd)}</dd>
                      </div>
                      <div>
                        <dt className="inline font-semibold text-lagoon-800">Cash price: </dt>
                        <dd className="inline">~{formatUsd(story.cashValueUsd)}</dd>
                      </div>
                      <div>
                        <dt className="inline font-semibold text-lagoon-800">Est. value: </dt>
                        <dd className="inline">
                          {formatCentsPerPoint(cpp)}/{story.pointsUnit === "miles" ? "mile" : "point"}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-10 text-center">
            <ButtonLink href="/success-stories" variant="secondary">
              Read the full success stories
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* Latest blog posts */}
      <section aria-labelledby="blog-heading" className="bg-sand-50 py-20">
        <Container>
          <SectionHeading
            eyebrow="From the blog"
            title="Read the latest tips"
            description="Ongoing points news and strategy write-ups live on the Travel Technician blog — a separate site, one click away."
            align="center"
          />
          <h2 id="blog-heading" className="sr-only">
            Latest blog posts
          </h2>
          <div className="mt-12">
            {blogItems.length > 0 ? <BlogCards items={blogItems} /> : <BlogFallbackCard />}
          </div>
        </Container>
      </section>

      {/* Why work with Jim */}
      <section aria-labelledby="why-jim" className="py-20">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-[300px_minmax(0,1fr)]">
            <div className="relative mx-auto w-full max-w-[300px]">
              <div
                aria-hidden="true"
                className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-lagoon-300/60 to-sunset-300/60 blur-lg"
              />
              <Image
                src="/images/jim/jim-portrait.svg"
                alt="Jim Shortall, founder of Travel Technician"
                width={680}
                height={850}
                className="relative w-full rounded-3xl shadow-xl"
              />
            </div>
            <div>
              <SectionHeading
                eyebrow="Why work with Jim"
                title="An engineer's approach to unforgettable travel"
                description="An experienced traveler who understands the tips, tools, and strategies that can help you travel in greater style and comfort."
              />
              <h2 id="why-jim" className="sr-only">
                Why work with Jim
              </h2>
              <dl className="mt-8 grid gap-6 sm:grid-cols-2">
                {whyJim.map((item) => (
                  <div key={item.title}>
                    <dt className="font-display font-bold text-lagoon-950">{item.title}</dt>
                    <dd className="mt-1.5 text-sm leading-relaxed text-ink/75">{item.description}</dd>
                  </div>
                ))}
              </dl>
              <Link
                href="/about"
                className="mt-8 inline-block font-semibold text-sunset-700 hover:underline"
              >
                Read Jim&apos;s full story →
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <NewsletterSection settings={settings.newsletter} />

      <ConsultationCTA />
    </>
  );
}
