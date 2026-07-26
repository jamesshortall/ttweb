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
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/motion/Reveal";
import { HomeHero } from "@/components/marketing/HomeHero";
import { StatsSection } from "@/components/marketing/StatsSection";
import { CardMasterHighlight } from "@/components/marketing/CardMasterHighlight";
import { PhotoMarquee } from "@/components/marketing/PhotoMarquee";
import { NewsletterSection } from "@/components/marketing/NewsletterSection";
import { ConsultationCTA } from "@/components/marketing/ConsultationCTA";
import { ArticleCard } from "@/components/marketing/ArticleCard";
import { RedemptionCard } from "@/components/marketing/RedemptionCard";
import { BlogCards, BlogFallbackCard, toBlogCards } from "@/components/marketing/BlogCards";
import { AdSlot } from "@/components/ads/AdSlot";
import { JsonLd } from "@/components/seo/JsonLd";
import { webPageJsonLd } from "@/lib/structured-data";
import type { IconName } from "@/lib/cms/types";

export const metadata: Metadata = {
  title: `${siteConfig.name} — Turn your points into unforgettable travel`,
  description:
    "Points and miles for beginners: learn how to earn, organize, and redeem travel rewards, get a personal points strategy, and track everything with the free CardMaster app.",
  alternates: { canonical: "/" },
};

export const revalidate = 3600;

