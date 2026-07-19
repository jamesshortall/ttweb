import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { recordImpression } from "@/lib/ads/events";
import { deviceFromUserAgent } from "@/lib/ads/device";
import { createRateLimiter } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Generous cap: one placement can legitimately beacon a handful per session. */
const limiter = createRateLimiter({ limit: 120, windowMs: 60 * 1000 });

const bodySchema = z.object({
  adId: z.string().min(1).max(200),
  campaignId: z.string().max(200).optional(),
  advertiserId: z.string().max(200).optional(),
  placementKey: z.string().min(1).max(200),
  pagePath: z.string().max(400).optional(),
});

function clientIp(request: NextRequest): string | null {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
}

export async function POST(request: NextRequest) {
  const ip = clientIp(request);
  if (!limiter.check(ip ?? "unknown")) {
    // Silently accept — never surface rate-limit detail to a tracking beacon.
    return new NextResponse(null, { status: 204 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return new NextResponse(null, { status: 204 });
  }

  const parsed = bodySchema.safeParse(payload);
  if (!parsed.success) return new NextResponse(null, { status: 204 });

  const userAgent = request.headers.get("user-agent");
  await recordImpression(
    { ...parsed.data, device: deviceFromUserAgent(userAgent) },
    { ip, userAgent },
  );

  // Beacons ignore the body; 204 keeps it lightweight.
  return new NextResponse(null, { status: 204 });
}
