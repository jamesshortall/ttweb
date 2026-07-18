import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schemas";

/**
 * Travel Technician content studio.
 *
 * Set the project ID and dataset before running:
 *   SANITY_STUDIO_PROJECT_ID=xxxx SANITY_STUDIO_DATASET=production npm run dev
 * or edit the fallbacks below after creating the project with `sanity init`.
 */
export default defineConfig({
  name: "travel-technician",
  title: "Travel Technician",
  projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? "your-project-id",
  dataset: process.env.SANITY_STUDIO_DATASET ?? "production",
  plugins: [structureTool()],
  schema: {
    types: schemaTypes,
  },
});
