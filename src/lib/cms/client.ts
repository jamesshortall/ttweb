import { createClient, type SanityClient } from "@sanity/client";

/**
 * Lazily constructed Sanity client. Returns null when the CMS is not
 * configured, which switches every content getter to fallback content.
 */

let client: SanityClient | null | undefined;

export function isSanityConfigured(): boolean {
  return !!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
}

export function sanityClient(): SanityClient | null {
  if (client !== undefined) return client;
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  if (!projectId) {
    client = null;
    return client;
  }
  client = createClient({
    projectId,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
    apiVersion: "2025-01-01",
    // Published content only; the token is needed solely for draft previews.
    useCdn: true,
    token: process.env.SANITY_API_TOKEN,
    perspective: "published",
  });
  return client;
}
