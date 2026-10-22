import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/marketing/PageHero";
import { ConsultationCTA } from "@/components/marketing/ConsultationCTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { webPageJsonLd } from "@/lib/structured-data";
import { readBonusHistory } from "@/lib/transfer-bonuses/read-history";
import { cadence, monthName, summarizePairings } from "@/lib/transfer-bonuses/stats";
import {
  HistoryExplorer,
  type PairingSummary,
} from "@/components/transfer-bonuses/HistoryExplorer";

export const metadata: Metadata = {
  title: "Transfer Bonus History — How Often Each Pairing Runs",
  description:
    "Nine years of credit card and hotel transfer bonuses, summarised by program pairing: how often each one runs, its average and best-ever percentage, and the months it usually appears. Know whether today's offer is worth taking or worth waiting out.",
  alternates: { canonical: "/transfer-bonuses/history" },
};

export const revalidate = 3600;

/** Fewer than this and a "pattern" is really just a coincidence. */
const MIN_RUNS_FOR_PATTERN = 2;

export default async function TransferBonusHistoryPage() {
  const history = await readBonusHistory();
  const all = summarizePairings(history);
  // One-off pairings carry no pattern worth stating, and 68 of them would
  // bury the 71 that do. They remain in the totals below.
  const pairings = all.filter((p) => p.runCount >= MIN_RUNS_FOR_PATTERN);

  const summaries: PairingSummary[] = pairings.map((p) => ({
    key: p.bonusKey,
    fromProgram: p.fromProgram,
    toProgram: p.toProgram,
    runCount: p.runCount,
    averagePercent: p.averagePercent,
    bestPercent: p.bestPercent,
    lastRunStart: p.lastRunStart,
    typicalMonths: p.typicalMonths.map(monthName),
    cadence: cadence(p),
    runs: p.runs.map((run) => ({
      key: run.historyKey,
      start: run.startDate,
      percent: run.bonusPercent,
      sourceName: run.sourceName,
      sourceUrl: run.sourceUrl,
      backfilled: run.origin === "backfill",
    })),
  }));

  const earliest = history
    .map((run) => run.startDate)
    .filter((d): d is string => d !== null)
    .sort()[0];

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: "Transfer Bonus History",
          description: metadata.description ?? "",
          path: "/transfer-bonuses/history",
        })}
      />

      <PageHero
        eyebrow="Points & Miles"
        title="Transfer Bonus History"
        description="How often each pairing actually runs, how big it usually is, and when it tends to appear. The question worth answering is rarely what's live today — it's whether today's offer is good enough to take, or worth waiting out."
        crumbs={[
          { name: "Transfer Bonuses", path: "/transfer-bonuses" },
          { name: "History", path: "/transfer-bonuses/history" },
        ]}
      />

      <section className="section-padding">
        <Container>
          {history.length === 0 ? (
            <div className="rounded-2xl border border-lagoon-200 bg-lagoon-50 p-6 sm:p-8">
              <p className="font-display text-xl font-bold text-lagoon-950">
                History isn&apos;t available right now.
              </p>
              <p className="mt-2 text-ink/75">
                The archive couldn&apos;t be loaded. The{" "}
                <Link href="/transfer-bonuses" className="font-medium text-lagoon-700 underline">
                  current bonuses
                </Link>{" "}
                are unaffected.
              </p>
            </div>
          ) : (
            <>
              <p className="mb-8 max-w-2xl text-ink/75">
                <strong className="text-lagoon-950">
                  {history.length} bonus runs across {all.length} program pairings
                </strong>
                {earliest ? <> since {earliest.slice(0, 4)}</> : null}. Showing the{" "}
                {pairings.length} that have run more than once &mdash; a pairing seen only once
                says nothing about what to expect next.
              </p>

              <HistoryExplorer pairings={summaries} />
            </>
          )}

          <div className="mt-12 rounded-2xl border border-lagoon-200 bg-lagoon-50 p-6">
            <h2 className="font-display text-lg font-bold text-lagoon-950">
              How to read this
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink/75">
              These are patterns, not promises. A pairing that has run every September for five
              years can still skip a year, and programs change partners without warning. Treat a
              strong history as a reason to wait a few weeks rather than as a date you can book
              around.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink/75">
              Runs marked <em>reconstructed</em> were assembled from archived reporting rather
              than observed as they happened, so their exact dates and percentages are the least
              certain part of this page. Every run links to where it came from.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink/75">
              Looking for what&apos;s live right now?{" "}
              <Link href="/transfer-bonuses" className="font-medium text-lagoon-700 underline">
                Current transfer bonuses
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
