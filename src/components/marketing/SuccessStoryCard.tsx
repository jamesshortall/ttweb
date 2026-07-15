import Image from "next/image";
import type { SuccessStory } from "@/lib/cms/types";
import { centsPerPoint, formatCentsPerPoint, formatNumber, formatUsd } from "@/lib/utils";

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-lagoon-50 px-4 py-3">
      <dt className="text-xs font-bold tracking-wide text-lagoon-700 uppercase">{label}</dt>
      <dd className="mt-0.5 font-semibold text-lagoon-950">{value}</dd>
    </div>
  );
}

/** Full success-story presentation: facts grid, value math, honest context. */
export function SuccessStoryCard({ story }: { story: SuccessStory }) {
  const cpp = centsPerPoint(story.cashValueUsd, story.taxesFeesUsd, story.pointsUsed);

  return (
    <article
      aria-labelledby={`story-${story.slug}`}
      className="overflow-hidden rounded-3xl border border-lagoon-100 bg-white shadow-lg shadow-lagoon-950/5"
    >
      <div className="relative h-56 sm:h-72">
        <Image
          src={story.image.src}
          alt={story.image.alt}
          fill
          sizes="(min-width: 1024px) 56rem, 100vw"
          className="object-cover"
        />
        {story.highlight ? (
          <p className="absolute top-4 left-4 rounded-full bg-sunset-700 px-4 py-1.5 text-sm font-bold text-white shadow-md">
            {story.highlight}
          </p>
        ) : null}
      </div>

      <div className="p-6 sm:p-10">
        <h3
          id={`story-${story.slug}`}
          className="font-display text-2xl font-bold text-lagoon-950 sm:text-3xl"
        >
          {story.title}
        </h3>
        <p className="mt-3 text-lg leading-relaxed text-ink/80">{story.summary}</p>

        <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Fact label="Route" value={story.route} />
          <Fact label="Airline" value={story.airline} />
          <Fact label="Cabin" value={story.cabin} />
          <Fact
            label={`${story.pointsUnit === "miles" ? "Miles" : "Points"} used`}
            value={`${formatNumber(story.pointsUsed)} ${story.pointsUnit}`}
          />
          <Fact label="Taxes & fees" value={formatUsd(story.taxesFeesUsd)} />
          <Fact label="Approx. cash price" value={`~${formatUsd(story.cashValueUsd)}`} />
        </dl>

        <p className="mt-4 rounded-xl border border-sunset-200 bg-sunset-50 px-4 py-3 text-sm leading-relaxed text-sunset-950">
          <strong className="font-semibold">
            Estimated value: {formatCentsPerPoint(cpp)} per{" "}
            {story.pointsUnit === "miles" ? "mile" : "point"}.
          </strong>{" "}
          Calculated as (comparable cash price − taxes and fees) ÷ {story.pointsUnit} used. This is
          an estimate based on the comparable cash price at booking time, not guaranteed savings.
        </p>

        <h4 className="font-display mt-8 text-lg font-bold text-lagoon-950">
          Why this redemption was valuable
        </h4>
        <ul className="mt-3 space-y-2.5">
          {story.whyValuable.map((point) => (
            <li key={point} className="flex gap-3 leading-relaxed text-ink/85">
              <span aria-hidden="true" className="mt-1 text-palm-600">
                ✓
              </span>
              {point}
            </li>
          ))}
        </ul>

        <h4 className="font-display mt-6 text-lg font-bold text-lagoon-950">
          Important context and limitations
        </h4>
        <ul className="mt-3 space-y-2.5">
          {story.context.map((point) => (
            <li key={point} className="flex gap-3 leading-relaxed text-ink/75">
              <span aria-hidden="true" className="mt-1 text-lagoon-500">
                •
              </span>
              {point}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
