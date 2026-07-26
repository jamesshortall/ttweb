import Image from "next/image";

/**
 * Presentational responsive image creative. Reserves the creative's aspect
 * ratio (width/height) so the image itself never shifts as it loads, and
 * lazy-loads by default (AdSlot marks above-the-fold instances eager).
 */
export interface ImageCreative {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export function ResponsiveImageAd({
  creative,
  headline,
  eager = false,
}: {
  creative: ImageCreative;
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
