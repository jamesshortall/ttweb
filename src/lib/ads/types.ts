/**
 * Shared advertising types. These shapes are what the ad-serving layer resolves
 * from Sanity (or dev fallback) and what the components render. Values mirror
 * the Studio schemas in studio/schemas/*.ts — keep them in sync.
 */

export type AdType = "image" | "text" | "video" | "html" | "network";

export type AdStatus =
  | "draft"
  | "pending"
  | "scheduled"
  | "active"
  | "paused"
  | "expired"
  | "archived";

export type DeviceTarget = "all" | "desktop" | "tablet" | "mobile";
export type Device = "desktop" | "tablet" | "mobile" | "unknown";
export type PageTargetMode = "all" | "include" | "exclude";
export type CreativeVariant = "responsive" | "desktop" | "tablet" | "mobile";

export interface AdCreative {
  variant: CreativeVariant;
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface ReferralParams {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  referralId?: string;
  /** Raw "key=value" lines from the CMS, parsed at build time. */
  customParams?: string;
}

export interface AdDisclosure {
  enabled: boolean;
  label: string;
}

/**
 * A fully resolved advertisement, flattened from its Sanity document plus its
 * campaign/advertiser. Only fields the website legitimately needs are included —
 * private advertiser contact/billing data is never projected here.
 */
export interface Advertisement {
  id: string;
  name: string;
  adType: AdType;
  status: AdStatus;
  approved: boolean;

  campaignId: string;
  campaignStatus: AdStatus;
  advertiserId?: string;
  advertiserDisplayName?: string;

  headline?: string;
  description?: string;
  creatives: AdCreative[];
  videoUrl?: string;
  videoPoster?: string;
  videoCaptionsUrl?: string;
  html?: string;
  networkSlotId?: string;

  destinationUrl?: string;
  ctaLabel?: string;

  placementKeys: string[];
  deviceTarget: DeviceTarget;
  pageTargetMode: PageTargetMode;
  pagePaths: string[];

  startDate?: string;
  endDate?: string;
  weight: number;
  priority: number;

  referral?: ReferralParams;
  promoCode?: string;
  promoExpiry?: string;

  disclosure: AdDisclosure;
}

export interface PlacementZone {
  key: string;
  internalName: string;
  enabled: boolean;
  supportedFormats: AdType[];
  deviceAvailability: DeviceTarget;
}

/** Runtime context used to decide which ads are eligible for a request. */
export interface AdRequestContext {
  placementKey: string;
  device: Device;
  pagePath: string;
  /** Preview mode renders ads but never records analytics. */
  preview: boolean;
  /** Evaluation time — injectable so scheduling logic is testable. */
  now: Date;
}
