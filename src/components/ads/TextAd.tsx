import type { Advertisement } from "@/lib/ads/types";

/**
 * Presentational text ad. Uses the Travel Technician visual system but stays
 * clearly distinct from editorial callouts (dashed accent, muted surface) so it
 * never reads as an in-house recommendation. The disclosure + CTA are rendered
 * by AdSlot around this.
 */
export function TextAd({ ad }: { ad: Advertisement }) {
  return (
    <div className="text-left">
      <p className="font-serif text-lg font-bold text-navy-900">{ad.headline}</p>
      {ad.description ? <p className="mt-1 text-sm text-navy-700">{ad.description}</p> : null}
    </div>
  );
}
