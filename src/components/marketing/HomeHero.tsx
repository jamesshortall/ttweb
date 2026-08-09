import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { RotatingImage } from "@/components/media/RotatingImage";
import type { RotatingImageItem } from "@/lib/cms/types";

interface HomeHeroProps {
  headline: string;
  subheadline: string;
  images: RotatingImageItem[];
}

/**
 * Full-bleed editorial hero: rotating destination photography with a slow
 * ken-burns drift, a left-weighted dark scrim for legibility, the brand
 * tagline, a large serif headline, and the two primary conversion actions.
 */
export function HomeHero({ headline, subheadline, images }: HomeHeroProps) {
  return (
    <section className="relative isolate flex min-h-[92vh] items-center overflow-hidden bg-navy-950">
      <RotatingImage images={images} intervalMs={7000} priority className="-z-20" sizes="100vw" />
      <div aria-hidden="true" className="scrim-l absolute inset-0 -z-10" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950/70 via-transparent to-navy-950/30"
      />

      <div className="mx-auto w-full max-w-7xl px-4 pt-28 pb-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="animate-fade-in eyebrow flex items-center gap-3 text-gold-300">
            <span className="h-px w-8 bg-gold-400" aria-hidden="true" />
            Smarter Travel. Better Rewards.
          </p>
          <h1 className="mt-6 text-balance text-5xl font-semibold leading-[1.04] tracking-tight text-white sm:text-6xl lg:text-7xl">
            {headline}
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-navy-100/90 sm:text-xl">
            {subheadline}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <ButtonLink href="/apps" size="lg">
              Start Using Our Free Apps
            </ButtonLink>
            <ButtonLink href="/services" variant="inverse" size="lg">
              Get a Points Strategy
            </ButtonLink>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-2 text-sm text-navy-100/80">
            <Link href="/points-and-miles-101" className="font-medium underline decoration-gold-400/70 decoration-2 underline-offset-4 hover:text-white">
              Learn about points &amp; miles
            </Link>
            <Link href="/tips-and-strategies" className="font-medium underline decoration-gold-400/70 decoration-2 underline-offset-4 hover:text-white">
              Read the latest tips
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-6 mx-auto hidden w-full max-w-7xl px-8 sm:block"
      >
        <span className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-white/70">
          <span className="h-10 w-px animate-pulse bg-gradient-to-b from-gold-400 to-transparent" />
          Scroll to explore
        </span>
      </div>
    </section>
  );
}
