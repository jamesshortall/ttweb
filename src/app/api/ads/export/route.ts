import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, hasValidSession } from "@/lib/admin-auth";
import { fetchAggregates } from "@/lib/ads/analytics-store";
import { fetchAdLabels } from "@/lib/ads/labels";
import { breakdown, timeseries } from "@/lib/ads/report";
import { parseFilters } from "@/lib/ads/filters";
import { toCsv } from "@/lib/ads/csv";
import type { BreakdownRow } from "@/lib/ads/analytics-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Which report to export. */
const REPORTS = ["campaign", "ad", "placement", "advertiser", "device", "daily"] as const;
type ReportKind = (typeof REPORTS)[number];

function breakdownCsv(label: string, rows: BreakdownRow[]): string {
  return toCsv(
    [label, "Impressions", "Clicks", "Unique clicks", "CTR"],
    rows.map((r) => [r.label, r.impressions, r.clicks, r.uniqueClicks, r.ctr.toFixed(4)]),
  );
}

/** Admin-only CSV export. */
export async function GET(request: NextRequest) {
  if (!hasValidSession(request.cookies.get(ADMIN_COOKIE)?.value)) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const kindParam = request.nextUrl.searchParams.get("report");
  const kind: ReportKind = (REPORTS as readonly string[]).includes(kindParam ?? "")
    ? (kindParam as ReportKind)
    : "campaign";

  const filters = parseFilters(request.nextUrl.searchParams);
  const [rows, labels] = await Promise.all([fetchAggregates(filters), fetchAdLabels()]);

  let csv: string;
  if (kind === "daily") {
    csv = toCsv(
      ["Day", "Impressions", "Clicks", "Unique clicks", "CTR"],
      timeseries(rows).map((p) => [p.day, p.impressions, p.clicks, p.uniqueClicks, p.ctr.toFixed(4)]),
    );
  } else {
    const dimension =
      kind === "campaign"
        ? "campaign_id"
        : kind === "ad"
          ? "ad_id"
          : kind === "advertiser"
            ? "advertiser_id"
            : kind === "placement"
              ? "placement_key"
              : "device";
    csv = breakdownCsv(kind, breakdown(rows, dimension, labels));
  }

  const filename = `ad-${kind}-${filters.from}_${filters.to}.csv`;
  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
