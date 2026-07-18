import type { RotatingImageCollection } from "@/lib/cms/types";

/**
 * Rotating-image collections — editable in Sanity (imageCollection documents).
 * These reference Jim's real travel photography under /public/images.
 */
export const ROTATION_INTERVAL_MS = 7000;

export const fallbackImageCollections: Record<string, RotatingImageCollection> = {
  homeHero: {
    id: "homeHero",
    intervalMs: ROTATION_INTERVAL_MS,
    images: [
      { src: "/images/travel/marigot-sunset.jpg", alt: "Sailboats at rest in Marigot Bay, St. Lucia, at sunset" },
      { src: "/images/travel/pitons.jpg", alt: "The Pitons rising above the sea in St. Lucia" },
      { src: "/images/travel/palm-beach.jpg", alt: "Palm trees framing turquoise Caribbean water" },
      { src: "/images/travel/footprints-sunset.jpg", alt: "Footprints in white sand at a tropical sunset" },
    ],
  },
  destinations: {
    id: "destinations",
    intervalMs: ROTATION_INTERVAL_MS,
    images: [
      { src: "/images/destinations/tulum.jpg", alt: "Tulum ruins above a turquoise Caribbean cove" },
      { src: "/images/destinations/coba-pyramid.jpg", alt: "The Cobá pyramid in the Yucatán jungle" },
      { src: "/images/destinations/st-lucia-bay.jpg", alt: "A sweeping bay and green hills in St. Lucia" },
      { src: "/images/destinations/saona.jpg", alt: "A boat on clear turquoise water in the Dominican Republic" },
      { src: "/images/destinations/waikiki.jpg", alt: "The Honolulu skyline seen from the water" },
      { src: "/images/travel/palm-alley.jpg", alt: "A sunlit avenue of palm trees" },
      { src: "/images/destinations/resort-pool.jpg", alt: "An oceanfront resort pool lined with palms" },
      { src: "/images/travel/turtle.jpg", alt: "A green sea turtle gliding over a reef" },
    ],
  },
  successStories: {
    id: "successStories",
    intervalMs: ROTATION_INTERVAL_MS,
    images: [
      { src: "/images/travel/marigot-sunset.jpg", alt: "Marigot Bay at sunset" },
      { src: "/images/destinations/waikiki.jpg", alt: "The Honolulu skyline from the water" },
      { src: "/images/travel/sunset-sailboat.jpg", alt: "A sailboat silhouetted against a golden sunset" },
    ],
  },
  aboutJim: {
    id: "aboutJim",
    intervalMs: ROTATION_INTERVAL_MS,
    images: [
      { src: "/images/jim/jim-business-class.jpg", alt: "Jim relaxing in a lie-flat business class seat" },
      { src: "/images/jim/jim-group.jpg", alt: "Jim with friends in front of a Mayan pyramid" },
      { src: "/images/jim/jim-horseback.jpg", alt: "Jim riding a horse along a Caribbean beach" },
    ],
  },
};
