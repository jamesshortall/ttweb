"use client";

import { useMemo, useState } from "react";

/**
 * The pairing list, filtered as you type.
 *
 * The data is prepared on the server and trimmed to what renders — 139
 * pairings is small enough to filter in the browser, and doing so keeps the
 * page responsive without a round trip per keystroke.
 */

export interface HistoryRun {
  key: string;
  start: string | null;
  percent: number;
  sourceName: string | null;
  sourceUrl: string | null;
  backfilled: boolean;
}

export interface PairingSummary {
  key: string;
  fromProgram: string;
  toProgram: string;
  runCount: number;
  averagePercent: number;
  bestPercent: number;
  lastRunStart: string | null;
  typicalMonths: string[];
  cadence: string | null;
  runs: HistoryRun[];
}

function formatMonthYear(iso: string | null): string {
  if (!iso) return "date unknown";
  const [year, month] = iso.split("-");
  const names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${names[Number(month) - 1] ?? month} ${year}`;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-ink/55">{label}</dt>
      <dd className="font-display text-lg font-bold text-lagoon-900">{value}</dd>
    </div>
  );
}

function PairingCard({ pairing }: { pairing: PairingSummary }) {
  return (
    <div className="break-inside-avoid rounded-2xl border border-lagoon-200 bg-white p-6 shadow-sm">
      <h3 className="font-display text-lg font-bold text-lagoon-950">
        {pairing.fromProgram} <span className="text-ink/50">&rarr;</span> {pairing.toProgram}
      </h3>

      <dl className="mt-4 grid grid-cols-3 gap-4">
        <Stat label="Runs" value={String(pairing.runCount)} />
        <Stat label="Average" value={`${pairing.averagePercent}%`} />
        <Stat label="Best ever" value={`${pairing.bestPercent}%`} />
      </dl>

      <p className="mt-4 text-sm leading-relaxed text-ink/75">
        {pairing.cadence ? <>Runs {pairing.cadence}. </> : null}
        {pairing.typicalMonths.length > 0 ? (
          <>
            Usually starts in {pairing.typicalMonths.join(" or ")}.{" "}
          </>
        ) : null}
        Last seen {formatMonthYear(pairing.lastRunStart)}.
      </p>

      {/* A plain <details> rather than state: the list is evidence for the
          numbers above, wanted occasionally, and this works without JS. */}
      <details className="mt-4 group">
        <summary className="cursor-pointer text-sm font-semibold text-lagoon-700 hover:underline">
          Every run ({pairing.runCount})
        </summary>
        <ul className="mt-3 space-y-2">
          {pairing.runs.map((run) => (
            <li key={run.key} className="flex flex-wrap items-baseline gap-x-2 text-sm">
              <span className="font-semibold text-lagoon-900">{run.percent}%</span>
              <span className="text-ink/70">{formatMonthYear(run.start)}</span>
              {run.sourceUrl && run.sourceName ? (
                <a
                  href={run.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="text-ink/55 underline hover:text-lagoon-700"
                >
                  {run.sourceName}
                </a>
              ) : run.sourceName ? (
                <span className="text-ink/55">{run.sourceName}</span>
              ) : null}
              {run.backfilled ? (
                <span className="text-xs text-ink/45">reconstructed</span>
              ) : null}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}

export function HistoryExplorer({ pairings }: { pairings: PairingSummary[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return pairings;
    return pairings.filter((pairing) =>
      `${pairing.fromProgram} ${pairing.toProgram}`.toLowerCase().includes(needle),
    );
  }, [pairings, query]);

  return (
    <div>
      <label htmlFor="history-search" className="mb-1.5 block font-semibold text-lagoon-950">
        Find a pairing
      </label>
      <input
        id="history-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Amex, Hilton, Avianca…"
        className="w-full max-w-md rounded-xl border border-lagoon-200 bg-white px-4 py-3 text-ink placeholder:text-ink/40 focus:border-lagoon-500"
      />

      <p aria-live="polite" className="mt-3 text-sm text-ink/60">
        {filtered.length === pairings.length
          ? `${pairings.length} pairings`
          : `${filtered.length} of ${pairings.length} pairings`}
      </p>

      {filtered.length === 0 ? (
        <p className="mt-8 text-ink/75">
          Nothing matches &ldquo;{query}&rdquo;. Try a program name like Amex, Chase, Hilton or
          Avianca.
        </p>
      ) : (
        <div className="mt-6 lg:columns-2 lg:gap-6 [&>*]:mb-6">
          {filtered.map((pairing) => (
            <PairingCard key={pairing.key} pairing={pairing} />
          ))}
        </div>
      )}
    </div>
  );
}
