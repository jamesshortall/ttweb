/**
 * GROQ for the ad-serving layer. Projections flatten Sanity documents into the
 * Advertisement / PlacementZone shapes in ./types.ts. Private advertiser data
 * (contact, billing) is deliberately never projected here.
 */

export const placementZoneQuery = /* groq */ `
*[_type == "placementZone" && placementKey.current == $key][0] {
  "key": placementKey.current,
  internalName,
  "enabled": coalesce(enabled, false),
  "supportedFormats": coalesce(supportedFormats, ["image", "text"]),
  "deviceAvailability": coalesce(deviceAvailability, "all")
}`;

/**
 * Every advertisement assigned to the given placement key. Scheduling, status,
 * device and page filtering happen in select.ts (pure + testable) rather than
 * in GROQ, so eligibility rules live in one place and can be unit-tested.
 */
export const adsForPlacementQuery = /* groq */ `
*[_type == "advertisement" && $key in placements[]->placementKey.current] {
  "id": _id,
  name,
  "adType": coalesce(adType, "image"),
  "status": coalesce(status, "draft"),
  "approved": coalesce(approved, false),
  "campaignId": campaign->_id,
  "campaignStatus": coalesce(campaign->status, "draft"),
  "advertiserId": campaign->advertiser->_id,
  "advertiserDisplayName": campaign->advertiser->displayName,
  headline,
  description,
  "creatives": coalesce(creatives[]{
    "variant": coalesce(variant, "responsive"),
    "src": image.asset->url,
    "alt": coalesce(alt, ""),
    "width": image.asset->metadata.dimensions.width,
    "height": image.asset->metadata.dimensions.height
  }, []),
  videoUrl,
  "videoPoster": videoPoster.asset->url,
  videoCaptionsUrl,
  html,
  networkSlotId,
  destinationUrl,
  ctaLabel,
  "placementKeys": coalesce(placements[]->placementKey.current, []),
  "deviceTarget": coalesce(deviceTarget, "all"),
  "pageTargetMode": coalesce(pageTargetMode, "all"),
  "pagePaths": coalesce(pagePaths, []),
  startDate,
  endDate,
  "weight": coalesce(weight, 1),
  "priority": coalesce(priority, 0),
  "referral": referral{
    utmSource, utmMedium, utmCampaign, utmContent, utmTerm, referralId, customParams
  },
  promoCode,
  promoExpiry,
  "disclosure": {
    "enabled": coalesce(disclosureEnabled, true),
    "label": coalesce(disclosureLabel, "Advertisement")
  }
}`;
