"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Accessible, performance-conscious video ad.
 *
 * - Never autoplays with sound (never autoplays at all — safest, and honors
 *   reduced-motion by default).
 * - Loads the video source only when the slot nears the viewport
 *   (IntersectionObserver + preload="none"); before that it shows just the
 *   poster, so it costs nothing on initial load.
 * - Native controls (keyboard-accessible), captions track when speech is
 *   present, responsive width, and a reserved 16:9 box to avoid layout shift.
 */
export function VideoAd({
  src,
  poster,
  captionsUrl,
  title,
}: {
  src: string;
  poster?: string;
  captionsUrl?: string;
  title?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    if (near) return;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [near]);

  return (
    <div ref={ref} className="relative aspect-video w-full overflow-hidden rounded-lg bg-navy-950">
      <video
        className="h-full w-full"
        controls
        preload="none"
        playsInline
        muted
        poster={poster}
        aria-label={title ?? "Video advertisement"}
      >
        {near ? <source src={src} /> : null}
        {captionsUrl ? <track kind="captions" src={captionsUrl} label="Captions" default /> : null}
      </video>
    </div>
  );
}
