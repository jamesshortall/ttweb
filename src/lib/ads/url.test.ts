import { describe, expect, it } from "vitest";
import {
  appendReferralParams,
  buildClickHref,
  decodeClickToken,
  encodeClickToken,
  isSafeHttpUrl,
  parseCustomParams,
} from "@/lib/ads/url";
import type { Advertisement } from "@/lib/ads/types";

const SECRET = "unit-test-secret";

function imageAd(overrides: Partial<Advertisement> = {}): Advertisement {
  return {
    id: "ad1",
    name: "Ad",
    adType: "image",
    status: "active",
    approved: true,
    campaignId: "cmp1",
    campaignStatus: "active",
    advertiserId: "adv1",
    creatives: [{ variant: "responsive", src: "/x.svg", alt: "x" }],
    destinationUrl: "https://example.com/landing",
    placementKeys: ["slot"],
    deviceTarget: "all",
    pageTargetMode: "all",
    pagePaths: [],
    weight: 1,
    priority: 0,
    disclosure: { enabled: true, label: "Advertisement" },
    ...overrides,
  };
}

describe("isSafeHttpUrl", () => {
  it("accepts http and https", () => {
    expect(isSafeHttpUrl("https://example.com")).toBe(true);
    expect(isSafeHttpUrl("http://example.com/a?b=c")).toBe(true);
  });

  it("rejects unsafe schemes and junk", () => {
    expect(isSafeHttpUrl("javascript:alert(1)")).toBe(false);
    expect(isSafeHttpUrl("data:text/html,<script>")).toBe(false);
    expect(isSafeHttpUrl("ftp://host/file")).toBe(false);
    expect(isSafeHttpUrl("mailto:a@b.com")).toBe(false);
    expect(isSafeHttpUrl("not a url")).toBe(false);
    expect(isSafeHttpUrl("")).toBe(false);
    expect(isSafeHttpUrl(undefined)).toBe(false);
  });
});

describe("parseCustomParams", () => {
  it("parses key=value lines and skips malformed", () => {
    expect(parseCustomParams("a=1\n b = 2 \nnope\n=x\nc=")).toEqual([
      ["a", "1"],
      ["b", "2"],
      ["c", ""],
    ]);
  });
  it("returns [] for empty", () => {
    expect(parseCustomParams(undefined)).toEqual([]);
  });
});

describe("appendReferralParams", () => {
  it("adds utm + ref + custom params without clobbering existing", () => {
    const out = appendReferralParams("https://example.com/?utm_source=keep", {
      utmSource: "override",
      utmMedium: "banner",
      referralId: "r99",
      customParams: "promo=SUMMER",
    });
    const url = new URL(out);
    expect(url.searchParams.get("utm_source")).toBe("keep");
    expect(url.searchParams.get("utm_medium")).toBe("banner");
    expect(url.searchParams.get("ref")).toBe("r99");
    expect(url.searchParams.get("promo")).toBe("SUMMER");
  });

  it("leaves unsafe urls untouched", () => {
    expect(appendReferralParams("javascript:x", { utmSource: "s" })).toBe("javascript:x");
  });
});

describe("click tokens", () => {
  it("round-trips a payload", () => {
    const token = encodeClickToken({ u: "https://example.com/", ad: "a", pl: "slot" }, SECRET);
    const decoded = decodeClickToken(token, SECRET);
    expect(decoded?.u).toBe("https://example.com/");
    expect(decoded?.ad).toBe("a");
  });

  it("rejects a tampered signature", () => {
    const token = encodeClickToken({ u: "https://example.com/", ad: "a", pl: "slot" }, SECRET);
    expect(decodeClickToken(token + "x", SECRET)).toBeNull();
    expect(decodeClickToken(token, "wrong-secret")).toBeNull();
  });

  it("rejects a token whose payload url is unsafe", () => {
    // Forge a validly-signed token carrying a javascript: URL.
    const forged = encodeClickToken(
      { u: "javascript:alert(1)", ad: "a", pl: "slot" },
      SECRET,
    );
    expect(decodeClickToken(forged, SECRET)).toBeNull();
  });
});

describe("buildClickHref", () => {
  it("returns a signed /api/ads/click URL when a secret is set", () => {
    const href = buildClickHref(imageAd(), SECRET);
    expect(href?.startsWith("/api/ads/click?t=")).toBe(true);
  });

  it("links directly to the tracked destination when no secret", () => {
    const href = buildClickHref(imageAd({ referral: { utmMedium: "banner" } }), undefined);
    expect(href).toContain("https://example.com/landing");
    expect(href).toContain("utm_medium=banner");
  });

  it("returns null when the destination is unsafe or missing", () => {
    expect(buildClickHref(imageAd({ destinationUrl: "javascript:x" }), SECRET)).toBeNull();
    expect(buildClickHref(imageAd({ destinationUrl: undefined }), SECRET)).toBeNull();
  });
});
