import { defineField, defineType } from "sanity";
import {
  adStatusOptions,
  adTypeOptions,
  deviceTargetOptions,
  disclosureLabelOptions,
  pageTargetModeOptions,
  referralFields,
} from "./adShared";

/**
 * A single advertisement. Targeting, scheduling, creative, disclosure and
 * referral data all live here; the campaign supplies advertiser + billing.
 *
 * An ad only becomes eligible to display when status === "active" (or
 * "scheduled" once its start passes) AND it passes validation. Validation here
 * mirrors the website's runtime eligibility checks so admins catch problems in
 * Studio, not in production.
 */
export const advertisement = defineType({
  name: "advertisement",
  title: "Advertisement",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "targeting", title: "Targeting" },
    { name: "schedule", title: "Schedule" },
    { name: "referral", title: "Referral & promo" },
    { name: "disclosure", title: "Disclosure" },
    { name: "admin", title: "Admin" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Advertisement name (internal)",
      type: "string",
      group: "content",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "campaign",
      title: "Campaign",
      type: "reference",
      to: [{ type: "campaign" }],
      group: "content",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "adType",
      title: "Advertisement type",
      type: "string",
      group: "content",
      options: { list: adTypeOptions, layout: "radio" },
      initialValue: "image",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      group: "content",
      hidden: ({ parent }) => parent?.adType === "network" || parent?.adType === "html",
    }),
    defineField({
      name: "description",
      title: "Supporting text / description",
      type: "text",
      rows: 3,
      group: "content",
      hidden: ({ parent }) => parent?.adType === "network" || parent?.adType === "html",
    }),
    // ── Image creatives (responsive) ────────────────────────────────────────
    defineField({
      name: "creatives",
      title: "Image creatives",
      description:
        "Add a Responsive fallback at minimum. Optionally add device-specific creatives; the most specific match for the viewer's device wins.",
      type: "array",
      group: "content",
      hidden: ({ parent }) => parent?.adType !== "image",
      of: [
        {
          type: "object",
          name: "creative",
          fields: [
            defineField({
              name: "variant",
              title: "Variant",
              type: "string",
              options: {
                list: [
                  { title: "Responsive fallback", value: "responsive" },
                  { title: "Desktop", value: "desktop" },
                  { title: "Tablet", value: "tablet" },
                  { title: "Mobile", value: "mobile" },
                ],
              },
              initialValue: "responsive",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "image",
              title: "Image (JPEG, PNG, WebP, AVIF, or GIF)",
              type: "image",
              options: { hotspot: true },
              validation: (r) => r.required(),
            }),
            defineField({
              name: "alt",
              title: "Accessible alt text",
              type: "string",
              validation: (r) => r.required(),
            }),
          ],
          preview: { select: { title: "variant", media: "image", subtitle: "alt" } },
        },
      ],
    }),
    // ── Video ───────────────────────────────────────────────────────────────
    defineField({
      name: "videoUrl",
      title: "Video URL (hosted MP4/WebM or embed)",
      type: "url",
      group: "content",
      hidden: ({ parent }) => parent?.adType !== "video",
    }),
    defineField({
      name: "videoPoster",
      title: "Poster image",
      type: "image",
      group: "content",
      hidden: ({ parent }) => parent?.adType !== "video",
    }),
    defineField({
      name: "videoCaptionsUrl",
      title: "Captions file (VTT) — required when the video has speech",
      type: "url",
      group: "content",
      hidden: ({ parent }) => parent?.adType !== "video",
    }),
    // ── HTML / embed ─────────────────────────────────────────────────────────
    defineField({
      name: "html",
      title: "HTML / embed markup (sanitized + sandboxed before display)",
      type: "text",
      rows: 6,
      group: "content",
      hidden: ({ parent }) => parent?.adType !== "html",
    }),
    // ── Network ──────────────────────────────────────────────────────────────
    defineField({
      name: "network",
      title: "Ad network configuration",
      type: "reference",
      to: [{ type: "adNetwork" }],
      group: "content",
      hidden: ({ parent }) => parent?.adType !== "network",
    }),
    defineField({
      name: "networkSlotId",
      title: "Network slot / unit ID",
      type: "string",
      group: "content",
      hidden: ({ parent }) => parent?.adType !== "network",
    }),
    // ── Destination + CTA ────────────────────────────────────────────────────
    defineField({
      name: "destinationUrl",
      title: "Destination URL",
      description: "Must be http(s). javascript:, data:, and custom schemes are rejected.",
      type: "url",
      group: "content",
      hidden: ({ parent }) => parent?.adType === "network",
      validation: (r) =>
        r.uri({ scheme: ["http", "https"] }).custom((value, ctx) => {
          const type = (ctx.document as { adType?: string } | undefined)?.adType;
          if (type !== "network" && !value) return "A destination URL is required.";
          return true;
        }),
    }),
    defineField({
      name: "ctaLabel",
      title: "Call-to-action button label (optional)",
      type: "string",
      group: "content",
    }),
    // ── Targeting ─────────────────────────────────────────────────────────────
    defineField({
      name: "placements",
      title: "Placement zones",
      type: "array",
      group: "targeting",
      of: [{ type: "reference", to: [{ type: "placementZone" }] }],
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: "deviceTarget",
      title: "Device targeting",
      type: "string",
      group: "targeting",
      options: { list: deviceTargetOptions, layout: "radio" },
      initialValue: "all",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "pageTargetMode",
      title: "Page targeting",
      type: "string",
      group: "targeting",
      options: { list: pageTargetModeOptions, layout: "radio" },
      initialValue: "all",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "pagePaths",
      title: "Page paths (one per line, e.g. /points-and-miles-101)",
      type: "array",
      of: [{ type: "string" }],
      group: "targeting",
      hidden: ({ parent }) => parent?.pageTargetMode === "all",
    }),
    // ── Schedule ──────────────────────────────────────────────────────────────
    defineField({
      name: "startDate",
      title: "Start date & time",
      type: "datetime",
      group: "schedule",
    }),
    defineField({
      name: "endDate",
      title: "Expiration date & time (leave empty for open-ended)",
      type: "datetime",
      group: "schedule",
      validation: (r) =>
        r.custom((end, ctx) => {
          const start = (ctx.document as { startDate?: string } | undefined)?.startDate;
          if (end && start && new Date(end) < new Date(start)) {
            return "Expiration must be after the start date.";
          }
          return true;
        }),
    }),
    defineField({
      name: "weight",
      title: "Rotation weight",
      description: "Relative frequency vs. other eligible ads in the same slot. Default 1.",
      type: "number",
      group: "schedule",
      initialValue: 1,
      validation: (r) => r.min(0),
    }),
    defineField({
      name: "priority",
      title: "Priority",
      description: "Higher priority ads are preferred before weighting is applied. Default 0.",
      type: "number",
      group: "schedule",
      initialValue: 0,
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      group: "schedule",
      options: { list: adStatusOptions },
      initialValue: "draft",
      validation: (r) => r.required(),
    }),
    // ── Referral & promo ──────────────────────────────────────────────────────
    defineField({
      name: "referral",
      title: "Referral parameters (override the campaign's)",
      type: "object",
      group: "referral",
      fields: referralFields,
      options: { collapsible: true, collapsed: true },
    }),
    defineField({
      name: "promoCode",
      title: "Promotional code (shown with a copy button)",
      type: "string",
      group: "referral",
    }),
    defineField({
      name: "promoExpiry",
      title: "Promo-code expiration",
      type: "date",
      group: "referral",
    }),
    // ── Disclosure ────────────────────────────────────────────────────────────
    defineField({
      name: "disclosureEnabled",
      title: "Show a disclosure label",
      description:
        "Keep enabled for paid placements. Legally or network-required disclosures cannot be turned off.",
      type: "boolean",
      group: "disclosure",
      initialValue: true,
    }),
    defineField({
      name: "disclosureLabel",
      title: "Disclosure wording",
      type: "string",
      group: "disclosure",
      options: { list: disclosureLabelOptions },
      initialValue: "Advertisement",
      hidden: ({ parent }) => parent?.disclosureEnabled === false,
    }),
    // ── Admin ─────────────────────────────────────────────────────────────────
    defineField({
      name: "approved",
      title: "Approved by administrator",
      description:
        "Every directly managed ad must be manually approved before it can serve. Newly created ads are never auto-approved.",
      type: "boolean",
      group: "admin",
      initialValue: false,
    }),
    defineField({
      name: "reviewNotes",
      title: "Internal review notes",
      type: "text",
      rows: 2,
      group: "admin",
    }),
    defineField({
      name: "rejectionReason",
      title: "Creative rejection reason",
      type: "string",
      group: "admin",
    }),
    defineField({
      name: "notes",
      title: "Administrative notes",
      type: "text",
      rows: 3,
      group: "admin",
    }),
  ],
  preview: {
    select: { title: "name", type: "adType", status: "status", media: "creatives.0.image" },
    prepare: ({ title, type, status, media }) => ({
      title,
      subtitle: [type, status].filter(Boolean).join(" · "),
      media,
    }),
  },
});
