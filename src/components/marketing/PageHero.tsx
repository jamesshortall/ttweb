import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs, type Crumb } from "@/components/layout/Breadcrumbs";
import { RotatingImage } from "@/components/media/RotatingImage";
import type { RotatingImageItem } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  crumbs?: Crumb[];
  /** Optional rotating background collection. */
  imageCollection?: { images: RotatingImageItem[]; intervalMs: number };
  /** A single static background image. */
  image?: { src: string; alt?: string };
  children?: React.ReactNode;
}

/**
 * Inner-page hero. Deep-navy editorial band that always sits under the fixed
 * transparent header (hence the generous top padding), with an optional
 * photographic background behind a legibility scrim.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  crumbs,
  imageCollection,
  image,
  children,
}: PageHeroProps) {
  const hasPhoto = !!imageCollection || !!image;
  return (
    <section className="relative isolate overflow-hidden bg-navy-950">
      {imageCollection ? (
        <RotatingImage
          images={imageCollection.images}
          intervalMs={imageCollection.intervalMs}
          priority
          className="-z-20"
        />
      ) : image ? (
        <Image src={image.src} alt={image.alt ?? ""} fill priority sizes="100vw" className="-z-20 object-cover" />
      ) : null}

      {hasPhoto ? (
        <div aria-hidden="true" className="scrim-l absolute inset-0 -z-10" />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 opacity-90 [background:radial-gradient(60%_80%_at_85%_0%,rgba(31,147,168,0.22),transparent_60%),radial-gradient(50%_60%_at_0%_100%,rgba(199,150,58,0.14),transparent_55%)]"
        />
      )}

      <Container className={cn("pt-32 pb-16 sm:pt-36 sm:pb-20", hasPhoto && "min-h-[52vh] flex flex-col justify-end")}>
        {crumbs ? (
          <div className="mb-6 [&_a:hover]:text-white [&_a]:text-navy-100/70 [&_ol]:text-navy-100/60 [&_span[aria-current]]:text-white [&_span[aria-hidden]]:text-navy-100/40">
            <Breadcrumbs items={crumbs} />
          </div>
        ) : null}
        {eyebrow ? (
          <p className="eyebrow mb-4 flex items-center gap-3 text-gold-300">
            <span className="rule-gold" aria-hidden="true" />
            {eyebrow}
          </p>
        ) : null}
        <h1 className="max-w-3xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-navy-100/90">{description}</p>
        ) : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </Container>
    </section>
  );
}
