import { serverEnv } from "@/lib/env";
import { normalizePhone } from "@/lib/sms-optin-schema";

/**
 * Outbound SMS via Twilio's REST API.
 *
 * Uses a plain HTTPS call, so no provider SDK ships in the bundle. Everything
 * here is inert until Twilio credentials are configured, which lets the opt-in
 * flow work (and record consent) before an A2P campaign is approved.
 */

/** The welcome message sent the moment someone opts in. */
export const WELCOME_MESSAGE =
  "Travel Technician: You're subscribed to text updates about your inquiry and scheduling. Msg frequency varies. Msg & data rates may apply. Reply HELP for help, STOP to cancel.";

export function isSmsConfigured(): boolean {
  const env = serverEnv();
  return !!(env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN && env.TWILIO_FROM_NUMBER);
}

/** Digits to E.164, assuming a US number when no country code is present. */
function toE164(phone: string): string {
  const digits = normalizePhone(phone);
  if (phone.trim().startsWith("+")) return `+${digits}`;
  if (digits.length === 10) return `+1${digits}`;
  return `+${digits}`;
}

/**
 * Send the welcome/confirmation text. Returns false (without throwing) when
 * Twilio is not configured, so the opt-in still succeeds and the consent is
 * still recorded.
 */
export async function sendWelcomeSms(phone: string): Promise<boolean> {
  const env = serverEnv();
  if (!env.TWILIO_ACCOUNT_SID || !env.TWILIO_AUTH_TOKEN || !env.TWILIO_FROM_NUMBER) {
    console.info("[sms] Twilio not configured; opt-in recorded without a welcome message.");
    return false;
  }

  const credentials = Buffer.from(`${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`).toString(
    "base64",
  );
  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${env.TWILIO_ACCOUNT_SID}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        To: toE164(phone),
        From: env.TWILIO_FROM_NUMBER,
        Body: WELCOME_MESSAGE,
      }),
    },
  );

  if (!response.ok) {
    // Status only — never the response body, which can echo the number.
    console.error(`[sms] Twilio send failed with status ${response.status}`);
    return false;
  }
  return true;
}
