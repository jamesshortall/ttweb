import { XMLParser } from "fast-xml-parser";

/**
 * Minimal RSS 2.0 / Atom reader for the Travel Technician blog feed.
 *
 * Fetched server-side with ISR-style caching (1 hour) so the blog is never
 * scraped or hit during normal page rendering. Any failure returns an empty
 * list and the Blog page falls back to CMS/fallback featured cards.
 */

export interface FeedItem {
  title: string;
  url: string;
  publishedAt: string | null;
  excerpt: string | null;
}

function toArray<T>(value: T | T[] | undefined): T[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

function text(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  if (value && typeof value === "object" && "#text" in value) {
    return String((value as Record<string, unknown>)["#text"]).trim();
  }
  return "";
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(value: string, max = 180): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max).replace(/\s+\S*$/, "")}…`;
}

export function parseFeed(xml: string, limit = 6): FeedItem[] {
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
  let doc: Record<string, unknown>;
  try {
    doc = parser.parse(xml) as Record<string, unknown>;
  } catch {
    return [];
  }

  const items: FeedItem[] = [];
  type RawItem = Record<string, unknown>;

  const rss = doc.rss as { channel?: { item?: RawItem | RawItem[] } } | undefined;
  if (rss?.channel) {
    for (const raw of toArray<RawItem>(rss.channel.item)) {
      const title = text(raw.title);
      const url = text(raw.link);
      if (!title || !url) continue;
      const description = stripHtml(text(raw.description));
      items.push({
        title,
        url,
        publishedAt: text(raw.pubDate) || null,
        excerpt: description ? truncate(description) : null,
      });
    }
  }

  const feed = doc.feed as { entry?: RawItem | RawItem[] } | undefined;
  if (feed && items.length === 0) {
    for (const raw of toArray<RawItem>(feed.entry)) {
      const title = text(raw.title);
      const links = toArray<RawItem>(raw.link as RawItem | RawItem[] | undefined);
      const alternate =
        links.find((l) => l["@_rel"] === "alternate" || l["@_rel"] === undefined) ?? links[0];
      const url = alternate ? text(alternate["@_href"]) : "";
      if (!title || !url) continue;
      const summary = stripHtml(text(raw.summary) || text(raw.content));
      items.push({
        title,
        url,
        publishedAt: text(raw.published) || text(raw.updated) || null,
        excerpt: summary ? truncate(summary) : null,
      });
    }
  }

  return items.slice(0, limit);
}

export async function fetchBlogFeed(feedUrl: string, limit = 6): Promise<FeedItem[]> {
  try {
    const response = await fetch(feedUrl, {
      headers: { Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml" },
      // Cache for an hour — never fetched per-request.
      next: { revalidate: 3600 },
    });
    if (!response.ok) return [];
    return parseFeed(await response.text(), limit);
  } catch {
    return [];
  }
}
