import { defineField, defineType } from "sanity";

/**
 * Legal-page content (Privacy Policy, Terms, Disclaimer, Accessibility).
 * The built-in fallback text ships in the site repo; once counsel-approved
 * text exists it can be managed here instead.
 */
export const legalPage = defineType({
  name: "legalPage",
  title: "Legal Page",
  type: "document",
  fields: [
    defineField({
      name: "slug",
      title: "Page",
      type: "string",
      options: {
        list: [
          { title: "Privacy Policy", value: "privacy-policy" },
          { title: "Terms of Use", value: "terms-of-use" },
          { title: "Disclaimer", value: "disclaimer" },
          { title: "Accessibility Statement", value: "accessibility" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "lastUpdated", title: "Last updated (display text)", type: "string" }),
    defineField({ name: "intro", title: "Intro paragraph", type: "text", rows: 3 }),
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
              title: "Bullets (optional)",
              type: "array",
              of: [{ type: "text", rows: 2 }],
            }),
          ],
          preview: { select: { title: "heading" } },
        },
      ],
    }),
  ],
  preview: { select: { title: "title", subtitle: "slug" } },
});
