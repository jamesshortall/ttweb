/**
 * Presentational text ad. Uses the Travel Technician visual system but stays
 * clearly distinct from editorial callouts so it never reads as an in-house
 * recommendation. The disclosure + CTA are rendered by AdSlot around this.
 */
export function TextAd({ headline, description }: { headline?: string; description?: string }) {
  return (
    <div className="text-left">
      <p className="font-serif text-lg font-bold text-navy-900">{headline}</p>
      {description ? <p className="mt-1 text-sm text-navy-700">{description}</p> : null}
    </div>
  );
}
