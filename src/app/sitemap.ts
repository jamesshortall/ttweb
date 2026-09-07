import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site-config";
import { getArticles, getServices } from "@/lib/cms";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, articles101, tips] = await Promise.all([
    getServices(),
    getArticles("points-101"),
    getArticles("tips"),
  ]);

  const staticPaths = [
    "/",
    "/about",
    "/points-and-miles-101",
    "/tips-and-strategies",
    "/services",
    "/pricing",
    "/apps",
    "/cardmaster",
    "/success-stories",
    "/resources",
    "/blog",
    "/contact",
    "/privacy-policy",
    "/terms-of-use",
    "/disclaimer",
    "/accessibility",
  ];

  const now = new Date();

  return [
    ...staticPaths.map((path) => ({
      url: absoluteUrl(path),
      lastModified: now,
      changeFrequency: (path === "/" ? "weekly" : "monthly") as "weekly" | "monthly",
      priority: path === "/" ? 1 : 0.7,
    })),
    ...services.map((service) => ({
      url: absoluteUrl(`/services/${service.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...articles101.map((article) => ({
      url: absoluteUrl(`/points-and-miles-101/${article.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...tips.map((article) => ({
      url: absoluteUrl(`/tips-and-strategies/${article.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
