import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/marketing/PageHero";
import { ConsultationCTA } from "@/components/marketing/ConsultationCTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { webPageJsonLd } from "@/lib/structured-data";
import { readTransferBonusPageData } from "@/lib/transfer-bonuses/read";
import {
  currentBonuses,
  daysRemaining,
  formatPercent,
  formatWindow,
  groupByProgram,
  needsVerifying,
} from "@/lib/transfer-bonuses/present";
import type { TransferBonus } from "@/lib/transfer-bonuses/normalize";

export const metadata: Metadata = {
  title: "Current Transfer Bonuses — Points and Miles",
  description:
    "Every live credit card and hotel point transfer bonus in one place, updated daily: Amex, Chase, Citi, Capital One, Bilt, Rove, Marriott and Wyndham, with the percentage, transfer ratio, deadline and source for each.",
  alternates: { canonical: "/transfer-bonuses" },
};

/**
 * The daily sync refreshes this page on demand when it writes, so the hourly
 * revalidate is only a backstop for a sync that never ran.
 */
export const revalidate = 3600;

/**
 * Programs watched for bonuses. Listed whether or not one is running, so
 * "nothing from Chase right now" reads as information rather than an omission
 * — Chase in particular almost never runs a transfer bonus, and its absence
 * is the single question this page gets asked most.
 */
const MONITORED_PROGRAMS = [
  "Amex Membership Rewards",
  "Chase Ultimate Rewards",
  "Citi ThankYou Rewards",
  "Capital One Miles",
  "Bilt Rewards",
  "RoveMiles",
  "Marriott Bonvoy",
  "Wyndham",
];

function Ratio({ bonus }: { bonus: TransferBonus }) {
  if (!bonus.transferRatio) return null;
  return (
    <span className="rounded-full bg-lagoon-100 px-2.5 py-0.5 text-xs font-semibold text-lagoon-800">
      {bonus.transferRatio}
    </span>
  );
}

function Deadline({ bonus }: { bonus: TransferBonus }) {
  const days = daysRemaining(bonus);
  // Only the last week is worth shouting about; anything longer is just a date.
  const urgent = days !== null && days <= 7;
  return (
    <span
      className={
        urgent ? "font-semibold text-sunset-800" : "text-ink/70"
      }
    >
      {formatWindow(bonus)}
      {urgent ? (days === 0 ? " — ends today" : days === 1 ? " — 1 day left" : ` — ${days} days left`) : null}
    </span>
  );
}

