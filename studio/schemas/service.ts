import { defineField, defineType } from "sanity";
import { iconOptions } from "./shared";

/** A consulting/education service, rendered at /services/[slug]. */
export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "tagline", title: "Tagline", type: "string" }),
    defineField({
      name: "summary",
      title: "Summary (cards and listings)",
      type: "text",
      rows: 3,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      options: { list: iconOptions },
      initialValue: "compass",
    }),
    defineField({
      name: "description",
      title: "Detail-page paragraphs",
      type: "array",
      of: [{ type: "text", rows: 4 }],
    }),
    defineField({
      name: "bestFor",
      title: '"Great fit if…" bullets',
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "includes",
      title: '"What\'s included" bullets',
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "boundaries",
      title: "Honest boundaries",
      description: 'e.g. "not financial advice", "no travel booking". Keep these accurate.',
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "cta",
      title: "Call-to-action label",
      type: "string",
      initialValue: "Contact Jim for Details",
    }),
    defineField({
      name: "featured",
      title: "Featured on homepage?",
      type: "boolean",
      initialValue: false,
    }),
    defineField({ name: "orderRank", title: "Sort order", type: "number", initialValue: 0 }),
  ],
  preview: { select: { title: "name", subtitle: "tagline" } },
});
