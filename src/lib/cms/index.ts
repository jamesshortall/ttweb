import { sanityClient } from "@/lib/cms/client";
import * as q from "@/lib/cms/queries";
import type {
  Article,
  CardMasterFeature,
  CardMasterScreenshot,
  Faq,
  FeaturedBlogPost,
  HomepageSettings,
  Resource,
  RotatingImageCollection,
  Service,
  SiteStat,
  SuccessStory,
} from "@/lib/cms/types";
import { fallbackHomepageSettings, fallbackStats } from "@/content/site";
import { fallbackServices } from "@/content/services";
import { fallbackSuccessStories } from "@/content/success-stories";
import { fallbackResources } from "@/content/resources";
import { fallbackCardMasterFaqs, fallbackGeneralFaqs } from "@/content/faqs";
import { fallbackArticles101 } from "@/content/articles-101";
import { fallbackTips } from "@/content/tips";
import { fallbackCardMasterFeatures, fallbackCardMasterScreenshots } from "@/content/cardmaster";
import { fallbackImageCollections } from "@/content/images";
import { apps as fallbackApps, type AppEntry } from "@/content/apps";

/**
 * Content access layer.
 *
 * Every getter queries Sanity when configured and quietly falls back to the
 * complete built-in content (src/content) when the CMS is unconfigured,
 * returns nothing, or errors. Pages never need to know which source answered.
 */

async function fromCms<T>(
  fetcher: () => Promise<T | null | undefined>,
  fallback: T,
  isUsable: (value: T) => boolean = (value) => (Array.isArray(value) ? value.length > 0 : !!value),
): Promise<T> {
  const client = sanityClient();
  if (!client) return fallback;
  try {
    const value = await fetcher();
    if (value !== null && value !== undefined && isUsable(value)) return value;
  } catch (error) {
    console.error(`[cms] Query failed, using fallback content: ${(error as Error).message}`);
  }
  return fallback;
}

export async function getStats(): Promise<SiteStat[]> {
  return fromCms(() => sanityClient()!.fetch<SiteStat[]>(q.statsQuery), fallbackStats);
}

export async function getHomepageSettings(): Promise<HomepageSettings> {
  const settings = await fromCms(
    () => sanityClient()!.fetch<HomepageSettings | null>(q.homeSettingsQuery),
    fallbackHomepageSettings,
    (value) => !!value?.heroHeadline,
  );
  // Guarantee newsletter settings even for partially filled CMS documents.
  return {
    ...fallbackHomepageSettings,
    ...settings,
    newsletter: { ...fallbackHomepageSettings.newsletter, ...settings.newsletter },
  };
}

export async function getServices(): Promise<Service[]> {
  return fromCms(() => sanityClient()!.fetch<Service[]>(q.servicesQuery), fallbackServices);
}

export async function getService(slug: string): Promise<Service | undefined> {
  const services = await getServices();
  return services.find((s) => s.slug === slug);
}

export async function getSuccessStories(): Promise<SuccessStory[]> {
  return fromCms(
    () => sanityClient()!.fetch<SuccessStory[]>(q.successStoriesQuery),
    fallbackSuccessStories,
  );
}

export async function getResources(): Promise<Resource[]> {
  return fromCms(() => sanityClient()!.fetch<Resource[]>(q.resourcesQuery), fallbackResources);
}

export async function getFaqs(group: "general" | "cardmaster"): Promise<Faq[]> {
  const fallback = group === "cardmaster" ? fallbackCardMasterFaqs : fallbackGeneralFaqs;
  return fromCms(() => sanityClient()!.fetch<Faq[]>(q.faqsQuery, { group }), fallback);
}

export async function getArticles(collection: "points-101" | "tips"): Promise<Article[]> {
  const fallback = collection === "points-101" ? fallbackArticles101 : fallbackTips;
  return fromCms(() => sanityClient()!.fetch<Article[]>(q.articlesQuery, { collection }), fallback);
}

export async function getArticle(
  collection: "points-101" | "tips",
  slug: string,
): Promise<Article | undefined> {
  const articles = await getArticles(collection);
  return articles.find((a) => a.slug === slug);
}

/**
 * CMS-managed featured blog posts. Fallback is an empty list on purpose: we
 * never invent blog posts, and the Blog page renders a direct link to the
 * blog when neither RSS nor CMS cards are available.
 */
export async function getFeaturedBlogPosts(): Promise<FeaturedBlogPost[]> {
  return fromCms(
    () => sanityClient()!.fetch<FeaturedBlogPost[]>(q.featuredBlogPostsQuery),
    [],
    () => true,
  );
}

export async function getCardMasterFeatures(): Promise<CardMasterFeature[]> {
  return fromCms(
    () => sanityClient()!.fetch<CardMasterFeature[]>(q.cardMasterFeaturesQuery),
    fallbackCardMasterFeatures,
  );
}

export async function getCardMasterScreenshots(): Promise<CardMasterScreenshot[]> {
  return fromCms(
    () => sanityClient()!.fetch<CardMasterScreenshot[]>(q.cardMasterScreenshotsQuery),
    fallbackCardMasterScreenshots,
  );
}

export async function getImageCollection(
  key: keyof typeof fallbackImageCollections,
): Promise<RotatingImageCollection> {
  const fallback = fallbackImageCollections[key] as RotatingImageCollection;
  return fromCms(
    () => sanityClient()!.fetch<RotatingImageCollection | null>(q.imageCollectionQuery, { key }),
    fallback,
    (value) => !!value && value.images.length > 0,
  );
}

/**
 * The apps suite. CMS-managed `app` documents (with uploaded photos) when they
 * exist; otherwise the built-in registry in src/content/apps.ts.
 */
export async function getApps(): Promise<AppEntry[]> {
  return fromCms(() => sanityClient()!.fetch<AppEntry[]>(q.appsQuery), fallbackApps);
}
