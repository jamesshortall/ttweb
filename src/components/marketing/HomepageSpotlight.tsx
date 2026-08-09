import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import type { HomepageSpotlight as Spotlight } from "@/lib/cms/types";

/**
 * Homepage spotlight: features one existing item chosen in Site Settings.
 * Renders nothing when no item is selected, so the section collapses entirely
 * rather than showing an empty placeholder.
 */
export function HomepageSpotlight({ spotlight }: { spotlight?: Spotlight | null }) {
  if (!spotlight) return null;

  return (
    <section aria-labelledby="spotlight-heading" className="bg-white py-16 sm:py-20">
      <Container>
        <div className="overflow-hidden rounded-3xl bg-lagoon-950 px-6 py-10 text-white sm:px-12 sm:py-14">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm font-semibold uppercase tracking-wide text-gold-400">
              {spotlight.eyebrow}
            </p>
            <span className="rounded-full bg-white/10 px-3 py-0.5 text-xs font-semibold text-white/80">
              {spotlight.kindLabel}
            </span>
          </div>
          <h2
            id="spotlight-heading"
            className="mt-4 font-display text-3xl font-bold sm:text-4xl"
          >
            {spotlight.title}
          </h2>
          {spotlight.blurb ? (
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/80">
              {spotlight.blurb}
            </p>
          ) : null}
          <div className="mt-8">
            <ButtonLink
              href={spotlight.href}
              external={spotlight.external}
              variant="primary"
              size="lg"
            >
              {spotlight.external ? "Open" : "Read more"}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
