import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import {
  ADMIN_COOKIE,
  SESSION_TTL_MS,
  isAdminAuthConfigured,
  issueSessionToken,
  verifyPassword,
} from "@/lib/admin-auth";
import { recordAuditEvent } from "@/lib/ads/audit";
import { createRateLimiter } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Slows password guessing: 10 attempts/IP/10 min. */
const limiter = createRateLimiter({ limit: 10, windowMs: 10 * 60 * 1000 });

const bodySchema = z.object({ password: z.string().min(1).max(200) });

function clientIp(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export async function POST(request: NextRequest) {
  if (!isAdminAuthConfigured()) {
    return NextResponse.json({ message: "Admin dashboard is not configured." }, { status: 503 });
  }
  if (!limiter.check(clientIp(request))) {
    return NextResponse.json({ message: "Too many attempts. Try again later." }, { status: 429 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(payload);
  if (!parsed.success || !verifyPassword(parsed.data.password)) {
    return NextResponse.json({ message: "Incorrect password." }, { status: 401 });
  }

  const token = issueSessionToken();
  if (!token) {
    return NextResponse.json({ message: "Admin dashboard is not configured." }, { status: 503 });
  }

  await recordAuditEvent({ action: "admin.signin", summary: "Admin dashboard sign-in" });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
