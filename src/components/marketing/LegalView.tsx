import type { LegalDocument } from "@/content/legal";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/marketing/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { webPageJsonLd } from "@/lib/structured-data";

/** Shared renderer for the four legal/policy documents. */
export function LegalView({ document }: { document: LegalDocument }) {
  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: document.title,
          description: document.description,
          path: `/${document.slug}`,
        })}
      />
      <PageHero
        eyebrow="Legal"
        title={document.title}
        crumbs={[{ name: document.title, path: `/${document.slug}` }]}
      >
        <p className="text-sm font-medium text-lagoon-200">Last updated: {document.lastUpdated}</p>
      </PageHero>

      <article className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <p className="text-lg leading-relaxed text-ink/85">{document.intro}</p>
          {document.sections.map((section) => (
            <section key={section.heading} className="mt-10">
              <h2 className="font-display text-xl font-bold text-lagoon-950">{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 48)} className="mt-4 leading-relaxed text-ink/85">
                  {paragraph}
                </p>
              ))}
              {section.bullets ? (
                <ul className="mt-4 space-y-2.5">
                  {section.bullets.map((bullet) => (
                    <li
                      key={bullet.slice(0, 48)}
                      className="flex gap-3 leading-relaxed text-ink/85"
                    >
                      <span aria-hidden="true" className="mt-1 shrink-0 text-lagoon-600">
                        •
                      </span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </Container>
      </article>
    </>
  );
}
