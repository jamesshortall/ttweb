import { NextResponse, type NextRequest } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { serverEnv } from "@/lib/env";
import { recordAuditEvent } from "@/lib/ads/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Sanity publish webhook → audit log.
 *
 * Records create/update/delete of advertising documents (advertiser, campaign,
 * advertisement, placement zone, ad network) into ad_audit_log, so Studio edits
 * are captured alongside the server-initiated actions we already log.
 *
 * Configure in Sanity: Manage → API → Webhooks, POST to /api/ads/audit-webhook,
 * trigger on Create/Update/Delete, with a projection of at least
 * `{_type, _id, _rev, name, displayName, status}` and the shared secret sent as
 * `Authorization: Bearer <AD_AUDIT_WEBHOOK_SECRET>`. Inert (501) until the secret
 * is set, so it is safe to ship disabled.
 */

const AD_TYPES = new Set([
  "advertiser",
  "campaign",
  "advertisement",
  "placementZone",
  "adNetwork",
]);

function secretsMatch(provided: string, expected: string): boolean {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function POST(request: NextRequest) {
  const expected = serverEnv().AD_AUDIT_WEBHOOK_SECRET;
  if (!expected) {
    return NextResponse.json(
      { ok: false, message: "Audit webhook not configured." },
      { status: 501 },
    );
  }

  const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const provided = bearer ?? new URL(request.url).searchParams.get("secret") ?? "";
  if (!provided || !secretsMatch(provided, expected)) {
    return NextResponse.json({ ok: false, message: "Invalid secret." }, { status: 401 });
  }

  let body: { _type?: string; _id?: string; name?: string; displayName?: string; status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid payload." }, { status: 400 });
  }

  // Only record advertising documents; ignore everything else silently.
  if (!body._type || !AD_TYPES.has(body._type)) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const operation = request.headers.get("sanity-operation") ?? "update";
  const label = body.name ?? body.displayName ?? body._id ?? "unknown";

  await recordAuditEvent({
    actor: "sanity-webhook",
    action: `cms.${body._type}.${operation}`,
    entityType: body._type,
    entityId: body._id,
    summary: `${operation} ${body._type}: ${label}`,
    metadata: body.status ? { status: body.status } : undefined,
  });

  return NextResponse.json({ ok: true });
}
