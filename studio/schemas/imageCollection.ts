import { defineField, defineType } from "sanity";

/**
 * A rotating-image collection used by hero sections and galleries. The `key`
 * must match one the site requests: homeHero, destinations, successStories,
 * aboutJim.
 */
export const imageCollection = defineType({
  name: "imageCollection",
  title: "Rotating Image Collection",
  type: "document",
  fields: [
    defineField({
      name: "key",
      title: "Collection key",
      type: "string",
      options: {
        list: [
          { title: "Homepage hero", value: "homeHero" },
          { title: "Destination gallery", value: "destinations" },
          { title: "Success stories hero", value: "successStories" },
          { title: "About Jim — travel photos", value: "aboutJim" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "intervalMs",
      title: "Rotation interval (milliseconds)",
      description: "Default 60000 (~60 seconds). Keep rotations calm and stable.",
      type: "number",
      initialValue: 60000,
      validation: (r) => r.required().min(10000),
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [
        {
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
        },
      ],
      validation: (r) => r.required().min(1),
    }),
  ],
  preview: { select: { title: "key" } },
});
