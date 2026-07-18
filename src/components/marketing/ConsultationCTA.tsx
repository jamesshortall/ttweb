import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { CalendlyButton } from "@/components/scheduling/CalendlyButton";

/**
 * Full-bleed closing call to action over a photograph. The Calendly button
 * loads no third-party code until clicked; with no Calendly URL configured it
 * routes to the contact form.
 */
export function ConsultationCTA({
  heading = "Ready to see what your points can really do?",
  body = "Start with a free consultation. Bring your questions, your balances (or none at all), and the trip you're dreaming about — leave with a clear picture of your options and next steps.",
  image = "/images/travel/palm-beach.jpg",
}: {
  heading?: string;
  body?: string;
  image?: string;
}) {
  return (
    <section aria-labelledby="consult-heading" className="relative isolate overflow-hidden bg-navy-950">
      <Image src={image} alt="" fill sizes="100vw" className="-z-20 object-cover" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-navy-950/78" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(50%_60%_at_50%_100%,rgba(199,150,58,0.2),transparent_60%)]"
      />
      <Container className="py-24 text-center">
        <Reveal>
          <p className="eyebrow mb-5 flex items-center justify-center gap-3 text-gold-300">
            <span className="rule-gold" aria-hidden="true" />
            Free consultation
          </p>
          <h2
            id="consult-heading"
            className="mx-auto max-w-3xl text-balance text-3xl font-semibold text-white sm:text-4xl md:text-5xl"
          >
            {heading}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-navy-100/90">{body}</p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <CalendlyButton />
            <ButtonLink href="/contact" variant="inverse" size="lg">
              Contact Jim for Details
            </ButtonLink>
          </div>
          <p className="mt-6 text-sm text-navy-200/80">
            An educational conversation — never a sales pitch, never financial advice.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
