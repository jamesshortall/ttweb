import { z } from "zod";

/**
 * Server-side environment validation.
 *
 * Every variable is optional — the site must run locally with zero
 * configuration — but variables that ARE set must be well-formed, and
 * variables that only make sense together (e.g. an email provider and its API
 * key) are cross-checked so misconfiguration fails loudly at startup instead
 * of silently at request time.
 */

const emptyToUndefined = (value: unknown) => (value === "" ? undefined : value);

const optionalUrl = z.preprocess(emptyToUndefined, z.string().url().optional());
const optionalEmail = z.preprocess(emptyToUndefined, z.string().email().optional());
const optionalString = z.preprocess(emptyToUndefined, z.string().min(1).optional());
const optionalBool = z.preprocess(emptyToUndefined, z.enum(["true", "false"]).optional());
const optionalPositiveInt = z.preprocess(
  emptyToUndefined,
  z.coerce.number().int().positive().optional(),
);

const serverEnvSchema = z
  .object({
    NEXT_PUBLIC_SITE_URL: optionalUrl,
    NEXT_PUBLIC_CARDMASTER_URL: optionalUrl,
    NEXT_PUBLIC_APPPASSPORT_URL: optionalUrl,
    NEXT_PUBLIC_BLOG_URL: optionalUrl,
    NEXT_PUBLIC_INSTAGRAM_URL: optionalUrl,
    NEXT_PUBLIC_FACEBOOK_URL: optionalUrl,
    NEXT_PUBLIC_CALENDLY_URL: optionalUrl,
    BLOG_RSS_URL: optionalUrl,
    EMAIL_PROVIDER: z.preprocess(emptyToUndefined, z.enum(["resend", "postmark"]).optional()),
    CONTACT_TO_EMAIL: optionalEmail,
    EMAIL_FROM_ADDRESS: optionalEmail,
    RESEND_API_KEY: optionalString,
    POSTMARK_SERVER_TOKEN: optionalString,
    NEXT_PUBLIC_ANALYTICS_PROVIDER: z.preprocess(
      emptyToUndefined,
      z.enum(["plausible", "google"]).optional(),
    ),
    NEXT_PUBLIC_ANALYTICS_ID: optionalString,
    NEXT_PUBLIC_ANALYTICS_COOKIELESS: z.preprocess(
      emptyToUndefined,
      z.enum(["true", "false"]).optional(),
    ),
    NEXT_PUBLIC_SANITY_PROJECT_ID: optionalString,
    NEXT_PUBLIC_SANITY_DATASET: optionalString,
    SANITY_API_TOKEN: optionalString,
    // Write-access token used only to save testimonial submissions as drafts.
    SANITY_WRITE_TOKEN: optionalString,
    SANITY_REVALIDATE_SECRET: optionalString,
    NEXT_PUBLIC_SUPABASE_URL: optionalUrl,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: optionalString,
    SUPABASE_SERVICE_ROLE_KEY: optionalString,
    // ── Advertising ──────────────────────────────────────────────────────────
    AD_TRACKING_ENABLED: optionalBool,
    AD_DEFAULT_TIMEZONE: optionalString,
    AD_UNIQUE_CLICK_WINDOW_HOURS: optionalPositiveInt,
    AD_EVENT_RETENTION_DAYS: optionalPositiveInt,
    AD_PREVIEW_MODE: optionalBool,
    AD_HTML_EMBEDS_ENABLED: optionalBool,
    AD_REDIRECT_SIGNING_SECRET: optionalString,
    AD_SCRIPT_ALLOWLIST: optionalString,
    AD_CRON_SECRET: optionalString,
    AD_ADMIN_PASSWORD: optionalString,
    AD_ADMIN_SESSION_SECRET: optionalString,
    AD_AUDIT_WEBHOOK_SECRET: optionalString,
    NEXT_PUBLIC_ADSENSE_ENABLED: optionalBool,
    NEXT_PUBLIC_ADSENSE_CLIENT_ID: optionalString,
    ADSENSE_ALLOWED_DOMAINS: optionalString,
  })
  .superRefine((env, ctx) => {
    if (env.EMAIL_PROVIDER === "resend" && !env.RESEND_API_KEY) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["RESEND_API_KEY"],
        message: "RESEND_API_KEY is required when EMAIL_PROVIDER=resend",
      });
    }
    if (env.EMAIL_PROVIDER === "postmark" && !env.POSTMARK_SERVER_TOKEN) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["POSTMARK_SERVER_TOKEN"],
        message: "POSTMARK_SERVER_TOKEN is required when EMAIL_PROVIDER=postmark",
      });
    }
    if (env.EMAIL_PROVIDER && (!env.CONTACT_TO_EMAIL || !env.EMAIL_FROM_ADDRESS)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["CONTACT_TO_EMAIL"],
        message: "CONTACT_TO_EMAIL and EMAIL_FROM_ADDRESS are required when EMAIL_PROVIDER is set",
      });
    }
    if (env.NEXT_PUBLIC_ANALYTICS_PROVIDER && !env.NEXT_PUBLIC_ANALYTICS_ID) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["NEXT_PUBLIC_ANALYTICS_ID"],
        message: "NEXT_PUBLIC_ANALYTICS_ID is required when NEXT_PUBLIC_ANALYTICS_PROVIDER is set",
      });
    }
    if (env.NEXT_PUBLIC_ADSENSE_ENABLED === "true" && !env.NEXT_PUBLIC_ADSENSE_CLIENT_ID) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["NEXT_PUBLIC_ADSENSE_CLIENT_ID"],
        message: "NEXT_PUBLIC_ADSENSE_CLIENT_ID is required when NEXT_PUBLIC_ADSENSE_ENABLED=true",
      });
    }
    // The admin dashboard needs both a password and a session secret, or neither.
    if (Boolean(env.AD_ADMIN_PASSWORD) !== Boolean(env.AD_ADMIN_SESSION_SECRET)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["AD_ADMIN_SESSION_SECRET"],
        message: "AD_ADMIN_PASSWORD and AD_ADMIN_SESSION_SECRET must be set together",
      });
    }
  });

export type ServerEnv = z.infer<typeof serverEnvSchema>;

export function parseServerEnv(raw: NodeJS.ProcessEnv = process.env): ServerEnv {
  const result = serverEnvSchema.safeParse(raw);
  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid environment configuration:\n${details}`);
  }
  return result.data;
}

let cached: ServerEnv | undefined;

/** Validated server environment. Throws with a readable message on first use. */
export function serverEnv(): ServerEnv {
  cached ??= parseServerEnv();
  return cached;
}
