import { describe, expect, it } from "vitest";
import {
  getArticles,
  getCardMasterFeatures,
  getFaqs,
  getFeaturedBlogPosts,
  getHomepageSettings,
  getImageCollection,
  getResources,
  getServices,
  getStats,
  getSuccessStories,
} from "@/lib/cms";
import { fallbackServices } from "@/content/services";
import { fallbackSuccessStories } from "@/content/success-stories";

/**
 * CMS fallback behaviour: with no Sanity configuration (the test environment),
 * every getter must return complete built-in content so the site renders fully.
 */
describe("cms fallbacks (Sanity unconfigured)", () => {
  it("returns fallback services", async () => {
    const services = await getServices();
    expect(services).toEqual(fallbackServices);
    expect(services.length).toBeGreaterThanOrEqual(5);
  });

  it("returns both real success stories with correct figures", async () => {
    const stories = await getSuccessStories();
    expect(stories).toEqual(fallbackSuccessStories);
    const qsuites = stories.find((s) => s.slug === "qatar-qsuites-boston-singapore");
    expect(qsuites).toMatchObject({ pointsUsed: 75_000, taxesFeesUsd: 279, cashValueUsd: 7_000 });
    const austrian = stories.find((s) => s.slug === "austrian-business-boston-vienna");
    expect(austrian).toMatchObject({ pointsUsed: 70_000, taxesFeesUsd: 58, cashValueUsd: 7_900 });
  });

  it("returns homepage settings with the configured estimated value", async () => {
    const settings = await getHomepageSettings();
    expect(settings.heroHeadline).toBe("Turn your points into unforgettable travel.");
    expect(settings.estimatedTravelValue).toBe("$125,000");
    expect(settings.newsletter.mode).toBe("coming-soon");
  });

  it("exposes the finalized estimated-value statistic (no longer a placeholder)", async () => {
    const stats = await getStats();
    const value = stats.find((s) => s.id === "estimated-value");
    expect(value?.value).toBe("$125,000");
    expect(value?.isPlaceholder).toBe(false);
  });

  it("returns articles for both hubs with unique slugs", async () => {
    for (const collection of ["points-101", "tips"] as const) {
      const articles = await getArticles(collection);
      expect(articles.length).toBeGreaterThanOrEqual(6);
      const slugs = articles.map((a) => a.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
      for (const article of articles) {
        expect(article.collection).toBe(collection);
        expect(article.sections.length).toBeGreaterThan(0);
      }
    }
  });

  it("returns FAQ groups", async () => {
    expect((await getFaqs("general")).length).toBeGreaterThanOrEqual(4);
    expect((await getFaqs("cardmaster")).length).toBeGreaterThanOrEqual(4);
  });

  it("returns resources with categories", async () => {
    const resources = await getResources();
    expect(resources.length).toBeGreaterThanOrEqual(10);
    expect(new Set(resources.map((r) => r.category)).size).toBeGreaterThanOrEqual(5);
  });

  it("returns an EMPTY featured-blog list (never invents posts)", async () => {
    expect(await getFeaturedBlogPosts()).toEqual([]);
  });

  it("returns CardMaster features", async () => {
    expect((await getCardMasterFeatures()).length).toBeGreaterThanOrEqual(5);
  });

  it("returns rotating image collections with alt text on every image", async () => {
    const collection = await getImageCollection("homeHero");
    expect(collection.images.length).toBeGreaterThanOrEqual(3);
    expect(collection.intervalMs).toBeGreaterThan(0);
    for (const image of collection.images) {
      expect(image.alt.length).toBeGreaterThan(5);
    }
  });
});
