import { revalidatePath } from "next/cache";
import { timingSafeEqual } from "node:crypto";

/**
 * On-demand revalidation webhook.
 *
 * Sanity calls this endpoint whenever content is published so edits — including
 * new or changed photos — appear on the live site within seconds instead of
 * waiting for the hourly ISR window. No rebuild or redeploy is involved.
 *
 * Security: the request must present the shared secret in `SANITY_REVALIDATE_SECRET`,
 * either as an `Authorization: Bearer <secret>` header or a `?secret=<secret>`
 * query parameter. Until the secret is configured the endpoint is inert (501),
 * so it is safe to ship disabled.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function secretsMatch(provided: string, expected: string): boolean {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  // timingSafeEqual throws on length mismatch — guard first, and the length
  // check itself is not secret-dependent.
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function POST(request: Request): Promise<Response> {
  const expected = process.env.SANITY_REVALIDATE_SECRET;
  if (!expected) {
    return Response.json(
      {
        revalidated: false,
        message:
          "Revalidation webhook is not configured. Set SANITY_REVALIDATE_SECRET to enable it.",
      },
      { status: 501 },
    );
  }

  const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const provided = bearer ?? new URL(request.url).searchParams.get("secret") ?? "";
  if (!provided || !secretsMatch(provided, expected)) {
    return Response.json(
      { revalidated: false, message: "Invalid or missing secret." },
      { status: 401 },
    );
  }

  // Managed content (photos, stats, stories, articles…) can surface on any
  // page, so refresh the whole route tree rather than guessing affected paths.
  revalidatePath("/", "layout");
  return Response.json({ revalidated: true, now: Date.now() });
}
