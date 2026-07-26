import { defineField, defineType } from "sanity";
import { iconOptions } from "./shared";

/**
 * A Travel Technician app or web property, shown on the /apps hub. Manage the
 * suite here — add a new app by creating a document. Each app can use an
 * UPLOADED photo/logo (preferred) or fall back to a built-in duotone icon.
 * When no app documents exist, the site uses its built-in registry
 * (src/content/apps.ts).
 */
export const app = defineType({
  name: "app",
  title: "App / web property",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "tagline",
      title: "Tagline (one line)",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      title: "Description (a sentence or two)",
      type: "text",
      rows: 3,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "url",
      title: "Link",
      type: "url",
      validation: (r) => r.required().uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "image",
      title: "Logo or photo (upload)",
      description: "Upload an image to show on the card. If empty, the icon below is used instead.",
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
    defineField({
      name: "icon",
      title: "Icon (fallback when no image is uploaded)",
      type: "string",
      options: { list: iconOptions },
      initialValue: "compass",
    }),
    defineField({
      name: "badge",
      title: "Badge (optional, e.g. Free / New)",
      type: "string",
    }),
    defineField({
      name: "cta",
      title: "Button label",
      type: "string",
      initialValue: "Open app",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Live", value: "live" },
          { title: "Coming soon", value: "coming-soon" },
        ],
        layout: "radio",
      },
      initialValue: "live",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "kind",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "App", value: "app" },
          { title: "Website", value: "site" },
        ],
        layout: "radio",
      },
      initialValue: "app",
    }),
    defineField({ name: "orderRank", title: "Sort order", type: "number", initialValue: 0 }),
  ],
  preview: {
    select: { title: "name", subtitle: "tagline", media: "image" },
  },
});
