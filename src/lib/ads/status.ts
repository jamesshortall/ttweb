import type { AdStatus } from "@/lib/ads/types";

/**
 * Status-transition logic.
 *
 * Visitor-facing expiry/activation already happens at read time: select.ts only
 * serves `active`/`scheduled` ads inside their schedule window, so an expired ad
 * stops appearing with no admin action and a scheduled ad "goes live" the moment
 * its start passes — even if the stored status field hasn't been rewritten.
 *
 * This pure helper computes what the *stored* status should become, so a Phase 3
 * scheduled job (or the admin dashboard) can write it back to Sanity to keep the
 * displayed status accurate. It never promotes an ad that an admin hasn't moved
 * out of draft/pending, and never resurrects a paused/archived ad.
 */

export interface ScheduleWindow {
  status: AdStatus;
  startDate?: string;
  endDate?: string;
}

export function computeEffectiveStatus(ad: ScheduleWindow, now: Date): AdStatus {
  const t = now.getTime();
  const started = !ad.startDate || new Date(ad.startDate).getTime() <= t;
  const ended = !!ad.endDate && new Date(ad.endDate).getTime() <= t;

  switch (ad.status) {
    case "scheduled":
      if (ended) return "expired";
      return started ? "active" : "scheduled";
    case "active":
      return ended ? "expired" : "active";
    // Admin-controlled states are never changed automatically.
    case "draft":
    case "pending":
    case "paused":
    case "expired":
    case "archived":
    default:
      return ad.status;
  }
}

/** True when the stored status should be rewritten (differs from computed). */
export function needsStatusRewrite(ad: ScheduleWindow, now: Date): boolean {
  return computeEffectiveStatus(ad, now) !== ad.status;
}
