import type { RotatingImageCollection } from "@/lib/cms/types";

/**
 * Rotating-image collections — editable in Sanity (imageCollection documents).
 *
 * All current images are self-authored placeholder artwork; replace them with
 * real photography before launch (see docs/IMAGES.md for sizes and naming).
 * Rotation interval defaults to ~60 seconds site-wide by design.
 */
export const ROTATION_INTERVAL_MS = 60_000;

export const fallbackImageCollections: Record<string, RotatingImageCollection> = {
  homeHero: {
    id: "homeHero",
    intervalMs: ROTATION_INTERVAL_MS,
    images: [
      { src: "/images/travel/hero-lagoon.svg", alt: "Bright tropical lagoon under a midday sun" },
      { src: "/images/travel/hero-sunset.svg", alt: "Golden island sunset over calm water" },
      { src: "/images/travel/hero-palms.svg", alt: "Palm-lined beach cove with turquoise water" },
      { src: "/images/travel/hero-overwater.svg", alt: "Overwater bungalows at dawn" },
    ],
  },
  destinations: {
    id: "destinations",
    intervalMs: ROTATION_INTERVAL_MS,
    images: [
      {
        src: "/images/destinations/dest-maldives.svg",
        alt: "Atoll ringed by shallow turquoise water",
      },
      {
        src: "/images/destinations/dest-santorini.svg",
        alt: "Cliffside village overlooking the sea",
      },
      { src: "/images/destinations/dest-singapore.svg", alt: "City skyline glowing at dusk" },
      { src: "/images/destinations/dest-alps.svg", alt: "Alpine lake beneath snowy peaks" },
      { src: "/images/destinations/dest-doha.svg", alt: "Desert city skyline at golden hour" },
      {
        src: "/images/destinations/dest-caribbean.svg",
        alt: "Caribbean bay dotted with sailboats",
      },
    ],
  },
  successStories: {
    id: "successStories",
    intervalMs: ROTATION_INTERVAL_MS,
    images: [
      { src: "/images/destinations/dest-singapore.svg", alt: "City skyline glowing at dusk" },
      { src: "/images/destinations/dest-doha.svg", alt: "Desert city skyline at golden hour" },
      { src: "/images/destinations/dest-alps.svg", alt: "Alpine lake beneath snowy peaks" },
    ],
  },
  aboutJim: {
    id: "aboutJim",
    intervalMs: ROTATION_INTERVAL_MS,
    images: [
      {
        src: "/images/jim/jim-travel-1.svg",
        alt: "Jim's travel photo: a quiet beach walk (placeholder)",
      },
      {
        src: "/images/jim/jim-travel-2.svg",
        alt: "Jim's travel photo: a sunset lookout (placeholder)",
      },
      {
        src: "/images/jim/jim-travel-3.svg",
        alt: "Jim's travel photo: a mountain vista (placeholder)",
      },
    ],
  },
};
