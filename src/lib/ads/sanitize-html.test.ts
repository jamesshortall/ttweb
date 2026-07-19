import { describe, expect, it } from "vitest";
import { sanitizeAdHtml } from "@/lib/ads/sanitize-html";

describe("sanitizeAdHtml", () => {
  it("removes script blocks and their content", () => {
    const out = sanitizeAdHtml('<p>Hi</p><script>alert("x")</script>');
    expect(out).toContain("<p>Hi</p>");
    expect(out.toLowerCase()).not.toContain("script");
    expect(out).not.toContain("alert");
  });

  it("strips event-handler attributes", () => {
    const out = sanitizeAdHtml('<a href="https://x.com" onclick="steal()">go</a>');
    expect(out).toContain('href="https://x.com"');
    expect(out.toLowerCase()).not.toContain("onclick");
    expect(out).not.toContain("steal");
  });

  it("neutralizes javascript: and data: URLs", () => {
    expect(sanitizeAdHtml('<a href="javascript:alert(1)">x</a>')).not.toContain("javascript:");
    expect(sanitizeAdHtml('<img src="data:text/html,evil">')).not.toContain("data:");
  });

  it("drops disallowed tags but keeps their text", () => {
    const out = sanitizeAdHtml("<marquee>Buy now</marquee>");
    expect(out).toContain("Buy now");
    expect(out.toLowerCase()).not.toContain("marquee");
  });

  it("removes iframe/object/embed entirely", () => {
    const out = sanitizeAdHtml('<iframe src="https://evil"></iframe><object></object>');
    expect(out.toLowerCase()).not.toContain("iframe");
    expect(out.toLowerCase()).not.toContain("object");
  });

  it("keeps allowlisted tags, attrs, and safe images", () => {
    const out = sanitizeAdHtml(
      '<div><h3>Deal</h3><img src="https://cdn/x.png" alt="ad" width="300"><a href="https://x.com" title="t">Learn</a></div>',
    );
    expect(out).toContain("<h3>Deal</h3>");
    expect(out).toContain('src="https://cdn/x.png"');
    expect(out).toContain('alt="ad"');
    expect(out).toContain('href="https://x.com"');
  });

  it("drops style attributes", () => {
    const out = sanitizeAdHtml('<p style="position:fixed;inset:0">x</p>');
    expect(out).not.toContain("style");
    expect(out).toContain("<p>x</p>");
  });

  it("returns empty string for empty input", () => {
    expect(sanitizeAdHtml("")).toBe("");
    expect(sanitizeAdHtml(undefined)).toBe("");
  });
});
