import { defineField, defineType } from "sanity";

/**
 * An advertiser (the organization buying placements). Contact and billing
 * details are private — they are never projected to the public website; only
 * the display name may surface, and only inside a disclosure if configured.
 */
export const advertiser = defineType({
  name: "advertiser",
  title: "Advertiser",
  type: "document",
  groups: [
    { name: "identity", title: "Identity", default: true },
    { name: "contact", title: "Contact (private)" },
    { name: "billing", title: "Billing (private)" },
    { name: "admin", title: "Admin" },
  ],
  fields: [
    defineField({
      name: "companyName",
      title: "Company / organization name",
      type: "string",
      group: "identity",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "displayName",
      title: "Public display name",
      description: "The only advertiser name that may ever appear on the public site.",
      type: "string",
      group: "identity",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "internalId",
      title: "Internal advertiser ID",
      type: "string",
      group: "identity",
    }),
    defineField({
      name: "category",
      title: "Industry / advertiser category",
      type: "string",
      group: "identity",
    }),
    defineField({
      name: "website",
      title: "Website",
      type: "url",
      group: "identity",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      group: "identity",
      options: {
        list: [
          { title: "Active", value: "active" },
          { title: "Inactive", value: "inactive" },
        ],
        layout: "radio",
      },
      initialValue: "active",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "contactName",
      title: "Primary contact name",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "contactEmail",
      title: "Contact email",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "contactPhone",
      title: "Contact phone",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "billingAddress",
      title: "Billing address",
      type: "text",
      rows: 3,
      group: "billing",
    }),
    defineField({
      name: "billingNotes",
      title: "Billing notes",
      type: "text",
      rows: 3,
      group: "billing",
    }),
    defineField({
      name: "contractNotes",
      title: "Contract notes",
      type: "text",
      rows: 3,
      group: "billing",
    }),
    defineField({
      name: "relationshipStart",
      title: "Start of relationship",
      type: "date",
      group: "admin",
    }),
    defineField({
      name: "relationshipEnd",
      title: "End of relationship",
      type: "date",
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
  preview: { select: { title: "displayName", subtitle: "companyName" } },
});
