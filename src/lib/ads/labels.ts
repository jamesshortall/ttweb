import { sanityClient } from "@/lib/cms/client";

/**
 * Map of Sanity document id → human label (campaign/advertiser/ad names) for the
 * analytics dashboard, which otherwise only has ids. Fails soft to an empty map,
 * in which case the dashboard shows raw ids.
 */
const labelsQuery = /* groq */ `
*[_type in ["campaign", "advertiser", "advertisement"]]{
  "id": _id,
  "label": coalesce(name, displayName, _id)
}`;

export async function fetchAdLabels(): Promise<Map<string, string>> {
  const client = sanityClient();
  if (!client) return new Map();
  try {
    const rows = await client.fetch<Array<{ id: string; label: string }>>(labelsQuery);
    return new Map((rows ?? []).map((r) => [r.id, r.label]));
  } catch (error) {
    console.error(`[ads] label lookup failed: ${(error as Error).message}`);
    return new Map();
  }
}
