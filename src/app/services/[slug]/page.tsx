import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getService, getServices } from "@/lib/cms";
import { fallbackServices } from "@/content/services";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/marketing/PageHero";
import { Icon } from "@/components/ui/Icon";
import { ConsultationCTA } from "@/components/marketing/ConsultationCTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { serviceJsonLd } from "@/lib/structured-data";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return fallbackServices.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return {};
  return {
    title: service.name,
    description: service.summary,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) notFound();

  const others = (await getServices()).filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <>
      <JsonLd
        data={serviceJsonLd({
          name: service.name,
          description: service.summary,
          path: `/services/${service.slug}`,
        })}
      />
      <PageHero
        eyebrow="Services"
        title={service.name}
        description={service.tagline}
        crumbs={[
          { name: "Services", path: "/services" },
          { name: service.name, path: `/services/${service.slug}` },
        ]}
      />

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="max-w-3xl">
              {service.description.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="mt-5 text-lg leading-relaxed text-ink/85 first:mt-0">
                  {paragraph}
                </p>
              ))}

              <h2 className="font-display mt-12 text-2xl font-bold text-lagoon-950">
                What&apos;s included
              </h2>
              <ul className="mt-5 space-y-3">
                {service.includes.map((item) => (
                  <li key={item} className="flex gap-3 leading-relaxed text-ink/85">
                    <span aria-hidden="true" className="mt-1 text-palm-600">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <h2 className="font-display mt-12 text-2xl font-bold text-lagoon-950">
                This service is a great fit if…
              </h2>
              <ul className="mt-5 space-y-3">
                {service.bestFor.map((item) => (
                  <li key={item} className="flex gap-3 leading-relaxed text-ink/85">
                    <span aria-hidden="true" className="mt-1 text-sunset-600">
                      ◆
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-12 rounded-3xl border border-sand-200 bg-sand-50 p-7">
                <h2 className="font-display text-lg font-bold text-lagoon-950">Honest boundaries</h2>
                <ul className="mt-4 space-y-2.5">
                  {service.boundaries.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink/80">
                      <span aria-hidden="true" className="mt-0.5 text-lagoon-600">
                        •
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <aside className="space-y-6" aria-label="Get started">
              <div className="rounded-3xl bg-lagoon-950 p-7 text-white lg:sticky lg:top-24">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-sunset-500">
                  <Icon name={service.icon} />
                </span>
                <h2 className="font-display mt-5 text-xl font-bold">Interested?</h2>
                <p className="mt-2 text-sm leading-relaxed text-lagoon-100">
                  Start with a free consultation — it&apos;s the easiest way to see whether this
                  service fits, and pricing is discussed there. No fixed packages, no pressure.
                </p>
                <div className="mt-5 flex flex-col gap-3">
                  <Link
                    href="/contact?topic=free-consultation"
                    className="inline-flex min-h-12 items-center justify-center rounded-full bg-sunset-600 px-6 font-semibold text-white transition-colors hover:bg-sunset-700"
                  >
                    Schedule a Free Consultation
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex min-h-12 items-center justify-center rounded-full bg-white/10 px-6 font-semibold text-white transition-colors hover:bg-white/20"
                  >
                    {service.cta}
                  </Link>
                </div>
              </div>
            </aside>
          </div>

          {others.length > 0 ? (
            <section aria-labelledby="other-services" className="mt-20">
              <h2 id="other-services" className="font-display text-xl font-bold text-lagoon-950">
                Other ways Jim can help
              </h2>
              <ul className="mt-6 grid gap-5 md:grid-cols-3">
                {others.map((other) => (
                  <li key={other.slug}>
                    <Link
                      href={`/services/${other.slug}`}
                      className="group block h-full rounded-2xl border border-lagoon-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                    >
                      <p className="font-display font-bold text-lagoon-950 group-hover:text-lagoon-700">
                        {other.name}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-ink/70">{other.tagline}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </Container>
      </section>

      <ConsultationCTA />
    </>
  );
}
