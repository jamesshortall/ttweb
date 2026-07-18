import { describe, expect, it } from "vitest";
import { parseFeed } from "@/lib/rss";

const rssSample = `<?xml version="1.0"?>
<rss version="2.0">
  <channel>
    <title>Travel Technician Blog</title>
    <item>
      <title>Five Transfer Bonuses Worth Knowing</title>
      <link>https://blog.traveltechnician.info/transfer-bonuses</link>
      <pubDate>Mon, 06 Jul 2026 10:00:00 GMT</pubDate>
      <description><![CDATA[<p>Transfer bonuses can stretch your points &amp; miles much further&hellip;</p>]]></description>
    </item>
    <item>
      <title>QSuites Award Space Patterns</title>
      <link>https://blog.traveltechnician.info/qsuites-patterns</link>
      <pubDate>Wed, 01 Jul 2026 10:00:00 GMT</pubDate>
      <description>Where the space actually shows up.</description>
    </item>
  </channel>
</rss>`;

const atomSample = `<?xml version="1.0"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Travel Technician Blog</title>
  <entry>
    <title>Annual Fee Season</title>
    <link rel="alternate" href="https://blog.traveltechnician.info/annual-fee-season"/>
    <published>2026-06-20T09:00:00Z</published>
    <summary>A calm walkthrough of keep-downgrade-cancel decisions.</summary>
  </entry>
</feed>`;

describe("parseFeed", () => {
  it("parses RSS 2.0 items with HTML stripped from excerpts", () => {
    const items = parseFeed(rssSample);
    expect(items).toHaveLength(2);
    expect(items[0]).toMatchObject({
      title: "Five Transfer Bonuses Worth Knowing",
      url: "https://blog.traveltechnician.info/transfer-bonuses",
    });
    expect(items[0]?.excerpt).toContain("Transfer bonuses can stretch your points");
    expect(items[0]?.excerpt).not.toContain("<p>");
  });

  it("parses Atom feeds", () => {
    const items = parseFeed(atomSample);
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      title: "Annual Fee Season",
      url: "https://blog.traveltechnician.info/annual-fee-season",
    });
  });

  it("respects the item limit", () => {
    expect(parseFeed(rssSample, 1)).toHaveLength(1);
  });

  it("returns an empty list for malformed XML", () => {
    expect(parseFeed("this is not xml <<<")).toEqual([]);
  });

  it("skips items without a title or link", () => {
    const broken = `<rss version="2.0"><channel><item><title>No link here</title></item></channel></rss>`;
    expect(parseFeed(broken)).toEqual([]);
  });
});
