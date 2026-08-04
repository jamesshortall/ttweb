import { describe, expect, it } from "vitest";
import { testimonialFormSchema, buildAttribution } from "@/lib/testimonial-schema";

const valid = {
  name: "Sarah M.",
  quote: "Jim turned a pile of points into a business-class trip we never thought possible.",
  consent: true as const,
};

describe("testimonialFormSchema", () => {
  it("accepts a minimal valid submission", () => {
    const result = testimonialFormSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("requires consent to publish", () => {
    const result = testimonialFormSchema.safeParse({ ...valid, consent: false });
    expect(result.success).toBe(false);
  });

  it("rejects a too-short quote", () => {
    const result = testimonialFormSchema.safeParse({ ...valid, quote: "Great!" });
    expect(result.success).toBe(false);
  });

  it("rejects a value in the honeypot", () => {
    const result = testimonialFormSchema.safeParse({ ...valid, website: "http://spam.example" });
    expect(result.success).toBe(false);
  });

  it("coerces and bounds the optional rating", () => {
    expect(testimonialFormSchema.safeParse({ ...valid, rating: "5" }).success).toBe(true);
    expect(testimonialFormSchema.safeParse({ ...valid, rating: 6 }).success).toBe(false);
  });

  it("allows an empty optional email but rejects a malformed one", () => {
    expect(testimonialFormSchema.safeParse({ ...valid, email: "" }).success).toBe(true);
    expect(testimonialFormSchema.safeParse({ ...valid, email: "not-an-email" }).success).toBe(
      false,
    );
  });
});

describe("buildAttribution", () => {
  it("joins name and detail", () => {
    expect(buildAttribution("Sarah M.", "family of four")).toBe("Sarah M., family of four");
  });

  it("returns just the name when detail is empty", () => {
    expect(buildAttribution("Sarah M.", "")).toBe("Sarah M.");
    expect(buildAttribution("Sarah M.", undefined)).toBe("Sarah M.");
  });
});
