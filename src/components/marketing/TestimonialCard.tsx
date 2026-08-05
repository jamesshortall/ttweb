import type { Testimonial } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

function Stars({ rating }: { rating: number }) {
  const clamped = Math.max(1, Math.min(5, Math.round(rating)));
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${clamped} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          aria-hidden="true"
          className={cn("h-4 w-4", i < clamped ? "text-gold-500" : "text-navy-200")}
          fill="currentColor"
        >
          <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.79L10 14.77l-5.2 2.73.99-5.79-4.21-4.1 5.82-.85L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

/**
 * A single published testimonial. Rendered only for permission-confirmed
 * quotes returned by the CMS, so it never displays anything unverified.
 */
export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="flex h-full flex-col rounded-2xl border border-navy-100 bg-white p-6 shadow-sm">
      {testimonial.rating ? (
        <div className="mb-3">
          <Stars rating={testimonial.rating} />
        </div>
      ) : null}
      <blockquote className="flex-1">
        <p className="text-lg leading-relaxed text-ink/80">
          <span aria-hidden="true" className="text-gold-500">
            &ldquo;
          </span>
          {testimonial.quote}
          <span aria-hidden="true" className="text-gold-500">
            &rdquo;
          </span>
        </p>
      </blockquote>
      <figcaption className="mt-5">
        <span className="block font-display font-bold text-navy-900">
          {testimonial.attribution}
        </span>
        {testimonial.context ? (
          <span className="mt-0.5 block text-sm text-navy-600">{testimonial.context}</span>
        ) : null}
      </figcaption>
    </figure>
  );
}
