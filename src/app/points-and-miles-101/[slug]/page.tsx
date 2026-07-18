import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticle, getArticles } from "@/lib/cms";
import { fallbackArticles101 } from "@/content/articles-101";
import { ArticleView } from "@/components/marketing/ArticleView";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return fallbackArticles101.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle("points-101", slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/points-and-miles-101/${article.slug}` },
  };
}

export default async function Article101Page({ params }: Props) {
  const { slug } = await params;
  const article = await getArticle("points-101", slug);
  if (!article) notFound();

  const all = await getArticles("points-101");
  const related = all.filter((a) => a.slug !== article.slug).slice(0, 3);

  return <ArticleView article={article} related={related} />;
}
