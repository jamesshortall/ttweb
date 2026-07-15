import { describe, expect, it } from "vitest";
import { contactFormSchema, categoryLabel, inquiryCategories } from "@/lib/contact-schema";

const validSubmission = {
  name: "Ada Traveler",
  email: "ada@example.com",
  category: "free-consultation",
  message: "I have about 200,000 points and no idea how to use them for a trip to Japan.",
  preferredContact: "email",
  consent: true,
  website: "",
};

describe("contactFormSchema", () => {
  it("accepts a valid submission", () => {
    const result = contactFormSchema.safeParse(validSubmission);
    expect(result.success).toBe(true);
  });

  it("defaults preferredContact to email", () => {
    const { preferredContact: _omitted, ...rest } = validSubmission;
    const result = contactFormSchema.parse(rest);
    expect(result.preferredContact).toBe("email");
  });

  it("rejects a missing name", () => {
    const result = contactFormSchema.safeParse({ ...validSubmission, name: "A" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = contactFormSchema.safeParse({ ...validSubmission, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("rejects an unknown category", () => {
    const result = contactFormSchema.safeParse({ ...validSubmission, category: "sell-me-things" });
    expect(result.success).toBe(false);
  });

  it("rejects a too-short message", () => {
    const result = contactFormSchema.safeParse({ ...validSubmission, message: "hi" });
    expect(result.success).toBe(false);
  });

  it("requires consent to be exactly true", () => {
    const result = contactFormSchema.safeParse({ ...validSubmission, consent: false });
    expect(result.success).toBe(false);
  });

  it("rejects honeypot content (server treats separately as spam)", () => {
    const result = contactFormSchema.safeParse({
      ...validSubmission,
      website: "https://spam.example",
    });
    expect(result.success).toBe(false);
  });

  it("covers all nine inquiry categories with labels", () => {
    expect(inquiryCategories).toHaveLength(9);
    for (const category of inquiryCategories) {
      expect(categoryLabel(category.value)).toBe(category.label);
    }
  });
});
