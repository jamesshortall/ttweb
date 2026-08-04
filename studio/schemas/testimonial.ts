import { defineField, defineType } from "sanity";

/**
 * Client testimonial. Real submissions arrive from the website form as
 * UNPUBLISHED drafts with `permissionConfirmed` = false; nothing reaches the
 * public site until an administrator (a) confirms written permission to
 * publish and (b) publishes the document.
 *
 * The website only ever renders testimonials where `permissionConfirmed` is
 * true, so an accidental publish still cannot expose an unverified quote. No
 * testimonials are ever invented.
 */
export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "review", title: "Review & permission" },
  ],
  fields: [
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      rows: 4,
      group: "content",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "attribution",
      title: "Attribution",
      description: 'e.g. "Sarah M., family of four" — get written permission first.',
      type: "string",
      group: "content",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "context",
      title: "Context (service used, trip)",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "rating",
      title: "Rating (optional, 1-5)",
      type: "number",
      group: "content",
      validation: (r) => r.min(1).max(5).integer(),
    }),
    defineField({
      name: "featured",
      title: "Feature on the homepage",
      type: "boolean",
      group: "content",
      initialValue: false,
    }),
    defineField({
      name: "orderRank",
      title: "Sort order",
      type: "number",
      group: "content",
      initialValue: 0,
    }),
    // Review & permission
    defineField({
      name: "permissionConfirmed",
      title: "Written permission to publish is on file",
      description:
        "REQUIRED before this testimonial can appear on the site. Confirm the person agreed to have their words (and attribution) published.",
      type: "boolean",
      group: "review",
      initialValue: false,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "source",
      title: "Source",
      type: "string",
      group: "review",
      options: {
        list: [
          { title: "Website form", value: "form" },
          { title: "Entered manually", value: "manual" },
        ],
      },
      initialValue: "manual",
      readOnly: ({ value }) => value === "form",
    }),
    defineField({
      name: "submittedEmail",
      title: "Submitter email (private - never published)",
      description: "Captured from the form so you can verify authenticity and confirm permission.",
      type: "string",
      group: "review",
      readOnly: true,
    }),
    defineField({
      name: "submittedAt",
      title: "Submitted at",
      type: "datetime",
      group: "review",
      readOnly: true,
    }),
  ],
  preview: {
    select: { title: "attribution", subtitle: "context", confirmed: "permissionConfirmed" },
    prepare: ({ title, subtitle, confirmed }) => ({
      title: title || "Untitled testimonial",
      subtitle: [confirmed ? "permission on file" : "needs permission", subtitle]
        .filter(Boolean)
        .join(" - "),
    }),
  },
});
