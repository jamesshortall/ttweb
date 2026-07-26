import type { Device } from "@/lib/ads/types";

/**
 * Coarse device bucketing from the User-Agent string.
 *
 * Deliberately coarse and stateless: three buckets, no version parsing, no
 * fingerprinting, no stored identifier. It exists only to pick device-targeted
 * creatives and to bucket analytics — CSS handles the actual responsive layout.
 * Unknown/ambiguous agents fall back to "desktop" for targeting but are recorded
 * as "unknown" so reporting stays honest.
 */
export function deviceFromUserAgent(userAgent: string | null | undefined): Device {
  if (!userAgent) return "unknown";
  const ua = userAgent.toLowerCase();

  // Tablets first — many tablet UAs also contain "mobile"/"android".
  const isTablet =
    /ipad/.test(ua) ||
    /tablet/.test(ua) ||
    /playbook/.test(ua) ||
    /kindle|silk/.test(ua) ||
    (/android/.test(ua) && !/mobile/.test(ua));
  if (isTablet) return "tablet";

  const isMobile =
    /iphone|ipod/.test(ua) ||
    /android.*mobile/.test(ua) ||
    /windows phone/.test(ua) ||
    /blackberry|bb10|mobile/.test(ua);
  if (isMobile) return "mobile";

  return "desktop";
}

/** For creative/targeting decisions, treat "unknown" as "desktop". */
export function targetableDevice(device: Device): Exclude<Device, "unknown"> {
  return device === "unknown" ? "desktop" : device;
}
