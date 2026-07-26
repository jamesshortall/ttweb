import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, hasValidSession, isAdminAuthConfigured } from "@/lib/admin-auth";
import { fetchAggregates, isAnalyticsConfigured } from "@/lib/ads/analytics-store";
import { fetchAdLabels } from "@/lib/ads/labels";
import { buildReport } from "@/lib/ads/report";
import { parseFilters } from "@/lib/ads/filters";
import { formatNumber } from "@/lib/utils";
import type { BreakdownRow } from "@/lib/ads/analytics-types";
import { LogoutButton } from "../LogoutButton";

export const dynamic = "force-dynamic";

const pct = (v: number) => `${(v * 100).toFixed(2)}%`;

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-wide text-navy-500">{label}</div>
      <div className="mt-1 font-serif text-2xl font-bold text-navy-900">{value}</div>
    </div>
  );
}

function BreakdownTable({
  title,
  rows,
  exportHref,
}: {
  title: string;
  rows: BreakdownRow[];
  exportHref?: string;
}) {
  return (
    <section className="rounded-xl bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-serif text-lg font-bold text-navy-900">{title}</h2>
        {exportHref ? (
          <a href={exportHref} className="text-sm font-semibold text-teal-700 hover:text-teal-600">
            Export CSV
          </a>
        ) : null}
      </div>
      {rows.length === 0 ? (
        <p className="text-sm text-navy-500">No data in this range yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-navy-100 text-left text-navy-500">
                <th className="py-1.5 pr-3 font-semibold">Name</th>
                <th className="py-1.5 pr-3 text-right font-semibold">Impr.</th>
                <th className="py-1.5 pr-3 text-right font-semibold">Clicks</th>
                <th className="py-1.5 pr-3 text-right font-semibold">Unique</th>
                <th className="py-1.5 text-right font-semibold">CTR</th>
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 25).map((r) => (
                <tr key={r.key} className="border-b border-navy-50 last:border-0">
                  <td className="py-1.5 pr-3 text-navy-800">{r.label}</td>
                  <td className="py-1.5 pr-3 text-right tabular-nums">{formatNumber(r.impressions)}</td>
                  <td className="py-1.5 pr-3 text-right tabular-nums">{formatNumber(r.clicks)}</td>
                  <td className="py-1.5 pr-3 text-right tabular-nums">{formatNumber(r.uniqueClicks)}</td>
                  <td className="py-1.5 text-right tabular-nums">{pct(r.ctr)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default async function AdminAdsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  if (!isAdminAuthConfigured()) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="font-serif text-2xl font-bold text-navy-900">Dashboard not configured</h1>
        <p className="mt-2 text-navy-600">
          Set <code>AD_ADMIN_PASSWORD</code> and <code>AD_ADMIN_SESSION_SECRET</code> to enable the
          advertising dashboard. See <code>docs/ADVERTISING.md</code>.
        </p>
      </main>
    );
  }

  const cookieStore = await cookies();
  if (!hasValidSession(cookieStore.get(ADMIN_COOKIE)?.value)) {
    redirect("/admin/login");
  }

  const sp = await searchParams;
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (typeof v === "string") params.set(k, v);
  }
  const filters = parseFilters(params);

  const [rows, labels] = await Promise.all([fetchAggregates(filters), fetchAdLabels()]);
  const report = buildReport(rows, labels);

  const exportBase = `/api/ads/export?from=${filters.from}&to=${filters.to}`;

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-navy-900">Advertising analytics</h1>
          <p className="text-sm text-navy-600">
            {filters.from} → {filters.to}
          </p>
        </div>
        <LogoutButton />
      </header>

      {!isAnalyticsConfigured() ? (
        <div className="mb-6 rounded-lg border border-gold-300 bg-gold-50 p-4 text-sm text-navy-800">
          Supabase isn&apos;t configured, so there&apos;s no analytics data yet. Set the Supabase env
          vars and run the migration to start collecting.
        </div>
      ) : null}

      <form method="get" className="mb-6 flex flex-wrap items-end gap-3 rounded-xl bg-white p-4 shadow-sm">
        <label className="text-sm font-semibold text-navy-800">
          From
          <input
            type="date"
            name="from"
            defaultValue={filters.from}
            className="mt-1 block rounded-lg border border-navy-200 px-2.5 py-1.5"
          />
        </label>
        <label className="text-sm font-semibold text-navy-800">
          To
          <input
            type="date"
            name="to"
            defaultValue={filters.to}
            className="mt-1 block rounded-lg border border-navy-200 px-2.5 py-1.5"
          />
        </label>
        <button
          type="submit"
          className="rounded-full bg-navy-900 px-5 py-2 text-sm font-semibold text-white hover:bg-navy-800"
        >
          Apply
        </button>
      </form>

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Impressions" value={formatNumber(report.totals.impressions)} />
        <StatCard label="Clicks" value={formatNumber(report.totals.clicks)} />
        <StatCard label="Unique clicks" value={formatNumber(report.totals.uniqueClicks)} />
        <StatCard label="CTR" value={pct(report.totals.ctr)} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <BreakdownTable
          title="By campaign"
          rows={report.byCampaign}
          exportHref={`${exportBase}&report=campaign`}
        />
        <BreakdownTable title="By advertisement" rows={report.byAd} exportHref={`${exportBase}&report=ad`} />
        <BreakdownTable
          title="By placement"
          rows={report.byPlacement}
          exportHref={`${exportBase}&report=placement`}
        />
        <BreakdownTable title="By device" rows={report.byDevice} exportHref={`${exportBase}&report=device`} />
        <BreakdownTable title="By page" rows={report.byPage} />
        <section className="rounded-xl bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-navy-900">Daily</h2>
            <a
              href={`${exportBase}&report=daily`}
              className="text-sm font-semibold text-teal-700 hover:text-teal-600"
            >
              Export CSV
            </a>
          </div>
          {report.timeseries.length === 0 ? (
            <p className="text-sm text-navy-500">No data in this range yet.</p>
          ) : (
            <div className="max-h-72 overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-navy-100 text-left text-navy-500">
                    <th className="py-1.5 pr-3 font-semibold">Day</th>
                    <th className="py-1.5 pr-3 text-right font-semibold">Impr.</th>
                    <th className="py-1.5 pr-3 text-right font-semibold">Clicks</th>
                    <th className="py-1.5 text-right font-semibold">CTR</th>
                  </tr>
                </thead>
                <tbody>
                  {report.timeseries.map((p) => (
                    <tr key={p.day} className="border-b border-navy-50 last:border-0">
                      <td className="py-1.5 pr-3 text-navy-800">{p.day}</td>
                      <td className="py-1.5 pr-3 text-right tabular-nums">{formatNumber(p.impressions)}</td>
                      <td className="py-1.5 pr-3 text-right tabular-nums">{formatNumber(p.clicks)}</td>
                      <td className="py-1.5 text-right tabular-nums">{pct(p.ctr)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
