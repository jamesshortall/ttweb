import { defineField, defineType } from "sanity";

/**
 * Hand-picked blog article card shown when the RSS feed isn't configured (and
 * in the Blog page's "Featured" section). Links must point to real posts on
 * blog.traveltechnician.info.
 */
export const featuredBlogPost = defineType({
  name: "featuredBlogPost",
  title: "Featured Blog Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Post title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "url",
      title: "Post URL",
      type: "url",
      description: "Full URL on blog.traveltechnician.info.",
      validation: (r) => r.required(),
    }),
    defineField({ name: "excerpt", title: "Excerpt", type: "text", rows: 3 }),
    defineField({ name: "publishedAt", title: "Published date", type: "date" }),
  ],
  preview: { select: { title: "title", subtitle: "url" } },
});
