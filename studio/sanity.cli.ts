import { defineCliConfig } from "sanity/cli";

/**
 * Sanity CLI configuration (required by `sanity build` / `sanity deploy` from
 * v5 onward). Project ID and dataset come from the environment, matching
 * sanity.config.ts:
 *
 *   SANITY_STUDIO_PROJECT_ID=xxxx SANITY_STUDIO_DATASET=production npm run deploy
 */
export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? "your-project-id",
    dataset: process.env.SANITY_STUDIO_DATASET ?? "production",
  },
});
