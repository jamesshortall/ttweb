import { Container } from "@/components/ui/Container";
import { Breadcrumbs, type Crumb } from "@/components/layout/Breadcrumbs";
import { RotatingImage } from "@/components/media/RotatingImage";
import type { RotatingImageCollection } from "@/lib/cms/types";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  crumbs?: Crumb[];
  /** Optional rotating background collection for visually rich pages. */
  imageCollection?: RotatingImageCollection;
  children?: React.ReactNode;
}

/**
 * Inner-page hero. With an image collection it renders a full-bleed rotating
 * background behind a dark scrim (readability on every frame); without one it
 * uses a layered brand gradient.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  crumbs,
  imageCollection,
  children,
}: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-lagoon-950">
      {imageCollection ? (
        <>
          <RotatingImage
            images={imageCollection.images}
            intervalMs={imageCollection.intervalMs}
            priority
            className="-z-20"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-lagoon-950/85 via-lagoon-950/70 to-lagoon-950/85" />
        </>
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(63,175,191,0.35),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(249,93,23,0.18),transparent_50%)]"
        />
      )}
      <Container className="py-16 sm:py-20">
        {crumbs ? (
          <div className="mb-6 [&_a]:text-lagoon-100/80 [&_a:hover]:text-white [&_ol]:text-lagoon-100/70 [&_span[aria-current]]:text-white [&_span[aria-hidden]]:text-lagoon-100/50">
            <Breadcrumbs items={crumbs} />
          </div>
        ) : null}
        {eyebrow ? (
          <p className="mb-3 text-sm font-bold tracking-widest text-sunset-300 uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-display max-w-3xl text-4xl font-bold tracking-tight text-balance text-white sm:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-lagoon-100">{description}</p>
        ) : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </Container>
    </section>
  );
}
