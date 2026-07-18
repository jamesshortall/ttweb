import { defineField, defineType } from "sanity";

/**
 * Educational article for either learning hub (Points & Miles 101 or Tips &
 * Strategies) — the two hubs share one content system by design.
 */
export const article = defineType({
  name: "article",
  title: "Article",
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
      name: "collection",
      title: "Hub",
      type: "string",
      options: {
        list: [
          { title: "Points & Miles 101", value: "points-101" },
          { title: "Tips & Strategies", value: "tips" },
        ],
        layout: "radio",
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      title: "Description (cards + meta description)",
      type: "text",
      rows: 3,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      description: "e.g. Foundations, Earning, Redeeming, Transfer Bonuses, Family Strategies…",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "readingMinutes",
      title: "Reading time (minutes)",
      type: "number",
      initialValue: 5,
      validation: (r) => r.required().positive(),
    }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "heading", title: "Heading", type: "string" }),
            defineField({
              name: "paragraphs",
              title: "Paragraphs",
              type: "array",
              of: [{ type: "text", rows: 4 }],
            }),
            defineField({
              name: "bullets",
              title: "Bullet list (optional)",
              type: "array",
              of: [{ type: "text", rows: 2 }],
            }),
          ],
          preview: { select: { title: "heading" } },
        },
      ],
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: "keyTakeaways",
      title: "Key takeaways",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({ name: "orderRank", title: "Sort order", type: "number", initialValue: 0 }),
  ],
  preview: { select: { title: "title", subtitle: "collection" } },
});
