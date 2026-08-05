import type { Metadata } from "next";
import { getTestimonials } from "@/lib/cms";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/marketing/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { TestimonialCard } from "@/components/marketing/TestimonialCard";
import { TestimonialForm } from "@/components/forms/TestimonialForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { webPageJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Testimonials — Travel Technician",
  description:
    "Feedback from travelers Jim has worked with — and a place to share your own experience with Travel Technician.",
  alternates: { canonical: "/testimonials" },
  // Gated launch: keep the page out of search until there are a few real,
  // approved testimonials. Remove this line (and add the nav/footer/sitemap
  // links) when you're ready to promote it.
  robots: { index: false, follow: true },
};

export const revalidate = 3600;

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: metadata.title as string,
          description: metadata.description as string,
          path: "/testimonials",
        })}
      />
      <PageHero
        eyebrow="In their words"
        title="Client testimonials"
        description="Honest feedback from travelers Jim has worked with. Every testimonial here is real and shared with permission."
        crumbs={[{ name: "Testimonials", path: "/testimonials" }]}
      />

      <section aria-labelledby="testimonials-list-heading" className="py-16 sm:py-20">
        <Container>
          <h2 id="testimonials-list-heading" className="sr-only">
            Testimonials
          </h2>
          {testimonials.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>
          ) : (
            <div className="mx-auto max-w-2xl rounded-2xl border border-navy-100 bg-porcelain-50 p-8 text-center">
              <p className="font-display text-xl font-bold text-navy-900">
                No testimonials yet — you could be the first.
              </p>
              <p className="mt-3 leading-relaxed text-ink/70">
                Travel Technician is newer, and Jim would rather show real words from real
                travelers than anything invented. Worked with Jim already? Your experience below
                would mean a lot.
              </p>
              <div className="mt-6">
                <ButtonLink href="#share" variant="secondary">
                  Share your experience
                </ButtonLink>
              </div>
            </div>
          )}
        </Container>
      </section>

      <section id="share" aria-labelledby="share-heading" className="bg-sand-50 py-16 sm:py-20">
        <Container className="max-w-3xl">
          <SectionHeading
            eyebrow="Share your experience"
            title="Worked with Jim? Tell your story."
            description="Nothing is published automatically. Jim reviews every submission and only adds it to the site with your permission — he may reach out to confirm first."
          />
          <div className="mt-10">
            <TestimonialForm />
          </div>
        </Container>
      </section>
    </>
  );
}
