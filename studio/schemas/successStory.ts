import { defineField, defineType } from "sanity";

/**
 * A real redemption example. The site computes cents-per-point from the
 * numbers below and always labels it as an estimate — enter honest figures.
 */
export const successStory = defineType({
  name: "successStory",
  title: "Success Story",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "route",
      title: "Route",
      description: 'e.g. "Boston (BOS) → Doha (DOH) → Singapore (SIN)"',
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "airline",
      title: "Airline",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({ name: "cabin", title: "Cabin", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "pointsUsed",
      title: "Points/miles used",
      type: "number",
      validation: (r) => r.required().positive(),
    }),
    defineField({
      name: "pointsUnit",
      title: "Unit",
      type: "string",
      options: { list: ["points", "miles"], layout: "radio" },
      initialValue: "points",
    }),
    defineField({
      name: "taxesFeesUsd",
      title: "Taxes and fees (USD)",
      type: "number",
      validation: (r) => r.required().min(0),
    }),
    defineField({
      name: "cashValueUsd",
      title: "Approximate comparable cash price (USD)",
      type: "number",
      validation: (r) => r.required().positive(),
    }),
    defineField({ name: "summary", title: "Summary", type: "text", rows: 3 }),
    defineField({
      name: "whyValuable",
      title: "Why this redemption was valuable",
      type: "array",
      of: [{ type: "text", rows: 3 }],
    }),
    defineField({
      name: "context",
      title: "Important context and limitations",
      description: "Honesty section — availability caveats, cash-price context, etc.",
      type: "array",
      of: [{ type: "text", rows: 3 }],
    }),
    defineField({
      name: "highlight",
      title: "Badge text",
      description: 'e.g. "Estimated 9¢ per point in value"',
      type: "string",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (r) => r.required(),
        }),
      ],
    }),
    defineField({ name: "orderRank", title: "Sort order", type: "number", initialValue: 0 }),
  ],
  preview: { select: { title: "title", subtitle: "route", media: "image" } },
});
