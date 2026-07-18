import { defineField, defineType } from "sanity";

/** An entry in the Resources library. Categories are free-form and group automatically. */
export const resource = defineType({
  name: "resource",
  title: "Resource",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      description:
        "e.g. Getting Started, Airline Loyalty Programs, Hotel Loyalty Programs, Transferable Points, Credit Card Benefits, Award Travel Basics, Points Tracking, Annual Fee Management, Travel Tools, CardMaster Guides",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "kind",
      title: "Kind",
      type: "string",
      options: {
        list: [
          { title: "Internal article", value: "internal" },
          { title: "External link (marked as leaving the site)", value: "external" },
          { title: "Blog link", value: "blog" },
          { title: "Downloadable guide", value: "download" },
          { title: "Checklist", value: "checklist" },
        ],
      },
      initialValue: "internal",
    }),
    defineField({
      name: "href",
      title: "Link",
      description: "Internal path (/points-and-miles-101/…) or full external URL.",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({ name: "orderRank", title: "Sort order", type: "number", initialValue: 0 }),
  ],
  preview: { select: { title: "title", subtitle: "category" } },
});
