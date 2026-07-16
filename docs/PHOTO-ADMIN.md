# Managing Your Photos (no code, no rebuild)

This is the plain-English, start-to-finish guide to changing the site's photos yourself.
The "admin" is **Sanity Studio** — a website you log into. Once it's set up, you add, swap,
reorder, or remove photos there and they appear on the live site automatically. You never
touch code and nothing has to be rebuilt.

If Sanity is **not** set up yet, the site still works: it ships with a full set of built-in
photos as a safe fallback. Setting up the Studio simply gives you the switch to change them
yourself.

---

## One-time setup (about 15 minutes)

Do this once. A developer can do it for you, or you can follow along.

1. **Create the CMS project.** Go to [sanity.io](https://www.sanity.io), sign up (free),
   and create a new project. Give it the name "Travel Technician". Copy its **Project ID**
   (a short string like `ab12cd34`).

2. **Tell the website about it.** In your hosting dashboard (e.g. Vercel → Project →
   Settings → Environment Variables), add:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID` = your Project ID
   - `NEXT_PUBLIC_SANITY_DATASET` = `production`

   Redeploy once so the values take effect. (Full env reference: `.env.example`.)

3. **Publish the Studio (the admin you'll log into).** From the project's `studio/` folder:

   ```bash
   cd studio
   npm install
   SANITY_STUDIO_PROJECT_ID=<your Project ID> npm run deploy
   ```

   This gives you a permanent admin URL like `https://travel-technician.sanity.studio`.
   Bookmark it — that's where you'll manage photos.

4. **Turn on instant updates (recommended).** So edits show up in seconds instead of within
   the hour, add the publish webhook — steps in
   [DEPLOYMENT.md → Instant updates (publish webhook)](DEPLOYMENT.md#instant-updates-publish-webhook).

5. **Invite yourself/others** as editors under the Sanity project's **Members** tab.

---

## Day-to-day: change a photo

1. Open your Studio URL and log in.
2. For the rotating photos on the site, open **Rotating Image Collections** and pick the one
   you want:
   - **Homepage hero** — the big rotating images at the top of the home page
   - **Destination gallery** — the destinations band
   - **Success stories hero** — the top of the Success Stories page
   - **About Jim — travel photos** — the About page gallery
3. In **Images**, drag in a new photo (or remove/reorder existing ones). **Write alt text**
   for each — a short description of what's in the photo (required, and it's what screen
   readers and search engines read).
4. Click **Publish**. The live site updates — within seconds if the webhook is on, otherwise
   within the hour. No rebuild, no code.

Other photo spots work the same way:

- **Success story photo:** Success Stories → open a story → replace its image.
- **CardMaster screenshots:** CardMaster Screenshots → add/replace, with alt text + caption.

The first image in a collection is the one visitors see first, so lead with your best. Keep
3–6 images per collection. For sizes, compression, and alt-text tips, see
[IMAGES.md](IMAGES.md).

---

## Good to know

- **Undo:** Sanity keeps full history — open a document's menu to restore an earlier version.
- **Reset to the built-in photos:** deleting all documents of a type makes the site fall back
  to the photos shipped in the repo. Nothing breaks.
- **Everything else too:** the same Studio manages stats, services, success stories,
  articles, FAQs, resources, and legal text — see [CONTENT-GUIDE.md](CONTENT-GUIDE.md).
