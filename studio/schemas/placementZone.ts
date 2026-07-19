import { defineField, defineType } from "sanity";
import { deviceTargetOptions, supportedFormatOptions } from "./adShared";

/**
 * A named advertisement zone the website can request by key, e.g.
 * <AdSlot placement="points-101-inline" />. Zones are data, so new ones can be
 * added here without code changes — the website renders whatever key it asks
 * for and collapses when nothing eligible exists.
 */
export const placementZone = defineType({
  name: "placementZone",
  title: "Placement zone",
  type: "document",
  fields: [
    defineField({
      name: "internalName",
      title: "Internal name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "placementKey",
      title: "Placement key",
      description:
        "Stable identifier used in code, e.g. points-101-inline. Lowercase, hyphenated, unique.",
      type: "slug",
      options: { source: "internalName" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "publicDescription",
      title: "Description (admin-facing)",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "enabled",
      title: "Enabled",
      description: "When off, this zone always collapses regardless of eligible ads.",
      type: "boolean",
      initialValue: true,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "supportedFormats",
      title: "Supported formats",
      type: "array",
      of: [{ type: "string" }],
      options: { list: supportedFormatOptions },
      initialValue: ["image", "text"],
    }),
    defineField({
      name: "dimensions",
      title: "Recommended creative dimensions",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", title: "Label", type: "string" },
            { name: "width", title: "Width (px)", type: "number" },
            { name: "height", title: "Height (px)", type: "number" },
          ],
          preview: {
            select: { label: "label", width: "width", height: "height" },
            prepare: ({ label, width, height }) => ({
              title: label || `${width}×${height}`,
              subtitle: `${width}×${height}`,
            }),
          },
        },
      ],
    }),
    defineField({
      name: "deviceAvailability",
      title: "Device availability",
      type: "string",
      options: { list: deviceTargetOptions, layout: "radio" },
      initialValue: "all",
    }),
    defineField({
      name: "pageAvailability",
      title: "Pages where this zone exists (admin reference)",
      type: "text",
      rows: 2,
    }),
  ],
  preview: {
    select: { title: "internalName", subtitle: "placementKey.current", enabled: "enabled" },
    prepare: ({ title, subtitle, enabled }) => ({
      title,
      subtitle: `${subtitle}${enabled ? "" : " · disabled"}`,
    }),
  },
});
