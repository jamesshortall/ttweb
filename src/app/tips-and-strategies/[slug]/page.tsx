import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticle, getArticles } from "@/lib/cms";
import { fallbackTips } from "@/content/tips";
import { ArticleView } from "@/components/marketing/ArticleView";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return fallbackTips.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle("tips", slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/tips-and-strategies/${article.slug}` },
  };
}

export default async function TipPage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticle("tips", slug);
  if (!article) notFound();

  const all = await getArticles("tips");
  const related = all.filter((a) => a.slug !== article.slug).slice(0, 3);

  return <ArticleView article={article} related={related} />;
}
