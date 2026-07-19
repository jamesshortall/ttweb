import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, hasValidSession } from "@/lib/admin-auth";
import { fetchAggregates } from "@/lib/ads/analytics-store";
import { fetchAdLabels } from "@/lib/ads/labels";
import { buildReport } from "@/lib/ads/report";
import { parseFilters } from "@/lib/ads/filters";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Admin-only analytics report as JSON. */
export async function GET(request: NextRequest) {
  if (!hasValidSession(request.cookies.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const filters = parseFilters(request.nextUrl.searchParams);
  const [rows, labels] = await Promise.all([fetchAggregates(filters), fetchAdLabels()]);
  const report = buildReport(rows, labels);

  return NextResponse.json({ filters, report }, { headers: { "Cache-Control": "no-store" } });
}
