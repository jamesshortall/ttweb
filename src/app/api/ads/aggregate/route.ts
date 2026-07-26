import { NextResponse, type NextRequest } from "next/server";
import { serverEnv } from "@/lib/env";
import { runAggregation } from "@/lib/ads/analytics-store";
import { recordAuditEvent } from "@/lib/ads/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Aggregation job: fold raw ad_events into ad_daily_aggregates. Intended to be
 * called by a scheduled cron (e.g. hourly) with a Bearer AD_CRON_SECRET. Safe to
 * re-run: it recomputes and upserts each affected day, so overlapping windows
 * don't double-count.
 *
 * Defaults to the last 48 hours to catch late-arriving events; pass ?hours=N to
 * widen the window (e.g. a nightly full-day pass).
 */
export async function POST(request: NextRequest) {
  const secret = serverEnv().AD_CRON_SECRET;
  if (!secret) return new NextResponse("Not configured", { status: 503 });

  const auth = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (auth !== secret) return new NextResponse("Unauthorized", { status: 401 });

  const hoursParam = Number(request.nextUrl.searchParams.get("hours"));
  const hours = Number.isFinite(hoursParam) && hoursParam > 0 ? Math.min(hoursParam, 24 * 90) : 48;
  const to = new Date();
  const from = new Date(to.getTime() - hours * 60 * 60 * 1000);

  const written = await runAggregation(from, to);
  if (written < 0) {
    return NextResponse.json({ ok: false, message: "Aggregation failed." }, { status: 500 });
  }

  await recordAuditEvent({
    action: "ads.aggregate",
    summary: `Aggregated ${written} daily row(s) over ${hours}h`,
    metadata: { from: from.toISOString(), to: to.toISOString(), rows: written },
  });

  return NextResponse.json({ ok: true, rowsWritten: written, from, to });
}
