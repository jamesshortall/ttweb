import { createHmac, timingSafeEqual } from "node:crypto";
import { serverEnv } from "@/lib/env";

/**
 * Minimal admin session auth for the advertising dashboard.
 *
 * A signed, expiring session token stored in an httpOnly cookie. Sign-in
 * compares a password to AD_ADMIN_PASSWORD in constant time and issues the
 * token; every admin page/endpoint verifies it. Intentionally small — one
 * operator, one password — and disabled entirely until both env vars are set.
 *
 * (We deviated here from an in-Studio dashboard because wiring Studio→Supabase
 * auth needs a live Sanity project to verify; this cookie guard is fully
 * server-verifiable. It can be swapped for Studio SSO later without touching
 * the reporting layer.)
 */

export const ADMIN_COOKIE = "tt_admin";
export const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

export function isAdminAuthConfigured(): boolean {
  const env = serverEnv();
  return Boolean(env.AD_ADMIN_PASSWORD && env.AD_ADMIN_SESSION_SECRET);
}

function constantTimeEquals(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

export function verifyPassword(candidate: string): boolean {
  const expected = serverEnv().AD_ADMIN_PASSWORD;
  if (!expected) return false;
  return constantTimeEquals(candidate, expected);
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

/** Create a session token valid until `expiresAt` (ms since epoch). */
export function signSession(expiresAt: number, secret: string): string {
  const payload = String(expiresAt);
  return `${payload}.${sign(payload, secret)}`;
}

/** Verify a session token: correct signature and not expired. */
export function verifySession(token: string | undefined, secret: string, now: number): boolean {
  if (!token) return false;
  const dot = token.indexOf(".");
  if (dot <= 0) return false;
  const payload = token.slice(0, dot);
  const providedSig = token.slice(dot + 1);
  const expectedSig = sign(payload, secret);
  if (!constantTimeEquals(providedSig, expectedSig)) return false;
  const expiresAt = Number(payload);
  return Number.isFinite(expiresAt) && expiresAt > now;
}

/** Issue a fresh session cookie value with the default TTL. */
export function issueSessionToken(now: number = Date.now()): string | null {
  const secret = serverEnv().AD_ADMIN_SESSION_SECRET;
  if (!secret) return null;
  return signSession(now + SESSION_TTL_MS, secret);
}

/** Is the given cookie value a currently-valid admin session? */
export function hasValidSession(cookieValue: string | undefined, now: number = Date.now()): boolean {
  const secret = serverEnv().AD_ADMIN_SESSION_SECRET;
  if (!secret) return false;
  return verifySession(cookieValue, secret, now);
}
