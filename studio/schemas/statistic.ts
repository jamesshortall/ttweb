import { defineField, defineType } from "sanity";

/** Homepage statistics band ("5M+ points redeemed", etc.). */
export const statistic = defineType({
  name: "statistic",
  title: "Statistic",
  type: "document",
  fields: [
    defineField({
      name: "value",
      title: "Value",
      description: 'Display value, e.g. "5M+" or "30+".',
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "description", title: "Description (optional)", type: "text", rows: 2 }),
    defineField({
      name: "isPlaceholder",
      title: "Placeholder value?",
      description: 'Shows a "final figure pending" badge until the real value is confirmed.',
      type: "boolean",
      initialValue: false,
    }),
    defineField({ name: "orderRank", title: "Sort order", type: "number", initialValue: 0 }),
  ],
  orderings: [
    { title: "Sort order", name: "orderRank", by: [{ field: "orderRank", direction: "asc" }] },
  ],
  preview: {
    select: { title: "value", subtitle: "label" },
  },
});
