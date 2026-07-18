import type { FeedItem } from "@/lib/rss";
import type { FeaturedBlogPost } from "@/lib/cms/types";
import { siteConfig } from "@/lib/site-config";
import { ExternalTag } from "@/components/ui/ExternalTag";

export interface BlogCardItem {
  title: string;
  url: string;
  excerpt: string | null;
  publishedAt: string | null;
}

export function toBlogCards(items: FeedItem[] | FeaturedBlogPost[]): BlogCardItem[] {
  return items.map((item) => ({
    title: item.title,
    url: item.url,
    excerpt: item.excerpt ?? null,
    publishedAt: ("publishedAt" in item ? item.publishedAt : null) ?? null,
  }));
}

function formatDate(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(date);
}

/**
 * Article cards for the Travel Technician blog (a separate site). Links open
 * in the same tab by design, and every card is labelled as leading to the
 * blog so the hand-off is never a surprise.
 */
export function BlogCards({ items }: { items: BlogCardItem[] }) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const date = formatDate(item.publishedAt);
        return (
          <li key={item.url}>
            <a
              href={item.url}
              target="_blank" rel="noopener noreferrer"
              className="group flex h-full flex-col rounded-2xl border border-lagoon-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg"
            >
              <div className="flex items-center justify-between gap-3">
                <ExternalTag label="Travel Technician blog" />
                {date ? <span className="text-xs text-ink/70">{date}</span> : null}
              </div>
              <h3 className="font-display mt-4 text-lg font-bold text-lagoon-950 group-hover:text-lagoon-700">
                {item.title}
              </h3>
              {item.excerpt ? (
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink/75">
                  {item.excerpt}
                </p>
              ) : null}
              <span className="mt-auto pt-4 text-sm font-semibold text-sunset-700 group-hover:underline">
                Read on the blog →
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

/** Shown when neither RSS nor CMS featured posts are available — never fake posts. */
export function BlogFallbackCard() {
  return (
    <div className="rounded-3xl border border-lagoon-100 bg-white p-8 text-center shadow-sm sm:p-12">
      <p className="font-display text-2xl font-bold text-lagoon-950">Fresh tips are on the blog</p>
      <p className="mx-auto mt-3 max-w-xl leading-relaxed text-ink/80">
        The Travel Technician blog is a separate site where Jim publishes ongoing points news,
        strategy write-ups, and redemption stories. Recent-article cards will appear here
        automatically once the blog feed is connected.
      </p>
      <a
        href={siteConfig.blogUrl}
        target="_blank" rel="noopener noreferrer"
        className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-lagoon-800 px-7 font-semibold text-white transition-colors hover:bg-lagoon-900"
      >
        Visit the Travel Technician Blog
      </a>
    </div>
  );
}
