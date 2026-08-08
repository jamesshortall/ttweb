import type { Metadata } from "next";
import { serverEnv } from "@/lib/env";
import { fetchBlogFeed } from "@/lib/rss";
import { getFeaturedBlogPosts } from "@/lib/cms";
import { siteConfig } from "@/lib/site-config";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/marketing/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { BlogCards, BlogFallbackCard, toBlogCards } from "@/components/marketing/BlogCards";
import { NewsletterSection } from "@/components/marketing/NewsletterSection";
import { getHomepageSettings } from "@/lib/cms";
import { AdSlot } from "@/components/ads/AdSlot";
import { JsonLd } from "@/components/seo/JsonLd";
import { webPageJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Blog — Points News and Strategy from Travel Technician",
  description:
    "The Travel Technician blog covers points and miles news, loyalty program tips, and redemption stories. Browse the latest posts and read them on blog.traveltechnician.info.",
  alternates: { canonical: "/blog" },
};

// Revalidate hourly so the RSS-powered cards stay fresh without per-request fetches.
export const revalidate = 3600;

export default async function BlogPage() {
  const env = serverEnv();
  const [settings, featured] = await Promise.all([getHomepageSettings(), getFeaturedBlogPosts()]);

  const rssItems = env.BLOG_RSS_URL ? await fetchBlogFeed(env.BLOG_RSS_URL, 6) : [];
  const featuredCards = toBlogCards(featured);
  const recentCards = toBlogCards(rssItems);

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: metadata.title as string,
          description: metadata.description as string,
          path: "/blog",
        })}
      />
      <PageHero
        eyebrow="The blog"
        title="Points news and strategy, as it happens"
        description="The Travel Technician blog is a separate site where Jim publishes program news, transfer bonus alerts, strategy write-ups, and trip reports. Everything below links straight to it."
        crumbs={[{ name: "Blog", path: "/blog" }]}
      >
        <ButtonLink href={siteConfig.blogUrl} external size="lg">
          Visit the Travel Technician Blog
        </ButtonLink>
      </PageHero>

      <section aria-labelledby="blog-posts-heading" className="py-16 sm:py-20">
        <Container>
          {featuredCards.length > 0 ? (
            <div className="mb-16">
              <SectionHeading eyebrow="Featured" title="Hand-picked reads" />
              <div className="mt-8">
                <BlogCards items={featuredCards} />
              </div>
            </div>
          ) : null}

          {/* Inline sponsor slot — collapses entirely when no ad is eligible. */}
          <AdSlot placement="blog-inline" />

          <SectionHeading
            eyebrow="Latest posts"
            title="Recently on the blog"
            description={
              recentCards.length > 0
                ? "Fresh from blog.traveltechnician.info — each link opens the full article on the blog."
                : undefined
            }
          />
          <h2 id="blog-posts-heading" className="sr-only">
            Blog posts
          </h2>
          <div className="mt-8">
            {recentCards.length > 0 ? <BlogCards items={recentCards} /> : <BlogFallbackCard />}
          </div>
        </Container>
      </section>

      <NewsletterSection settings={settings.newsletter} />
    </>
  );
}
