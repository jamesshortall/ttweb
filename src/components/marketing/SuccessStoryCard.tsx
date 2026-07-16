import { RedemptionCard } from "@/components/marketing/RedemptionCard";
import type { SuccessStory } from "@/lib/cms/types";
import { centsPerPoint, formatCentsPerPoint } from "@/lib/utils";

/**
 * Full success-story presentation: the modern "boarding pass" redemption card
 * up top, then the summary, honest value math, why-it-worked, and limitations.
 */
export function SuccessStoryCard({ story }: { story: SuccessStory }) {
  const cpp = centsPerPoint(story.cashValueUsd, story.taxesFeesUsd, story.pointsUsed);
  const unit = story.pointsUnit === "miles" ? "mile" : "point";

  return (
    <article aria-labelledby={`story-${story.slug}`} className="scroll-mt-28">
      <h3 id={`story-${story.slug}`} className="sr-only">
        {story.title}
      </h3>

      <RedemptionCard story={story} />

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="text-lg leading-relaxed text-ink/80">{story.summary}</p>
          <div className="mt-6 rounded-2xl border border-gold-200 bg-gold-50 px-5 py-4 text-sm leading-relaxed text-navy-900">
            <strong className="font-semibold text-gold-800">
              Estimated value: {formatCentsPerPoint(cpp)} per {unit}.
            </strong>{" "}
            Calculated as (comparable cash price − taxes and fees) ÷ {story.pointsUnit} used — an
            estimate based on the comparable cash price at booking time, not guaranteed savings.
          </div>

          <h4 className="mt-8 flex items-center gap-2 font-serif text-lg font-semibold text-navy-900">
            <span className="rule-gold" aria-hidden="true" />
            Why this redemption was valuable
          </h4>
          <ul className="mt-4 space-y-3">
            {story.whyValuable.map((point) => (
              <li key={point} className="flex gap-3 leading-relaxed text-ink/85">
                <span aria-hidden="true" className="mt-1 text-teal-600">
                  ✓
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:pt-2">
          <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-sm">
            <h4 className="font-serif text-lg font-semibold text-navy-900">
              Important context &amp; limitations
            </h4>
            <ul className="mt-4 space-y-3">
              {story.context.map((point) => (
                <li key={point} className="flex gap-3 text-sm leading-relaxed text-ink/75">
                  <span aria-hidden="true" className="mt-0.5 text-navy-400">
                    •
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </article>
  );
}
