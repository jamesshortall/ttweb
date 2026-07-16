import Image from "next/image";
import type { RotatingImageItem } from "@/lib/cms/types";

/**
 * Full-bleed, continuously scrolling strip of destination photography. The
 * track duplicates its items so the CSS marquee loops seamlessly; it pauses on
 * hover and (via the global reduced-motion reset) holds still for users who
 * prefer reduced motion. Decorative — labelled at the section level.
 */
export function PhotoMarquee({ images }: { images: RotatingImageItem[] }) {
  const track = [...images, ...images];
  return (
    <div className="group relative flex overflow-hidden">
      <div className="flex shrink-0 animate-marquee gap-4 pr-4 group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        {track.map((image, index) => (
          <figure
            key={`${image.src}-${index}`}
            className="relative h-64 w-[22rem] shrink-0 overflow-hidden rounded-2xl sm:h-80 sm:w-[28rem]"
          >
            <Image
              src={image.src}
              alt={index < images.length ? image.alt : ""}
              aria-hidden={index >= images.length}
              fill
              sizes="28rem"
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950/50 to-transparent" />
          </figure>
        ))}
      </div>
    </div>
  );
}
