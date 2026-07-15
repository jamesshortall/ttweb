import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { CalendlyButton } from "@/components/scheduling/CalendlyButton";

/**
 * Final conversion band used across the site. The Calendly button loads no
 * third-party code until clicked; without a configured Calendly URL it routes
 * to the contact form.
 */
export function ConsultationCTA({
  heading = "Ready to see what your points can really do?",
  body = "Start with a free consultation. Bring your questions, your balances (or none at all), and the trip you're dreaming about — leave with a clear picture of your options and next steps.",
}: {
  heading?: string;
  body?: string;
}) {
  return (
    <section aria-labelledby="consult-heading" className="relative isolate overflow-hidden bg-lagoon-950 py-20">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_right,rgba(249,93,23,0.3),transparent_50%),radial-gradient(ellipse_at_top_left,rgba(63,175,191,0.25),transparent_55%)]"
      />
      <Container className="text-center">
        <h2
          id="consult-heading"
          className="font-display mx-auto max-w-2xl text-3xl font-bold text-balance text-white sm:text-4xl"
        >
          {heading}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-lagoon-100">{body}</p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <CalendlyButton />
          <ButtonLink href="/contact" variant="inverse" size="lg">
            Contact Jim for Details
          </ButtonLink>
        </div>
        <p className="mt-6 text-sm text-lagoon-200/90">
          Free consultations are educational conversations — never a sales pitch, never financial
          advice.
        </p>
      </Container>
    </section>
  );
}
