import { NextResponse, type NextRequest } from "next/server";
import { smsOptInFormSchema, normalizePhone } from "@/lib/sms-optin-schema";
import { CONSENT_TEXT } from "@/content/sms-program";
import { sendWelcomeSms } from "@/lib/sms";
import { storeSmsOptIn } from "@/lib/sms-optin-storage";
import { describeDeliveryError, sendSmsOptInNotification } from "@/lib/email";
import { createRateLimiter } from "@/lib/rate-limit";

export const runtime = "nodejs";

/** 5 opt-ins per IP per 10 minutes. */
const limiter = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });

/** Bots that submit faster than a human can type get a silent success. */
const MINIMUM_FILL_MS = 3_000;

function clientKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

export async function POST(request: NextRequest) {
  if (!limiter.check(clientKey(request))) {
    return NextResponse.json(
      { message: "Too many sign-ups in a short time. Please wait a few minutes and try again." },
      { status: 429 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const parsed = smsOptInFormSchema.safeParse(payload);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return NextResponse.json(
      {
        message: firstIssue?.message ?? "Please check the form and try again.",
        issues: parsed.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 422 },
    );
  }

  const data = parsed.data;

  // Honeypot only — see the contact route: fill speed must never drop a real
  // opt-in, which would lose a consent record the subscriber believes exists.
  if (data.website && data.website.length > 0) {
    return NextResponse.json({ ok: true });
  }
  if (typeof data.startedAt === "number" && Date.now() - data.startedAt < MINIMUM_FILL_MS) {
    console.info("[sms-optin] Opt-in filled unusually fast; recording anyway.");
  }

  // The welcome message is the confirmation the subscriber expects, so send it
  // first and record whether it went out. A send failure never loses consent.
  let welcomeSent = false;
  try {
    welcomeSent = await sendWelcomeSms(data.phone);
  } catch (error) {
    console.error(`[sms-optin] Welcome message failed: ${(error as Error).name}`);
  }

  // Record the consent both ways; neither failure is the subscriber's problem.
  await Promise.all([
    storeSmsOptIn({
      name: data.name || undefined,
      phone: data.phone,
      consentText: CONSENT_TEXT,
      welcomeSent,
      source: "sms-opt-in-form",
    }).catch(() => false),
    sendSmsOptInNotification({
      name: data.name || undefined,
      phone: normalizePhone(data.phone),
      consentText: CONSENT_TEXT,
      welcomeSent,
    }).catch((error: Error) => {
      console.error(`[sms-optin] Notification failed: ${describeDeliveryError(error)}`);
      return false;
    }),
  ]);

  return NextResponse.json({ ok: true, welcomeSent });
}
