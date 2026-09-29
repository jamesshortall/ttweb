import { serverEnv } from "@/lib/env";

/**
 * Cloudflare Turnstile verification.
 *
 * Guards the SMS opt-in, which spends money and texts a third party on every
 * submission — the one form where automated abuse has a real cost. Everything
 * here is inert until both keys are configured, so the form keeps working
 * unprotected rather than breaking when they are absent.
 */

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export function isTurnstileConfigured(): boolean {
  const env = serverEnv();
  return !!(env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && env.TURNSTILE_SECRET_KEY);
}

interface TurnstileResult {
  success?: boolean;
  "error-codes"?: string[];
}

/**
 * Verify a widget token with Cloudflare.
 *
 * Returns true when Turnstile is not configured (nothing to check). Otherwise
 * it fails closed: a missing token, a rejection, or an unreachable verifier all
 * return false, because the cost of letting abuse through this particular form
 * is money and unwanted texts to real people.
 */
export async function verifyTurnstileToken(
  token: string | undefined,
  remoteIp?: string,
): Promise<boolean> {
  const env = serverEnv();
  if (!env.TURNSTILE_SECRET_KEY) return true;
  if (!token) return false;

  try {
    const body = new URLSearchParams({
      secret: env.TURNSTILE_SECRET_KEY,
      response: token,
    });
    if (remoteIp && remoteIp !== "unknown") body.set("remoteip", remoteIp);

    const response = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    if (!response.ok) {
      console.error(`[turnstile] Verification endpoint returned ${response.status}`);
      return false;
    }

    const result = (await response.json()) as TurnstileResult;
    if (!result.success) {
      // Cloudflare's codes identify the reason and contain no visitor data.
      console.warn(`[turnstile] Rejected: ${(result["error-codes"] ?? ["unknown"]).join(", ")}`);
      return false;
    }
    return true;
  } catch {
    console.error("[turnstile] Verification request failed");
    return false;
  }
}
