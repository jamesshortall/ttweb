import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { serverEnv } from "@/lib/env";
import { describeDeliveryError, sendTransferBonusAlert } from "@/lib/email";
import { isBase44Configured } from "@/lib/transfer-bonuses/base44";
import { runTransferBonusSync } from "@/lib/transfer-bonuses/sync";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Daily transfer bonus sync. Called by cron on the VPS with a bearer
 * TRANSFER_BONUS_CRON_SECRET — the same shape as /api/ads/aggregate.
 *
 * Always returns the run's summary, including on a refused or failed run, so
 * the cron log holds a record of what happened rather than a bare status code.
 */
export async function POST(request: NextRequest) {
  const secret = serverEnv().TRANSFER_BONUS_CRON_SECRET;
  if (!secret) return new NextResponse("Not configured", { status: 503 });

  const auth = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (auth !== secret) return new NextResponse("Unauthorized", { status: 401 });

  if (!isBase44Configured()) {
    return NextResponse.json({ ok: false, message: "Base44 is not configured." }, { status: 503 });
  }

  const result = await runTransferBonusSync();

  if (result.status === "succeeded") {
    revalidatePath("/transfer-bonuses");
  }

  // Quiet on an uneventful run; loud on anything that needs a human.
  const worthReporting =
    result.status !== "succeeded" || result.rejections.length > 0 || result.newBonuses.length > 0;
  if (worthReporting) {
    try {
      await sendTransferBonusAlert(result);
    } catch (error) {
      console.error(`[transfer-bonuses] Alert email failed: ${describeDeliveryError(error)}`);
    }
  }

  if (result.status === "failed") {
    console.error(`[transfer-bonuses] Sync failed: ${result.error ?? "unknown error"}`);
  } else if (result.status === "aborted") {
    console.warn(`[transfer-bonuses] Sync refused to write: ${result.error ?? "unknown reason"}`);
  }

  return NextResponse.json(
    {
      ok: result.status === "succeeded",
      status: result.status,
      rowsSeen: result.rowsSeen,
      rowsWritten: result.rowsWritten,
      rowsRejected: result.rowsRejected,
      newBonuses: result.newBonuses.length,
      error: result.error,
    },
    // A refused or failed run is a non-2xx so `curl -f` in cron exits non-zero
    // and the failure is visible in the log rather than buried in a 200 body.
    { status: result.status === "succeeded" ? 200 : 502 },
  );
}
