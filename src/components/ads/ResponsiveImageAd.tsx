import Image from "next/image";
import type { AdCreative } from "@/lib/ads/types";

/**
 * Presentational responsive image creative. Reserves the creative's aspect
 * ratio (width/height) so the slot never shifts layout as the image loads, and
 * lazy-loads by default (AdSlot marks above-the-fold instances eager).
 */
export function ResponsiveImageAd({
  creative,
  headline,
  eager = false,
}: {
  creative: AdCreative;
  headline?: string;
  eager?: boolean;
}) {
  const width = creative.width ?? 728;
  const height = creative.height ?? 180;
  return (
    <Image
      src={creative.src}
      alt={creative.alt || headline || ""}
      width={width}
      height={height}
      loading={eager ? "eager" : "lazy"}
      sizes="(max-width: 768px) 100vw, 728px"
      className="h-auto w-full rounded-lg object-cover"
    />
  );
}
