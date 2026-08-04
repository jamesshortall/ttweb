import { NextResponse, type NextRequest } from "next/server";
import { randomUUID } from "node:crypto";
import { createClient } from "@sanity/client";
import { testimonialFormSchema, buildAttribution } from "@/lib/testimonial-schema";
import { createRateLimiter } from "@/lib/rate-limit";

export const runtime = "nodejs";

/** 3 submissions per IP per 15 minutes. */
const limiter = createRateLimiter({ limit: 3, windowMs: 15 * 60 * 1000 });

/** Bots that submit faster than a human can type get a silent success. */
const MINIMUM_FILL_MS = 3_000;

function clientKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

/**
 * Write-enabled Sanity client. Separate from the read client (which is
 * published-only) and only constructed when a write token is configured.
 */
function writeClient() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const token = process.env.SANITY_WRITE_TOKEN;
  if (!projectId || !token) return null;
  return createClient({
    projectId,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
    apiVersion: "2025-01-01",
    token,
    useCdn: false,
  });
}

/**
 * Accepts a client testimonial and stores it as an UNPUBLISHED Sanity draft
 * with `permissionConfirmed` = false. Nothing is ever shown on the site from
 * this route: an administrator verifies the submission, confirms permission,
 * and publishes it in Studio.
 */
export async function POST(request: NextRequest) {
  if (!limiter.check(clientKey(request))) {
    return NextResponse.json(
      { message: "Too many submissions in a short time. Please wait a few minutes and try again." },
      { status: 429 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const parsed = testimonialFormSchema.safeParse(payload);
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

  // Spam heuristics: honeypot content or superhuman fill speed -> pretend
  // success so bots learn nothing, store nothing.
  const tooFast =
    typeof data.startedAt === "number" && Date.now() - data.startedAt < MINIMUM_FILL_MS;
  if ((data.website && data.website.length > 0) || tooFast) {
    return NextResponse.json({ ok: true });
  }

  const client = writeClient();
  if (!client) {
    // Feature not configured yet (no write token). Fail clearly rather than
    // silently dropping a real person's words.
    return NextResponse.json(
      {
        message:
          "Testimonial submissions aren't switched on yet. Please email Jim and he'll add it personally.",
      },
      { status: 503 },
    );
  }

  try {
    await client.create({
      _id: `drafts.testimonial-${randomUUID()}`,
      _type: "testimonial",
      quote: data.quote,
      attribution: buildAttribution(data.name, data.attributionDetail || undefined),
      rating: data.rating,
      featured: false,
      orderRank: 0,
      permissionConfirmed: false,
      source: "form",
      submittedEmail: data.email || undefined,
      submittedAt: new Date().toISOString(),
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    // Log the failure class only - never testimonial content.
    console.error(`[testimonials] Draft creation failed: ${(error as Error).name}`);
    return NextResponse.json(
      { message: "We couldn't submit your testimonial right now. Please try again shortly." },
      { status: 502 },
    );
  }
}
