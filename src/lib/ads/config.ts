import { serverEnv } from "@/lib/env";

/**
 * Resolved advertising configuration, read once from validated env with safe
 * defaults. Server-only (reads secrets); never import into client components.
 */
export interface AdConfig {
  trackingEnabled: boolean;
  timezone: string;
  uniqueClickWindowHours: number;
  eventRetentionDays: number;
  previewMode: boolean;
  redirectSigningSecret?: string;
  adsenseEnabled: boolean;
  htmlEmbedsEnabled: boolean;
}

export function adConfig(): AdConfig {
  const env = serverEnv();
  return {
    // Tracking is on unless explicitly disabled.
    trackingEnabled: env.AD_TRACKING_ENABLED !== "false",
    timezone: env.AD_DEFAULT_TIMEZONE ?? "America/New_York",
    uniqueClickWindowHours: env.AD_UNIQUE_CLICK_WINDOW_HOURS ?? 24,
    eventRetentionDays: env.AD_EVENT_RETENTION_DAYS ?? 365,
    previewMode: env.AD_PREVIEW_MODE === "true",
    redirectSigningSecret: env.AD_REDIRECT_SIGNING_SECRET,
    adsenseEnabled: env.NEXT_PUBLIC_ADSENSE_ENABLED === "true",
    htmlEmbedsEnabled: env.AD_HTML_EMBEDS_ENABLED === "true",
  };
}
