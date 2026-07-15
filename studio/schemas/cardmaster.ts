import { defineField, defineType } from "sanity";
import { iconOptions } from "./shared";

/** Feature card on the CardMaster landing page. */
export const cardmasterFeature = defineType({
  name: "cardmasterFeature",
  title: "CardMaster Feature",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      options: { list: iconOptions },
      initialValue: "sparkles",
    }),
    defineField({ name: "orderRank", title: "Sort order", type: "number", initialValue: 0 }),
  ],
  preview: { select: { title: "title" } },
});

/** Screenshot on the CardMaster landing page. */
export const cardmasterScreenshot = defineType({
  name: "cardmasterScreenshot",
  title: "CardMaster Screenshot",
  type: "document",
  fields: [
    defineField({
      name: "image",
      title: "Screenshot",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description: "Describe what the screenshot shows, for screen readers.",
          validation: (r) => r.required(),
        }),
      ],
      validation: (r) => r.required(),
    }),
    defineField({ name: "caption", title: "Caption", type: "string" }),
    defineField({ name: "orderRank", title: "Sort order", type: "number", initialValue: 0 }),
  ],
  preview: { select: { title: "caption", media: "image" } },
});
