import { Fragment } from "react";
import type { SuccessStory } from "@/lib/cms/types";
import { centsPerPoint, formatCentsPerPoint, formatNumber, formatUsd } from "@/lib/utils";

/** Pulls IATA-style airport codes out of a route string like "Boston (BOS) → …". */
function airportCodes(route: string): string[] {
  return [...route.matchAll(/\(([A-Z]{3})\)/g)].map((m) => m[1] as string);
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-3">
      <dt className="text-[0.65rem] font-semibold uppercase tracking-wide text-navy-200/70">{label}</dt>
      <dd className="mt-1 font-serif text-lg font-semibold text-white">{value}</dd>
    </div>
  );
}

/**
 * Modern "boarding pass" redemption card: navy gradient, a prominent gold
 * cents-per-point figure, a dashed route line with airport codes, and a clean
 * metrics strip. Used on the homepage; the Success Stories page adds full
 * context below the card.
 */
export function RedemptionCard({ story }: { story: SuccessStory }) {
  const cpp = centsPerPoint(story.cashValueUsd, story.taxesFeesUsd, story.pointsUsed);
  const codes = airportCodes(story.route);
  const unitShort = story.pointsUnit === "miles" ? "mile" : "point";

  return (
    <article className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-800 to-navy-950 p-8 shadow-xl shadow-navy-950/20 ring-1 ring-white/5">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-teal-500/15 blur-3xl transition-opacity duration-500 group-hover:opacity-150"
      />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow text-teal-300">
            {story.airline} · {story.cabin}
          </p>
          <h3 className="mt-2 text-balance font-serif text-2xl font-semibold text-white">
            {story.title}
          </h3>
        </div>
        <div className="shrink-0 rounded-2xl bg-gold-500/15 px-4 py-2.5 text-center ring-1 ring-gold-400/30">
          <div className="font-serif text-3xl font-semibold leading-none text-gold-300">
            {formatCentsPerPoint(cpp)}
          </div>
          <div className="mt-1 text-[0.6rem] font-semibold uppercase tracking-wide text-gold-200/80">
            per {unitShort}
          </div>
        </div>
      </div>

      {/* Boarding-pass route */}
      {codes.length >= 2 ? (
        <div className="relative mt-7 flex items-center">
          {codes.map((code, index) => (
            <Fragment key={`${code}-${index}`}>
              <span className="font-serif text-lg font-semibold tracking-[0.15em] text-white">
                {code}
              </span>
              {index < codes.length - 1 ? (
                <span className="relative mx-3 flex-1" aria-hidden="true">
                  <span className="block border-t border-dashed border-white/25" />
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-teal-300"
                  >
                    <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5L21 16Z" />
                  </svg>
                </span>
              ) : null}
            </Fragment>
          ))}
        </div>
      ) : null}

      {/* Metrics */}
      <dl className="relative mt-7 grid grid-cols-3 divide-x divide-white/10 rounded-2xl bg-white/[0.04] py-4 text-center ring-1 ring-white/5">
        <Metric label={story.pointsUnit === "miles" ? "Miles used" : "Points used"} value={formatNumber(story.pointsUsed)} />
        <Metric label="Taxes & fees" value={formatUsd(story.taxesFeesUsd)} />
        <Metric label="Cash price" value={`~${formatUsd(story.cashValueUsd)}`} />
      </dl>
    </article>
  );
}
