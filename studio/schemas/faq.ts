import { defineField, defineType } from "sanity";

/** FAQ entry, grouped by the page it appears on. */
export const faq = defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  fields: [
    defineField({
      name: "question",
      title: "Question",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "answer",
      title: "Answer",
      type: "text",
      rows: 4,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "group",
      title: "Group",
      type: "string",
      options: {
        list: [
          { title: "General / services", value: "general" },
          { title: "CardMaster", value: "cardmaster" },
        ],
        layout: "radio",
      },
      initialValue: "general",
      validation: (r) => r.required(),
    }),
    defineField({ name: "orderRank", title: "Sort order", type: "number", initialValue: 0 }),
  ],
  preview: { select: { title: "question", subtitle: "group" } },
});
