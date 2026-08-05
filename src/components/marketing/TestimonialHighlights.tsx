import Link from "next/link";
import type { Testimonial } from "@/lib/cms/types";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TestimonialCard } from "@/components/marketing/TestimonialCard";

/**
 * Homepage testimonials strip. Prefers featured quotes, shows up to three, and
 * COLLAPSES ENTIRELY when there are none - so nothing (and certainly nothing
 * invented) appears until real, permission-confirmed testimonials exist.
 */
export function TestimonialHighlights({ testimonials }: { testimonials: Testimonial[] }) {
  const featured = testimonials.filter((t) => t.featured);
  const picks = (featured.length > 0 ? featured : testimonials).slice(0, 3);
  if (picks.length === 0) return null;

  return (
    <section aria-labelledby="testimonials-heading" className="bg-white py-24">
      <Container>
        <SectionHeading
          eyebrow="In their words"
          title="What clients say"
          description="Real feedback from travelers Jim has worked with."
          align="center"
        />
        <h2 id="testimonials-heading" className="sr-only">
          Client testimonials
        </h2>
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {picks.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            href="/testimonials"
            className="inline-flex items-center gap-1.5 font-semibold text-gold-700 hover:text-gold-800"
          >
            Read more &amp; share your own
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </Container>
    </section>
  );
}
