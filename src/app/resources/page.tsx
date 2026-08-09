import type { Metadata } from "next";
import Link from "next/link";
import { getResources } from "@/lib/cms";
import type { Resource } from "@/lib/cms/types";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/marketing/PageHero";
import { ExternalTag } from "@/components/ui/ExternalTag";
import { ConsultationCTA } from "@/components/marketing/ConsultationCTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { webPageJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Resources — Beginner-Friendly Points and Miles Library",
  description:
    "A curated library of loyalty program tips and beginner guides: getting started, transferable points, credit card benefits, award travel basics, points tracking, and CardMaster how-tos.",
  alternates: { canonical: "/resources" },
};

export const revalidate = 3600;

const isExternal = (resource: Resource) => resource.kind === "external" || resource.kind === "blog";
const isDownload = (resource: Resource) => resource.kind === "download";

/** For a download, prefer the uploaded PDF; fall back to a typed link. */
const downloadHref = (resource: Resource) => resource.fileUrl ?? resource.href;

function PdfTag() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-lagoon-100 px-2.5 py-0.5 text-xs font-semibold text-lagoon-800">
      PDF
    </span>
  );
}

function ResourceCard({ resource }: { resource: Resource }) {
  const download = isDownload(resource);
  const external = isExternal(resource);

  const inner = (
    <>
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-lg font-bold text-lagoon-950 group-hover:text-lagoon-700">
          {resource.title}
        </h3>
        {external ? (
          <ExternalTag label={resource.kind === "blog" ? "Blog" : "External"} />
        ) : download ? (
          <PdfTag />
        ) : null}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-ink/75">{resource.description}</p>
      {download ? (
        <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-sunset-700 px-4 py-2 text-sm font-semibold text-white transition-colors group-hover:bg-sunset-800">
          Download Now
          <span aria-hidden="true">↓</span>
        </span>
      ) : (
        <span className="mt-4 block text-sm font-semibold text-sunset-700 group-hover:underline">
          {external ? "Open (leaves this site) →" : "Read →"}
        </span>
      )}
    </>
  );

  const classes =
    "group block h-full rounded-2xl border border-lagoon-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg";

  // Downloads and external links leave the site / open the file in a new tab.
  if (download) {
    return (
      <a href={downloadHref(resource)} target="_blank" rel="noopener noreferrer" className={classes}>
        {inner}
      </a>
    );
  }

  return external ? (
    <a href={resource.href} target="_blank" rel="noopener noreferrer" className={classes}>
      {inner}
    </a>
  ) : (
    <Link href={resource.href} className={classes}>
      {inner}
    </Link>
  );
}

export default async function ResourcesPage() {
  const resources = await getResources();
  const categories = [...new Set(resources.map((r) => r.category))];

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: metadata.title as string,
          description: metadata.description as string,
          path: "/resources",
        })}
      />
      <PageHero
        eyebrow="Resources"
        title="The points and miles library"
        description="Guides, checklists, tools, and links — organized by topic and kept beginner-friendly. Anything that leaves the Travel Technician website is clearly marked."
        crumbs={[{ name: "Resources", path: "/resources" }]}
      >
        <nav aria-label="Resource categories">
          <ul className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <li key={category}>
                <a
                  href={`#${category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                  className="inline-block rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-medium text-lagoon-100 hover:bg-white/20 hover:text-white"
                >
                  {category}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>

      <section className="py-16 sm:py-20">
        <Container>
          {categories.map((category) => (
            <section
              key={category}
              id={category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
              aria-label={category}
              className="mt-14 scroll-mt-24 first:mt-0"
            >
              <h2 className="font-display text-2xl font-bold text-lagoon-950">{category}</h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {resources
                  .filter((resource) => resource.category === category)
                  .map((resource) => (
                    <ResourceCard key={resource.category + resource.title} resource={resource} />
                  ))}
              </div>
            </section>
          ))}
        </Container>
      </section>

      <ConsultationCTA
        heading="Can't find what you're looking for?"
        body="Ask directly — if it's a common question, the answer usually becomes the next resource."
      />
    </>
  );
}
