import { defineField, defineType } from "sanity";

/**
 * Third-party ad-network configuration (e.g. Google AdSense). DISABLED by
 * default and inert until explicitly enabled. Private API credentials and
 * signing secrets are NOT stored here — they live in environment variables.
 * This document only holds the non-secret, publisher-level configuration.
 */
export const adNetwork = defineType({
  name: "adNetwork",
  title: "Ad network",
  type: "document",
  fields: [
    defineField({
      name: "networkName",
      title: "Network name",
      type: "string",
      options: {
        list: [
          { title: "Google AdSense", value: "adsense" },
          { title: "Other", value: "other" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "enabled",
      title: "Enabled",
      description:
        "Leave OFF for launch. When on, network scripts still load only after ad-consent is granted and the placement opts in.",
      type: "boolean",
      initialValue: false,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "publisherId",
      title: "Publisher identifier (non-secret, e.g. ca-pub-XXXX)",
      type: "string",
    }),
    defineField({
      name: "unitIds",
      title: "Placement / unit IDs",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "consentCategory",
      title: "Required consent category",
      type: "string",
      initialValue: "advertising",
    }),
    defineField({
      name: "testingMode",
      title: "Testing mode",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "notes",
      title: "Administrative notes",
      type: "text",
      rows: 3,
    }),
  ],
  preview: {
    select: { title: "networkName", enabled: "enabled" },
    prepare: ({ title, enabled }) => ({
      title,
      subtitle: enabled ? "enabled" : "disabled",
    }),
  },
});
