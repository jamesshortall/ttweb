/**
 * Shared option lists for the advertising schemas. Values MUST stay in sync
 * with the website's ad-serving layer (src/lib/ads/types.ts and select.ts).
 */

export const adStatusOptions = [
  { title: "Draft (not public)", value: "draft" },
  { title: "Pending Approval (not public)", value: "pending" },
  { title: "Scheduled (auto-activates at start)", value: "scheduled" },
  { title: "Active", value: "active" },
  { title: "Paused", value: "paused" },
  { title: "Expired", value: "expired" },
  { title: "Archived", value: "archived" },
];

export const adTypeOptions = [
  { title: "Responsive image", value: "image" },
  { title: "Text", value: "text" },
  { title: "Video", value: "video" },
  { title: "HTML / embed (sandboxed)", value: "html" },
  { title: "Ad network (e.g. AdSense)", value: "network" },
];

export const deviceTargetOptions = [
  { title: "All devices", value: "all" },
  { title: "Desktop only", value: "desktop" },
  { title: "Tablet only", value: "tablet" },
  { title: "Mobile only", value: "mobile" },
];

export const pageTargetModeOptions = [
  { title: "Every eligible page", value: "all" },
  { title: "Only the selected pages", value: "include" },
  { title: "All pages except the selected ones", value: "exclude" },
];

export const disclosureLabelOptions = [
  { title: "Advertisement", value: "Advertisement" },
  { title: "Sponsored", value: "Sponsored" },
  { title: "Paid Placement", value: "Paid Placement" },
  { title: "Partner Message", value: "Partner Message" },
];

export const supportedFormatOptions = [
  { title: "Image", value: "image" },
  { title: "Text", value: "text" },
  { title: "Video", value: "video" },
  { title: "HTML / embed", value: "html" },
  { title: "Network", value: "network" },
];

/** UTM + referral fields reused by campaigns and advertisements. */
export const referralFields = [
  { name: "utmSource", title: "UTM source", type: "string" },
  { name: "utmMedium", title: "UTM medium", type: "string" },
  { name: "utmCampaign", title: "UTM campaign", type: "string" },
  { name: "utmContent", title: "UTM content", type: "string" },
  { name: "utmTerm", title: "UTM term", type: "string" },
  { name: "referralId", title: "Referral ID", type: "string" },
  {
    name: "customParams",
    title: "Custom referral parameters (key=value per line)",
    type: "text",
    rows: 3,
  },
  {
    name: "attributionNotes",
    title: "Internal attribution notes (never shown publicly)",
    type: "text",
    rows: 2,
  },
];
