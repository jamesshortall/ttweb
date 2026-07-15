import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { RotatingImage } from "@/components/media/RotatingImage";
import { siteConfig } from "@/lib/site-config";
import type { RotatingImageCollection } from "@/lib/cms/types";

interface HomeHeroProps {
  headline: string;
  subheadline: string;
  imageCollection: RotatingImageCollection;
}

/**
 * Homepage hero: the site's most prominent rotating-image experience, with
 * Jim's portrait, the brand headline, and the two primary conversion actions.
 */
export function HomeHero({ headline, subheadline, imageCollection }: HomeHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-lagoon-950">
      <RotatingImage
        images={imageCollection.images}
        intervalMs={imageCollection.intervalMs}
        priority
        className="-z-20"
      />
      {/* Scrim keeps text readable over every rotating frame. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-lagoon-950/90 via-lagoon-950/75 to-lagoon-950/40" />

      <Container className="py-20 sm:py-28 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-lagoon-100 backdrop-blur">
              <span aria-hidden="true">✦</span> Points &amp; miles strategy, taught in plain
              language
            </p>
            <h1 className="font-display text-4xl font-bold tracking-tight text-balance text-white sm:text-5xl lg:text-6xl">
              {headline}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-lagoon-100 sm:text-xl">
              {subheadline}
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <ButtonLink href={siteConfig.cardmasterUrl} external size="lg">
                Start Using the Free App
              </ButtonLink>
              <ButtonLink href="/services" variant="inverse" size="lg">
                Get a Points Strategy
              </ButtonLink>
            </div>
            <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-lagoon-100">
              <Link
                href="/points-and-miles-101"
                className="font-medium underline decoration-sunset-400 decoration-2 underline-offset-4 hover:text-white"
              >
                Learn About Points and Miles
              </Link>
              <Link
                href="/tips-and-strategies"
                className="font-medium underline decoration-sunset-400 decoration-2 underline-offset-4 hover:text-white"
              >
                Read the Latest Tips
              </Link>
            </div>
          </div>

          <div className="relative mx-auto hidden w-full max-w-[340px] lg:block">
            <div
              className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-sunset-500/60 to-lagoon-400/60 blur-lg"
              aria-hidden="true"
            />
            <figure className="relative overflow-hidden rounded-3xl border-4 border-white/20 shadow-2xl">
              <Image
                src="/images/jim/jim-portrait.svg"
                alt="Jim Shortall, founder of Travel Technician"
                width={680}
                height={850}
                priority
                className="h-auto w-full object-cover"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-lagoon-950/80 px-5 py-3 text-sm text-lagoon-100 backdrop-blur">
                <span className="block font-display font-bold text-white">Jim Shortall</span>
                5M+ points and miles redeemed
              </figcaption>
            </figure>
          </div>
        </div>
      </Container>
    </section>
  );
}
