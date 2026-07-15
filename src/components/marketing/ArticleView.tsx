import Link from "next/link";
import type { Article } from "@/lib/cms/types";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/marketing/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { articleJsonLd } from "@/lib/structured-data";

const collectionMeta: Record<
  Article["collection"],
  { name: string; path: string; eyebrow: string }
> = {
  "points-101": {
    name: "Points & Miles 101",
    path: "/points-and-miles-101",
    eyebrow: "Points & Miles 101",
  },
  tips: {
    name: "Tips & Strategies",
    path: "/tips-and-strategies",
    eyebrow: "Tips & Strategies",
  },
};

/** Shared article renderer for 101 guides and tips (same content system). */
export function ArticleView({
  article,
  related,
}: {
  article: Article;
  related: Article[];
}) {
  const meta = collectionMeta[article.collection];
  const path = `${meta.path}/${article.slug}`;

  return (
    <>
      <JsonLd
        data={articleJsonLd({ title: article.title, description: article.description, path })}
      />
      <PageHero
        eyebrow={`${meta.eyebrow} · ${article.category}`}
        title={article.title}
        description={article.description}
        crumbs={[
          { name: meta.name, path: meta.path },
          { name: article.title, path },
        ]}
      >
        <p className="text-sm font-medium text-lagoon-200">{article.readingMinutes} minute read</p>
      </PageHero>

      <article className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          {article.sections.map((section) => (
            <section key={section.heading} className="mt-12 first:mt-0">
              <h2 className="font-display text-2xl font-bold text-lagoon-950">{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 48)} className="mt-4 leading-relaxed text-ink/85">
                  {paragraph}
                </p>
              ))}
              {section.bullets ? (
                <ul className="mt-4 space-y-3">
                  {section.bullets.map((bullet) => (
                    <li key={bullet.slice(0, 48)} className="flex gap-3 leading-relaxed text-ink/85">
                      <span aria-hidden="true" className="mt-1 shrink-0 text-sunset-600">
                        ◆
                      </span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}

          <aside
            aria-label="Key takeaways"
            className="mt-14 rounded-3xl border border-lagoon-200 bg-lagoon-50 p-7"
          >
            <h2 className="font-display text-lg font-bold text-lagoon-950">Key takeaways</h2>
            <ul className="mt-4 space-y-2.5">
              {article.keyTakeaways.map((takeaway) => (
                <li key={takeaway.slice(0, 48)} className="flex gap-3 leading-relaxed text-ink/85">
                  <span aria-hidden="true" className="mt-0.5 text-palm-600">
                    ✓
                  </span>
                  {takeaway}
                </li>
              ))}
            </ul>
          </aside>

          <p className="mt-8 text-sm leading-relaxed text-ink/60">
            Educational content only — not financial advice. Programs and offers change; verify
            current terms with the provider. See the{" "}
            <Link href="/disclaimer" className="underline hover:text-lagoon-900">
              full disclaimer
            </Link>
            .
          </p>
        </Container>

        {related.length > 0 ? (
          <Container className="mt-16 max-w-5xl">
            <h2 className="font-display text-xl font-bold text-lagoon-950">Keep learning</h2>
            <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((rel) => (
                <li key={rel.slug}>
                  <Link
                    href={`${collectionMeta[rel.collection].path}/${rel.slug}`}
                    className="group block h-full rounded-2xl border border-lagoon-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <p className="text-xs font-semibold text-lagoon-700">{rel.category}</p>
                    <p className="font-display mt-1.5 font-bold text-lagoon-950 group-hover:text-lagoon-700">
                      {rel.title}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        ) : null}
      </article>
    </>
  );
}