function BonusRow({ bonus }: { bonus: TransferBonus }) {
  return (
    <li className="border-t border-lagoon-100 py-4 first:border-t-0 first:pt-0">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-display text-2xl font-bold text-lagoon-900">
          {formatPercent(bonus.bonusPercent)}
        </span>
        <span className="text-base font-semibold text-lagoon-950">to {bonus.toProgram}</span>
        <Ratio bonus={bonus} />
      </div>

      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
        <Deadline bonus={bonus} />
        {bonus.sourceUrl && bonus.sourceName ? (
          <a
            href={bonus.sourceUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="text-ink/60 underline hover:text-lagoon-700"
          >
            via {bonus.sourceName}
          </a>
        ) : bonus.sourceName ? (
          <span className="text-ink/60">via {bonus.sourceName}</span>
        ) : null}
      </div>

      {bonus.notes ? <p className="mt-1.5 text-sm text-ink/70">{bonus.notes}</p> : null}

      {needsVerifying(bonus) ? (
        <p className="mt-2 text-sm font-medium text-sunset-800">
          Not seen in our latest check — confirm with the program before transferring.
        </p>
      ) : null}
    </li>
  );
}

export default async function TransferBonusesPage() {
  const { bonuses, lastUpdated } = await readTransferBonusPageData();
  const live = currentBonuses(bonuses);
  const groups = groupByProgram(live);
  const withBonuses = new Set(groups.map((group) => group.fromProgram));
  const quiet = MONITORED_PROGRAMS.filter((program) => !withBonuses.has(program));

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: "Current Transfer Bonuses",
          description: metadata.description ?? "",
          path: "/transfer-bonuses",
        })}
      />

      <PageHero
        eyebrow="Points & Miles"
        title="Current Transfer Bonuses"
        description="Every live transfer bonus worth knowing about, in one place, checked every morning. When a bonus is running, the same points buy more — so timing a transfer well is often worth more than earning another 20,000 points."
        crumbs={[{ name: "Transfer Bonuses", path: "/transfer-bonuses" }]}
      />

      <section className="section-padding">
        <Container>
          {/* An honest staleness signal. Someone moving 200,000 points needs to
              know whether this was checked this morning or three weeks ago. */}
          <p className="text-sm text-ink/60">
            {lastUpdated ? (
              <>
                Last checked{" "}
                <time dateTime={lastUpdated}>
                  {new Date(lastUpdated).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                    timeZone: "America/New_York",
                  })}{" "}
                  ET
                </time>
              </>
            ) : (
              "Update times are not available right now."
            )}
          </p>

          {live.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-lagoon-200 bg-lagoon-50 p-6 sm:p-8">
              <p className="font-display text-xl font-bold text-lagoon-950">
                No transfer bonuses are running right now.
              </p>
              <p className="mt-2 text-ink/75">
                That happens — quiet stretches are normal, particularly early in a month. This page
                refreshes every morning, so check back, or{" "}
                <Link href="/contact" className="font-medium text-lagoon-700 underline">
                  get in touch
                </Link>{" "}
                if you have a transfer in mind and want to know whether it&apos;s worth waiting.
              </p>
            </div>
          ) : (
            <div className="mt-8 lg:columns-2 lg:gap-6">
              {/* A column flow rather than a grid: programs carry anywhere from
                  one bonus to four, and grid rows align to the tallest card,
                  which leaves a hole the height of three bonuses beside a short
                  one. Columns let the cards pack. */}
              {groups.map((group) => (
                <div
                  key={group.fromProgram}
                  className="mb-6 break-inside-avoid rounded-2xl border border-lagoon-200 bg-white p-6 shadow-sm"
                >
                  <h2 className="font-display text-xl font-bold text-lagoon-950">
                    {group.fromProgram}
                  </h2>
                  <ul className="mt-4">
                    {group.bonuses.map((bonus) => (
                      <BonusRow key={bonus.runKey} bonus={bonus} />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          <p className="mt-6 text-sm text-ink/75">
            Wondering whether to take one of these or wait?{" "}
            <Link
              href="/transfer-bonuses/history"
              className="font-medium text-lagoon-700 underline"
            >
              See how often each pairing runs
            </Link>{" "}
            &mdash; nine years of past bonuses, by program.
          </p>

          {quiet.length > 0 ? (
            <p className="mt-8 text-sm text-ink/70">
              <span className="font-semibold text-lagoon-950">Also watched, nothing running:</span>{" "}
              {quiet.join(", ")}.
            </p>
          ) : null}

          {/* Provenance and the caveat. Both are obligations, not decoration:
              the data is machine-collected from other people's reporting, and
              a reader may move six figures of points on it. */}
          <div className="mt-10 rounded-2xl border border-lagoon-200 bg-lagoon-50 p-6">
            <h2 className="font-display text-lg font-bold text-lagoon-950">
              Before you transfer
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink/75">
              <strong>Always confirm the bonus on the program&apos;s own site before moving
              points.</strong>{" "}
              Transfers are irreversible. This page is collected automatically from public
              reporting — each entry links to where it came from — and terms, tiers and end dates
              change without notice.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink/75">
              A bonus is only a good deal if you have a use for the miles. Transferring into a
              program &ldquo;because there&apos;s a bonus&rdquo; is how points die in accounts you
              never touch again. If you&apos;re not sure,{" "}
              <Link href="/contact" className="font-medium text-lagoon-700 underline">
                ask first
              </Link>
              .
            </p>
          </div>
        </Container>
      </section>

      <ConsultationCTA />
    </>
  );
}
