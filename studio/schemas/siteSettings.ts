import { defineField, defineType } from "sanity";

/**
 * Singleton: site-wide editable settings — hero copy, the pending
 * estimated-travel-value figure, newsletter mode, and social links.
 * Secrets and critical configuration stay in environment variables, never here.
 */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "heroHeadline",
      title: "Homepage hero headline",
      type: "string",
      initialValue: "Turn your points into unforgettable travel.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroSubheadline",
      title: "Homepage hero supporting copy",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "estimatedTravelValue",
      title: "Estimated travel value statistic",
      description:
        'PLACEHOLDER until finalized — e.g. "$150,000+". Shown as "[value] in estimated travel value". Leave empty to keep the placeholder badge.',
      type: "string",
    }),
    defineField({
      name: "spotlight",
      title: "Homepage spotlight",
      description:
        "Feature one existing item on the homepage. Change it anytime to rotate — no redeploy needed. Leave empty to hide the spotlight section entirely.",
      type: "reference",
      to: [
        { type: "article" },
        { type: "resource" },
        { type: "successStory" },
        { type: "service" },
      ],
    }),
    defineField({
      name: "spotlightEyebrow",
      title: "Spotlight label",
      description: 'Small label above the spotlight, e.g. "Editor\'s pick" or "Featured this week". Defaults to "Featured".',
      type: "string",
    }),
    defineField({
      name: "spotlightBlurb",
      title: "Spotlight blurb (optional)",
      description:
        "A custom one-line description shown with the spotlight. Leave empty to use the item's own description.",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "newsletter",
      title: "Newsletter section",
      type: "object",
      fields: [
        defineField({
          name: "mode",
          title: "Mode",
          type: "string",
          options: {
            list: [
              { title: "Coming soon (announcement only)", value: "coming-soon" },
              { title: "Active (requires provider integration)", value: "active" },
              { title: "Hidden", value: "hidden" },
            ],
            layout: "radio",
          },
          initialValue: "coming-soon",
        }),
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({ name: "body", title: "Body copy", type: "text", rows: 3 }),
        defineField({
          name: "topics",
          title: "Planned topics",
          type: "array",
          of: [{ type: "string" }],
        }),
      ],
    }),
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "object",
      fields: [
        defineField({ name: "instagram", title: "Instagram URL", type: "url" }),
        defineField({ name: "facebook", title: "Facebook URL", type: "url" }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site Settings" }),
  },
});
