"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { RotatingImageItem } from "@/lib/cms/types";
import { shuffledRotation } from "@/lib/utils";
import { useReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

interface RotatingImageProps {
  images: RotatingImageItem[];
  /** Stable rotation interval; ~60s by default (site-wide design decision). */
  intervalMs?: number;
  className?: string;
  /** Vary the transition: crossfade always, plus optional slow zoom / drift. */
  effect?: "fade" | "fade-zoom" | "fade-slide";
  /** Only the first image of above-the-fold instances should be priority. */
  priority?: boolean;
  sizes?: string;
}

/**
 * Accessible rotating imagery.
 *
 * - The first frame is the collection's first image (deterministic, so SSR
 *   markup matches hydration and the LCP image is stable/preloadable); from
 *   the first rotation onward the order is randomized, never repeating the
 *   same image twice in succession.
 * - Stable ~60s interval; pauses while the tab is hidden.
 * - Static single image under prefers-reduced-motion.
 * - Absolute-fill layers inside a sized parent — zero layout shift.
 * - Only the current/next images are mounted; the rest lazy-load on rotation.
 * - Images sit behind readable overlays; alt text is exposed on the visible
 *   frame only.
 */
export function RotatingImage({
  images,
  intervalMs = 60_000,
  className,
  effect = "fade-zoom",
  priority = false,
  sizes = "100vw",
}: RotatingImageProps) {
  const [order, setOrder] = useState<number[]>(() =>
    Array.from({ length: images.length }, (_, i) => i),
  );
  const [position, setPosition] = useState(0);
  const [hasShuffled, setHasShuffled] = useState(false);
  const reducedMotion = useReducedMotion();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const advance = useCallback(() => {
    const current = order[position] ?? null;
    const nextPosition = position + 1;
    if (!hasShuffled || nextPosition >= order.length) {
      // Shuffle (first rotation, then every completed cycle); never let the
      // new sequence start with the image currently on screen.
      setOrder(shuffledRotation(images.length, current));
      setPosition(0);
      setHasShuffled(true);
    } else {
      setPosition(nextPosition);
    }
  }, [order, position, hasShuffled, images.length]);

  useEffect(() => {
    if (reducedMotion || images.length < 2) return;

    const start = () => {
      if (timerRef.current === null) {
        timerRef.current = setInterval(advance, intervalMs);
      }
    };
    const stop = () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
    const onVisibility = () => {
      // Pause rotation entirely while the tab is hidden.
      if (document.hidden) stop();
      else start();
    };

    if (!document.hidden) start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [advance, intervalMs, reducedMotion, images.length]);

  if (images.length === 0) return null;

  const activeIndex = order[position] ?? 0;
  const nextIndex = order[(position + 1) % order.length] ?? 0;
  // Mount only current + likely-next frame; the rest load when rotated to.
  const mounted = new Set<number>([activeIndex]);
  if (!reducedMotion && images.length > 1) mounted.add(nextIndex);

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      {images.map((image, index) =>
        mounted.has(index) ? (
          <div
            key={image.src}
            aria-hidden={index !== activeIndex}
            className={cn(
              "absolute inset-0 transition-opacity duration-[2500ms] ease-in-out",
              index === activeIndex ? "opacity-100" : "opacity-0",
              !reducedMotion &&
                effect === "fade-zoom" &&
                index === activeIndex &&
                "motion-safe:animate-slow-zoom",
              !reducedMotion &&
                effect === "fade-slide" &&
                index === activeIndex &&
                "motion-safe:animate-fade-in",
            )}
          >
            <Image
              src={image.src}
              alt={index === activeIndex ? image.alt : ""}
              fill
              sizes={sizes}
              priority={priority && index === activeIndex && !hasShuffled}
              className="object-cover"
            />
          </div>
        ) : null,
      )}
    </div>
  );
}
