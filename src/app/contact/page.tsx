import type { Metadata } from "next";
import { Suspense } from "react";
import { siteConfig } from "@/lib/site-config";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/marketing/PageHero";
import { ContactForm } from "@/components/forms/ContactForm";
import { ObfuscatedEmail } from "@/components/ui/ObfuscatedEmail";
import { ExternalTag } from "@/components/ui/ExternalTag";
import { CalendlyButton } from "@/components/scheduling/CalendlyButton";
import { JsonLd } from "@/components/seo/JsonLd";
import { webPageJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Contact Jim — Free Consultations and Points Questions",
  description:
    "Reach Travel Technician: schedule a free points-and-miles consultation, ask a strategy question, or get CardMaster support. Jim reads every message personally.",
  alternates: { canonical: "/contact" },
};

interface Props {
  searchParams: Promise<{ topic?: string }>;
}

export default async function ContactPage({ searchParams }: Props) {
  const { topic } = await searchParams;

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: metadata.title as string,
          description: metadata.description as string,
          path: "/contact",
        })}
      />
      <PageHero
        eyebrow="Contact"
        title="Let's talk about your points"
        description="Whether you're starting from zero or sitting on a mountain of miles, the conversation starts the same way. Jim reads every message personally and typically replies within one to two business days."
        crumbs={[{ name: "Contact", path: "/contact" }]}
      />

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="max-w-2xl">
              <h2 className="font-display text-2xl font-bold text-lagoon-950">Send a message</h2>
              <p className="mt-2 text-ink/75">
                Required fields are marked by their labels; everything you send is used only to
                answer your inquiry.
              </p>
              <div className="mt-8">
                <Suspense>
                  <ContactForm defaultCategory={topic} />
                </Suspense>
              </div>
            </div>

            <aside className="space-y-6" aria-label="Other ways to connect">
              <div className="rounded-3xl bg-lagoon-950 p-7 text-white">
                <h2 className="font-display text-xl font-bold">Prefer to just book a time?</h2>
                <p className="mt-2 text-sm leading-relaxed text-lagoon-100">
                  The free consultation is a relaxed 30-minute conversation about where you are and
                  what&apos;s possible. No preparation needed.
                </p>
                <div className="mt-5">
                  <CalendlyButton className="w-full" />
                </div>
              </div>

              <div className="rounded-3xl border border-lagoon-100 bg-white p-7">
                <h2 className="font-display text-lg font-bold text-lagoon-950">Email</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink/75">
                  The form is the fastest route, but email works too:
                </p>
                <p className="mt-3">
                  <ObfuscatedEmail
                    user={siteConfig.contactEmail.user}
                    domain={siteConfig.contactEmail.domain}
                  />
                </p>
              </div>

              <div className="rounded-3xl border border-lagoon-100 bg-white p-7">
                <h2 className="font-display text-lg font-bold text-lagoon-950">Social</h2>
                <ul className="mt-3 space-y-2.5 text-sm">
                  <li className="flex items-center justify-between gap-2">
                    <a
                      href={siteConfig.instagramUrl}
                      rel="noopener noreferrer"
                      className="font-semibold text-lagoon-700 underline hover:text-lagoon-900"
                    >
                      Instagram — @the_travel_technician
                    </a>
                    <ExternalTag label="External" />
                  </li>
                  <li className="flex items-center justify-between gap-2">
                    <a
                      href={siteConfig.facebookUrl}
                      rel="noopener noreferrer"
                      className="font-semibold text-lagoon-700 underline hover:text-lagoon-900"
                    >
                      Facebook — TravelTechnician
                    </a>
                    <ExternalTag label="External" />
                  </li>
                </ul>
              </div>

              <div className="rounded-3xl border border-sand-200 bg-sand-50 p-7 text-sm leading-relaxed text-ink/75">
                <p>
                  <strong className="text-lagoon-950">CardMaster support:</strong> choose the
                  “CardMaster support” category in the form and include the email your account was
                  registered with (never your password).
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
