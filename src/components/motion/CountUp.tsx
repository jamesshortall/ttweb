"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/hooks";

interface CountUpProps {
  /** Target number to count to. */
  value: number;
  durationMs?: number;
  prefix?: string;
  suffix?: string;
  /** Renders value/1_000_000 + "M" style compaction when true. */
  compactMillions?: boolean;
}

function format(value: number, compactMillions: boolean): string {
  if (compactMillions && value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}M`;
  }
  return new Intl.NumberFormat("en-US").format(Math.round(value));
}

/**
 * Animated number that counts up once when scrolled into view. Under reduced
 * motion (or without IntersectionObserver) it renders the final value at once.
 */
export function CountUp({
  value,
  durationMs = 1600,
  prefix = "",
  suffix = "",
  compactMillions = false,
}: CountUpProps) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement | null>(null);
  // Initialise to the final value so the real number is always present (for
  // SSR, no-JS, SEO, and tests). The count-up is a progressive enhancement
  // that runs when the element scrolls into view.
  const [display, setDisplay] = useState(value);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const run = () => {
      if (started.current || reducedMotion) return;
      started.current = true;
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / durationMs, 1);
        // easeOutCubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(progress >= 1 ? value : value * eased);
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if (typeof IntersectionObserver === "undefined") {
      const id = requestAnimationFrame(run);
      return () => cancelAnimationFrame(id);
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          run();
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [value, durationMs, reducedMotion]);

  return (
    <span ref={ref}>
      {prefix}
      {format(display, compactMillions)}
      {suffix}
    </span>
  );
}
