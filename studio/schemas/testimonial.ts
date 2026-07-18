import { defineField, defineType } from "sanity";

/**
 * Client testimonial — modeled for future use. Nothing on the site renders
 * these yet (no invented testimonials at launch); when real ones exist, add a
 * section and query for them.
 */
export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial (future use)",
  type: "document",
  fields: [
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      rows: 4,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "attribution",
      title: "Attribution",
      description: 'e.g. "Sarah M., family of four" — get written permission first.',
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({ name: "context", title: "Context (service used, trip)", type: "string" }),
    defineField({
      name: "permissionConfirmed",
      title: "Written permission on file?",
      type: "boolean",
      initialValue: false,
      validation: (r) => r.required(),
    }),
  ],
  preview: { select: { title: "attribution", subtitle: "context" } },
});
