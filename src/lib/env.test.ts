import { describe, expect, it } from "vitest";
import { parseServerEnv } from "@/lib/env";

const base = { NODE_ENV: "test" } as NodeJS.ProcessEnv;

describe("parseServerEnv", () => {
  it("accepts a completely empty environment (zero-config local dev)", () => {
    expect(() => parseServerEnv(base)).not.toThrow();
  });

  it("treats empty strings as unset", () => {
    const env = parseServerEnv({ ...base, NEXT_PUBLIC_CALENDLY_URL: "" });
    expect(env.NEXT_PUBLIC_CALENDLY_URL).toBeUndefined();
  });

  it("rejects malformed URLs", () => {
    expect(() => parseServerEnv({ ...base, NEXT_PUBLIC_SITE_URL: "not a url" })).toThrow(
      /NEXT_PUBLIC_SITE_URL/,
    );
  });

  it("requires the Resend key when the resend provider is chosen", () => {
    expect(() =>
      parseServerEnv({
        ...base,
        EMAIL_PROVIDER: "resend",
        CONTACT_TO_EMAIL: "jim@example.com",
        EMAIL_FROM_ADDRESS: "noreply@example.com",
      }),
    ).toThrow(/RESEND_API_KEY/);
  });

  it("requires to/from addresses when a provider is chosen", () => {
    expect(() =>
      parseServerEnv({ ...base, EMAIL_PROVIDER: "postmark", POSTMARK_SERVER_TOKEN: "token" }),
    ).toThrow(/CONTACT_TO_EMAIL/);
  });

  it("requires an analytics id when a provider is set", () => {
    expect(() => parseServerEnv({ ...base, NEXT_PUBLIC_ANALYTICS_PROVIDER: "plausible" })).toThrow(
      /NEXT_PUBLIC_ANALYTICS_ID/,
    );
  });

  it("accepts a fully configured environment", () => {
    const env = parseServerEnv({
      ...base,
      EMAIL_PROVIDER: "resend",
      RESEND_API_KEY: "re_123",
      CONTACT_TO_EMAIL: "jim@example.com",
      EMAIL_FROM_ADDRESS: "noreply@example.com",
      NEXT_PUBLIC_ANALYTICS_PROVIDER: "plausible",
      NEXT_PUBLIC_ANALYTICS_ID: "www.traveltechnician.info",
    });
    expect(env.EMAIL_PROVIDER).toBe("resend");
  });
});
