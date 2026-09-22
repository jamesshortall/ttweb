import { describe, expect, it } from "vitest";
import { smsOptInFormSchema, normalizePhone } from "@/lib/sms-optin-schema";

const validOptIn = {
  name: "Ada Traveler",
  phone: "(512) 555-1234",
  consent: true,
  website: "",
};

describe("normalizePhone", () => {
  it("keeps digits only, so formatting never splits a subscriber", () => {
    expect(normalizePhone("(512) 555-1234")).toBe("5125551234");
    expect(normalizePhone("+1 512-555-1234")).toBe("15125551234");
  });
});

describe("smsOptInFormSchema", () => {
  it("accepts a valid opt-in", () => {
    expect(smsOptInFormSchema.safeParse(validOptIn).success).toBe(true);
  });

  it("requires consent to be exactly true", () => {
    expect(smsOptInFormSchema.safeParse({ ...validOptIn, consent: false }).success).toBe(false);
  });

  it("requires a phone number", () => {
    expect(smsOptInFormSchema.safeParse({ ...validOptIn, phone: "" }).success).toBe(false);
  });

  it("rejects a number that is too short to dial", () => {
    expect(smsOptInFormSchema.safeParse({ ...validOptIn, phone: "555-1234" }).success).toBe(false);
  });

  it("accepts an E.164 number with a country code", () => {
    expect(smsOptInFormSchema.safeParse({ ...validOptIn, phone: "+15125551234" }).success).toBe(
      true,
    );
  });

  it("rejects honeypot content (server treats separately as spam)", () => {
    expect(smsOptInFormSchema.safeParse({ ...validOptIn, website: "bot" }).success).toBe(false);
  });

  it("treats the name as optional", () => {
    const result = smsOptInFormSchema.safeParse({ ...validOptIn, name: "" });
    expect(result.success).toBe(true);
  });
});
