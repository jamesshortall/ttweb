import { describe, expect, it } from "vitest";
import { apps } from "@/content/apps";

describe("apps registry", () => {
  it("includes CardMaster and AppPassport with their real domains", () => {
    const byId = new Map(apps.map((a) => [a.id, a]));
    expect(byId.get("cardmaster")?.url).toContain("cardmaster.traveltechnician.info");
    expect(byId.get("apppassport")?.url).toContain("passport.traveltechnician.info");
  });

  it("has complete, valid entries (unique ids, https urls, no leftover placeholders)", () => {
    const ids = new Set<string>();
    for (const app of apps) {
      expect(app.id).toBeTruthy();
      expect(ids.has(app.id)).toBe(false);
      ids.add(app.id);
      expect(app.name && app.tagline && app.description && app.cta).toBeTruthy();
      expect(app.url).toMatch(/^https:\/\//);
      expect(app.needsCopy).not.toBe(true);
      expect(app.description).not.toMatch(/placeholder/i);
    }
  });
});