const helpPillars: Array<{
  icon: IconName;
  title: string;
  description: string;
  href: string;
  linkLabel: string;
  image: { src: string; alt: string };
}> = [
  {
    icon: "book",
    title: "Learn the system",
    description:
      "Plain-language education that takes you from \"what's a transfer partner?\" to confidently booking your own award travel.",
    href: "/points-and-miles-101",
    linkLabel: "Start with the basics",
    image: { src: "/images/travel/palm-alley.jpg", alt: "A sunlit avenue of palm trees" },
  },
  {
    icon: "compass",
    title: "Get a personal strategy",
    description:
      "One-on-one consultations, card strategy sessions, and portfolio audits built around your goals — never generic advice.",
    href: "/services",
    linkLabel: "Explore the services",
    image: { src: "/images/destinations/st-lucia-bay.jpg", alt: "A sweeping bay and green hills in St. Lucia" },
  },
  {
    icon: "sparkles",
    title: "Track it all with CardMaster",
    description:
      "The free app that keeps every balance, benefit, annual fee, and expiration date organized for your whole household.",
    href: "/cardmaster",
    linkLabel: "Meet CardMaster",
    image: { src: "/images/destinations/resort-pool.jpg", alt: "An oceanfront resort pool lined with palms" },
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
  const [settings, stats, services, stories, articles101, heroImages, destinationImages] =
    await Promise.all([
      getHomepageSettings(),
      getStats(),
      getServices(),
      getSuccessStories(),
      getArticles("points-101"),
      getImageCollection("homeHero"),
      getImageCollection("destinations"),
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
        images={heroImages.images}
      />

      <StatsSection stats={stats} />

      {/* Editorial intro */}
      <section aria-labelledby="intro-heading" className="bg-porcelain-50 py-24">
        <Container>
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div>
              <SectionHeading
                eyebrow="Welcome"
                title="The points-and-miles world, made calm and clear"
                description="It looks complicated from the outside — a dozen currencies, cryptic rules, everyone online speaking in acronyms. Travel Technician untangles it: honest education, a personal strategy when you want one, and free tools to keep it all organized."
              />
              <div className="mt-8 flex flex-wrap gap-4">
                <ButtonLink href="/points-and-miles-101" variant="secondary">
                  Start Here
                </ButtonLink>
                <ButtonLink href="/about" variant="outline">
                  Meet Jim
                </ButtonLink>
              </div>
            </div>
            <Reveal delay={120} className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-lg">
                    <Image src="/images/travel/pitons.jpg" alt="The Pitons in St. Lucia" fill sizes="(min-width:1024px) 22rem, 40vw" className="object-cover" />
                  </div>
                  <div className="relative aspect-square overflow-hidden rounded-2xl shadow-lg">
                    <Image src="/images/travel/turtle.jpg" alt="A green sea turtle over a reef" fill sizes="(min-width:1024px) 22rem, 40vw" className="object-cover" />
                  </div>
                </div>
                <div className="space-y-4 pt-10">
                  <div className="relative aspect-square overflow-hidden rounded-2xl shadow-lg">
                    <Image src="/images/destinations/tulum.jpg" alt="Tulum ruins above the sea" fill sizes="(min-width:1024px) 22rem, 40vw" className="object-cover" />
                  </div>
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-lg">
                    <Image src="/images/travel/footprints-sunset.jpg" alt="Footprints in the sand at sunset" fill sizes="(min-width:1024px) 22rem, 40vw" className="object-cover" />
                  </div>
                </div>
              </div>
              <div aria-hidden="true" className="absolute -bottom-6 -left-6 -z-10 h-40 w-40 rounded-full bg-gold-200/50 blur-3xl" />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* How Travel Technician helps */}
      <section aria-labelledby="how-helps" className="bg-white py-24">
        <Container>
          <SectionHeading
            eyebrow="How it works"
            title="Three ways to travel better on points"
            description="Whether you're brand new or buried in loyalty accounts, there's a clear place to begin."
            align="center"
          />
          <h2 id="how-helps" className="sr-only">
            How Travel Technician helps
          </h2>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {helpPillars.map((item, index) => (
              <Reveal
                key={item.title}
                delay={index * 110}
                className="group flex flex-col overflow-hidden rounded-3xl border border-navy-100 bg-porcelain-50 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-navy-950/10"
              >
                <div className="relative h-44 overflow-hidden">
                  <Image src={item.image.src} alt={item.image.alt} fill sizes="(min-width:768px) 22rem, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950/40 to-transparent" />
                  <span className="absolute -bottom-6 left-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/60 bg-white text-teal-700 shadow-lg">
                    <Icon name={item.icon} className="h-7 w-7" />
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-7 pt-10">
                  <h3 className="text-xl font-semibold text-navy-900">{item.title}</h3>
                  <p className="mt-2 leading-relaxed text-ink/70">{item.description}</p>
                  <Link href={item.href} className="mt-auto flex items-center gap-1.5 pt-5 font-semibold text-gold-700 hover:text-gold-800">
                    {item.linkLabel}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Beginners / Start here */}
      <section aria-labelledby="beginners-heading" className="relative overflow-hidden bg-navy-950 py-24 text-white">
        <Image src="/images/travel/palm-alley.jpg" alt="" fill sizes="100vw" className="-z-20 object-cover opacity-25" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-navy-950/80" />
        <Container className="relative">
          <div className="grid items-start gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
            <div className="lg:sticky lg:top-28">
              <SectionHeading
                eyebrow="Points & miles for beginners"
                title="New to points? Start here."
                description="The 101 hub is a proper curriculum — read it in order or jump to what you need. Plain language, no assumptions, and honest about what points can and can't do."
                tone="inverse"
              />
              <h2 id="beginners-heading" className="sr-only">
                Points and miles for beginners
              </h2>
              <div className="mt-8">
                <ButtonLink href="/points-and-miles-101" size="lg">
                  Learn About Points and Miles
                </ButtonLink>
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {articles101.slice(0, 4).map((article, index) => (
                <Reveal key={article.slug} delay={index * 90}>
                  <ArticleCard article={article} index={index} />
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Featured services */}
      <section aria-labelledby="services-heading" className="bg-porcelain-50 py-24">
        <Container>
          <SectionHeading
            eyebrow="Services"
            title="Strategy help, sized to your situation"
            description="From a single conversation to a full portfolio audit — education first, no fixed-price pressure, and a free consultation to find the right fit."
            align="center"
          />
          <h2 id="services-heading" className="sr-only">
            Featured services
          </h2>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {featuredServices.map((service, index) => (
              <Reveal
                key={service.slug}
                delay={index * 100}
                as="div"
                className="h-full"
              >
                <Link
                  href={`/services/${service.slug}`}
                  className="group flex h-full flex-col rounded-3xl border border-navy-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-teal-200 hover:shadow-xl hover:shadow-navy-950/10"
                >
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-900 text-gold-300">
                    <Icon name={service.icon} className="h-7 w-7" />
                  </span>
                  <h3 className="mt-6 text-xl font-semibold text-navy-900 group-hover:text-teal-700">
                    {service.name}
                  </h3>
                  <p className="mt-2 leading-relaxed text-ink/70">{service.summary}</p>
                  <span className="mt-auto flex items-center gap-1.5 pt-5 font-semibold text-gold-700">
                    Learn more
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
          <div className="mt-12 text-center">
            <ButtonLink href="/services" variant="outline">
              See all services
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* Inline sponsor slot — collapses entirely when no ad is eligible. */}
      <Container>
        <AdSlot placement="home-inline" />
      </Container>

      <CardMasterHighlight />

      {/* Destination marquee */}
      <section aria-labelledby="destinations-heading" className="bg-white py-24">
        <Container className="mb-12">
          <SectionHeading
            eyebrow="Where points can take you"
            title="Thirty countries and counting"
            description="Real places Jim has reached with points and miles — from Caribbean beaches to Pacific reefs."
            align="center"
          />
          <h2 id="destinations-heading" className="sr-only">
            Destinations
          </h2>
        </Container>
        <PhotoMarquee images={destinationImages.images} />
        <div className="mt-12 text-center">
          <ButtonLink href="/success-stories" variant="secondary">
            See the redemptions behind the trips
          </ButtonLink>
        </div>
      </section>

      {/* Real redemptions */}
      <section aria-labelledby="redemptions-heading" className="bg-porcelain-50 py-24">
        <Container>
          <SectionHeading
            eyebrow="Real redemption examples"
            title="What points can actually buy"
            description="Not hypotheticals — real trips Jim booked, with the honest math and the honest caveats."
            align="center"
          />
          <h2 id="redemptions-heading" className="sr-only">
            Real redemption examples
          </h2>
          <div className="mt-14 grid gap-8 lg:grid-cols-2">
            {featuredStories.map((story, index) => (
              <Reveal key={story.slug} delay={index * 120} className="h-full">
                <RedemptionCard story={story} />
              </Reveal>
            ))}
          </div>
          <div className="mt-12 text-center">
            <ButtonLink href="/success-stories" variant="outline">
              Read the full success stories
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* Why work with Jim */}
      <section aria-labelledby="why-jim" className="bg-white py-24">
        <Container>
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <Reveal className="relative order-2 lg:order-1">
              <div className="relative aspect-[5/4] overflow-hidden rounded-3xl shadow-2xl shadow-navy-950/20">
                <Image src="/images/jim/jim-business-class.jpg" alt="Jim relaxing in a lie-flat business class seat" fill sizes="(min-width:1024px) 32rem, 100vw" className="object-cover" />
              </div>
              <div className="absolute -bottom-6 -right-4 rounded-2xl border border-navy-100 bg-white px-6 py-4 shadow-xl sm:-right-6">
                <p className="font-serif text-3xl font-semibold text-navy-900">5M+</p>
                <p className="text-sm text-ink/60">points &amp; miles redeemed</p>
              </div>
            </Reveal>
            <div className="order-1 lg:order-2">
              <SectionHeading
                eyebrow="Why work with Jim"
                title="An engineer's approach to unforgettable travel"
                description="An experienced traveler who understands the tips, tools, and strategies that can help you travel in greater style and comfort."
              />
              <dl className="mt-8 grid gap-6 sm:grid-cols-2">
                {whyJim.map((item) => (
                  <div key={item.title}>
                    <dt className="flex items-center gap-2 font-semibold text-navy-900">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold-500" aria-hidden="true" />
                      {item.title}
                    </dt>
                    <dd className="mt-1.5 text-sm leading-relaxed text-ink/70">{item.description}</dd>
                  </div>
                ))}
              </dl>
              <Link href="/about" className="mt-8 inline-flex items-center gap-1.5 font-semibold text-gold-700 hover:text-gold-800">
                Read Jim&apos;s full story
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="h-4 w-4">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Latest from the blog */}
      <section aria-labelledby="blog-heading" className="bg-porcelain-50 py-24">
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
          <div className="mt-14">
            {blogItems.length > 0 ? <BlogCards items={blogItems} /> : <BlogFallbackCard />}
          </div>
        </Container>
      </section>

      <NewsletterSection settings={settings.newsletter} />

      <ConsultationCTA image="/images/travel/marigot-sunset.jpg" />
    </>
  );
}
