import type { AdType } from "@/lib/ads/types";

/**
 * Client-facing ad DTO returned by GET /api/ads/resolve.
 *
 * This is the ONLY ad data that reaches the browser: the creative already
 * chosen for the viewer's device, a pre-signed click href, and the fields
 * needed to render + track. No private advertiser data, no full candidate list,
 * no targeting rules. Types only — safe to import into client components (it
 * pulls in no server-only modules).
 */

export interface RenderableCreative {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface RenderableAd {
  id: string;
  campaignId?: string;
  advertiserId?: string;
  adType: AdType;
  headline?: string;
  description?: string;
  creative: RenderableCreative | null;
  ctaLabel?: string;
  disclosure: { enabled: boolean; label: string };
  promoCode?: string;
  /** Pre-built (and signed, when a secret is set) click destination. */
  clickHref: string | null;
}

export interface ResolveResponse {
  ad: RenderableAd | null;
  /** False in preview mode — the client then renders but records nothing. */
  track: boolean;
}
