import Link from "next/link";
import type { Article } from "@/lib/cms/types";

const collectionPath: Record<Article["collection"], string> = {
  "points-101": "/points-and-miles-101",
  tips: "/tips-and-strategies",
};

export function ArticleCard({ article, index }: { article: Article; index?: number }) {
  return (
    <Link
      href={`${collectionPath[article.collection]}/${article.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-lagoon-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg"
    >
      <div className="flex items-center gap-3 text-xs font-semibold">
        {typeof index === "number" ? (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-lagoon-800 font-display text-sm text-white">
            {index + 1}
          </span>
        ) : null}
        <span className="rounded-full bg-lagoon-50 px-3 py-1 text-lagoon-800">{article.category}</span>
        <span className="text-ink/60">{article.readingMinutes} min read</span>
      </div>
      <h3 className="font-display mt-4 text-xl font-bold text-lagoon-950 group-hover:text-lagoon-700">
        {article.title}
      </h3>
      <p className="mt-2 leading-relaxed text-ink/75">{article.description}</p>
      <span className="mt-auto pt-4 text-sm font-semibold text-sunset-700 group-hover:underline">
        Read the guide →
      </span>
    </Link>
  );
}
