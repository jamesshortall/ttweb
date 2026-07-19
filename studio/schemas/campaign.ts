import { defineField, defineType } from "sanity";
import { adStatusOptions, referralFields } from "./adShared";

/**
 * A campaign groups advertisements under one advertiser, and carries shared
 * scheduling, billing, and referral defaults. Payment processing happens
 * OUTSIDE the website — these billing fields are administrative notes only.
 */
export const campaign = defineType({
  name: "campaign",
  title: "Campaign",
  type: "document",
  groups: [
    { name: "overview", title: "Overview", default: true },
    { name: "schedule", title: "Schedule" },
    { name: "referral", title: "Referral & promo" },
    { name: "billing", title: "Billing (private notes)" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Campaign name",
      type: "string",
      group: "overview",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "advertiser",
      title: "Advertiser",
      type: "reference",
      to: [{ type: "advertiser" }],
      group: "overview",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      group: "overview",
    }),
    defineField({
      name: "objective",
      title: "Campaign objective",
      type: "string",
      group: "overview",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      group: "overview",
      options: { list: adStatusOptions },
      initialValue: "draft",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "priority",
      title: "Priority / weight",
      description: "Higher wins ties; also the default weight for its ads. Default 1.",
      type: "number",
      group: "overview",
      initialValue: 1,
      validation: (r) => r.min(0),
    }),
    defineField({
      name: "startDate",
      title: "Start date & time",
      type: "datetime",
      group: "schedule",
    }),
    defineField({
      name: "endDate",
      title: "End date & time (leave empty for open-ended)",
      type: "datetime",
      group: "schedule",
      validation: (r) =>
        r.custom((end, ctx) => {
          const start = (ctx.document as { startDate?: string } | undefined)?.startDate;
          if (end && start && new Date(end) < new Date(start)) {
            return "End date must be after the start date.";
          }
          return true;
        }),
    }),
    defineField({
      name: "referral",
      title: "Referral parameters",
      type: "object",
      group: "referral",
      fields: referralFields,
      options: { collapsible: true, collapsed: true },
    }),
    defineField({
      name: "promoCode",
      title: "Promotional code",
      type: "string",
      group: "referral",
    }),
    defineField({
      name: "promoExpiry",
      title: "Promo-code expiration",
      type: "date",
      group: "referral",
    }),
    defineField({
      name: "invoiceNumber",
      title: "Invoice number",
      type: "string",
      group: "billing",
    }),
    defineField({
      name: "invoiceStatus",
      title: "Invoice status",
      type: "string",
      group: "billing",
    }),
    defineField({
      name: "paymentStatus",
      title: "Payment status",
      type: "string",
      group: "billing",
    }),
    defineField({
      name: "paymentDueDate",
      title: "Payment due date",
      type: "date",
      group: "billing",
    }),
    defineField({
      name: "amountBilled",
      title: "Amount billed",
      type: "number",
      group: "billing",
    }),
    defineField({
      name: "amountPaid",
      title: "Amount paid",
      type: "number",
      group: "billing",
    }),
    defineField({
      name: "rateNotes",
      title: "Rate / pricing notes",
      type: "text",
      rows: 2,
      group: "billing",
    }),
    defineField({
      name: "budgetNotes",
      title: "Budget notes",
      type: "text",
      rows: 2,
      group: "billing",
    }),
    defineField({
      name: "internalNotes",
      title: "Internal notes",
      type: "text",
      rows: 3,
      group: "billing",
    }),
  ],
  preview: {
    select: { title: "name", advertiser: "advertiser.displayName", status: "status" },
    prepare: ({ title, advertiser, status }) => ({
      title,
      subtitle: [advertiser, status].filter(Boolean).join(" · "),
    }),
  },
});
