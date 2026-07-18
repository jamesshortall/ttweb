/**
 * Seed a Sanity project with all of the site's built-in content, so the whole
 * site becomes editable in Sanity Studio (not just photos).
 *
 * It reads scripts/seed-data.json (generated from src/content), uploads the
 * referenced images from /public, and creates/updates one document per entry.
 * Re-running is safe: documents use stable IDs and are replaced, not duplicated.
 *
 * Usage (from the repo root, where node_modules is installed):
 *
 *   # 1. create a write token: manage.sanity.io -> your project -> API ->
 *   #    Tokens -> Add token -> "Editor" permission. Copy it.
 *   # 2. run it:
 *   #    macOS/Linux:
 *   SANITY_PROJECT_ID=xxxx SANITY_WRITE_TOKEN=yyyy node scripts/seed-sanity.mjs
 *   #    Windows PowerShell:
 *   $env:SANITY_PROJECT_ID="xxxx"; $env:SANITY_WRITE_TOKEN="yyyy"; node scripts/seed-sanity.mjs
 *
 *   # preview without writing anything:
 *   node scripts/seed-sanity.mjs --dry
 */
import { createClient } from "@sanity/client";
import { createReadStream, existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const DRY = process.argv.includes("--dry");
const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || "production";
const token = process.env.SANITY_WRITE_TOKEN || process.env.SANITY_AUTH_TOKEN;

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "public");
const docs = JSON.parse(readFileSync(path.join(root, "scripts", "seed-data.json"), "utf8"));

if (!DRY && (!projectId || !token)) {
  console.error(
    "Missing config. Set SANITY_PROJECT_ID and SANITY_WRITE_TOKEN, or pass --dry to preview.\n" +
      "Create a write token at manage.sanity.io -> your project -> API -> Tokens (Editor).",
  );
  process.exit(1);
}

const client = DRY
  ? null
  : createClient({ projectId, dataset, apiVersion: "2025-01-01", token, useCdn: false });

const assetCache = new Map();
async function uploadImage(src) {
  if (assetCache.has(src)) return assetCache.get(src);
  const filePath = path.join(publicDir, src.replace(/^\//, ""));
  if (!existsSync(filePath)) {
    console.warn(`   ! image not found, skipping: ${src}`);
    assetCache.set(src, null);
    return null;
  }
  if (DRY) {
    const fake = `image-DRY-${path.basename(filePath)}`;
    assetCache.set(src, fake);
    return fake;
  }
  try {
    const asset = await client.assets.upload("image", createReadStream(filePath), {
      filename: path.basename(filePath),
    });
    assetCache.set(src, asset._id);
    return asset._id;
  } catch (e) {
    console.warn(`   ! upload failed (${src}): ${e.message}`);
    assetCache.set(src, null);
    return null;
  }
}

// Recursively replace { _upload, alt, _key? } markers with real Sanity image
// objects, dropping any array item whose image could not be uploaded.
async function resolve(value) {
  if (Array.isArray(value)) {
    const out = [];
    for (const v of value) {
      const r = await resolve(v);
      if (r !== null) out.push(r);
    }
    return out;
  }
  if (value && typeof value === "object") {
    if (typeof value._upload === "string") {
      const assetId = await uploadImage(value._upload);
      if (!assetId) return null;
      const img = { _type: "image", asset: { _type: "reference", _ref: assetId } };
      if (value.alt) img.alt = value.alt;
      if (value._key) img._key = value._key;
      return img;
    }
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = await resolve(v);
    return out;
  }
  return value;
}

console.log(
  `${DRY ? "[DRY RUN] " : ""}Seeding ${docs.length} documents into ${projectId || "(none)"}/${dataset}\n`,
);
let ok = 0;
let fail = 0;
for (const raw of docs) {
  try {
    const doc = await resolve(raw);
    if (!DRY) await client.createOrReplace(doc);
    ok++;
    console.log(`   ${DRY ? "·" : "✓"} ${doc._type.padEnd(20)} ${doc._id}`);
  } catch (e) {
    fail++;
    console.error(`   ✗ ${raw._type} ${raw._id}: ${e.message}`);
  }
}
console.log(
  `\n${DRY ? "[DRY RUN] " : ""}Done. ${ok} ok, ${fail} failed, ${assetCache.size} images ${DRY ? "found" : "uploaded"}.`,
);
if (!DRY && fail === 0) {
  console.log(
    "\nAll content is now in your Studio. To make the live site render from Sanity, set\n" +
      "NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET on the server, then rebuild.",
  );
}
