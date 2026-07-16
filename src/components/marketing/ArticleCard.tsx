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
      className="group flex h-full flex-col rounded-2xl border border-navy-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-xl hover:shadow-navy-950/10"
    >
      <div className="flex items-center gap-3 text-xs font-semibold">
        {typeof index === "number" ? (
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-900 font-serif text-sm text-gold-300">
            {String(index + 1).padStart(2, "0")}
          </span>
        ) : null}
        <span className="rounded-full bg-teal-50 px-3 py-1 text-teal-800">{article.category}</span>
        <span className="text-ink/50">{article.readingMinutes} min</span>
      </div>
      <h3 className="mt-4 text-xl font-semibold text-navy-900 transition-colors group-hover:text-teal-700">
        {article.title}
      </h3>
      <p className="mt-2 leading-relaxed text-ink/70">{article.description}</p>
      <span className="mt-auto flex items-center gap-1.5 pt-5 text-sm font-semibold text-gold-700">
        Read the guide
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </Link>
  );
}
