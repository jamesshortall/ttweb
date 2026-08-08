import { NextResponse, type NextRequest } from "next/server";
import { contactFormSchema } from "@/lib/contact-schema";
import { sendContactConfirmation, sendContactEmail } from "@/lib/email";
import { storeContactSubmission } from "@/lib/contact-storage";
import { createRateLimiter } from "@/lib/rate-limit";

export const runtime = "nodejs";

/** 5 submissions per IP per 10 minutes. */
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
      { message: "Too many messages in a short time. Please wait a few minutes and try again." },
      { status: 429 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const parsed = contactFormSchema.safeParse(payload);
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

  // Spam heuristics: honeypot content or superhuman fill speed → pretend
  // success so bots learn nothing, deliver nothing.
  const tooFast =
    typeof data.startedAt === "number" && Date.now() - data.startedAt < MINIMUM_FILL_MS;
  if ((data.website && data.website.length > 0) || tooFast) {
    return NextResponse.json({ ok: true });
  }

  try {
    const [emailed] = await Promise.all([sendContactEmail(data), storeContactSubmission(data)]);
    // Courtesy auto-reply to the sender. Best-effort: a failure here must not
    // fail the submission — Jim's notification above is what matters.
    try {
      await sendContactConfirmation(data);
    } catch (error) {
      console.error(`[contact] Confirmation auto-reply failed: ${(error as Error).name}`);
    }
    if (!emailed && process.env.NODE_ENV === "production" && process.env.EMAIL_PROVIDER) {
      // A provider is configured but delivery failed upstream of throwing.
      return NextResponse.json(
        { message: "We couldn't send your message right now. Please try again shortly." },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    // Log the failure class only — never form content.
    console.error(`[contact] Delivery failed: ${(error as Error).name}`);
    return NextResponse.json(
      { message: "We couldn't send your message right now. Please try again shortly." },
      { status: 502 },
    );
  }
}
