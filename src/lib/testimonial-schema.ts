import { z } from "zod";

/**
 * Testimonial-submission schema, shared by the client form (react-hook-form
 * resolver) and the API route (server-side validation - the source of truth).
 *
 * A submission never publishes itself: the API stores it as an unpublished
 * Sanity draft for the administrator to verify and publish. `consent` records
 * that the person agreed their words may be published if approved.
 */
export const testimonialFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name.")
    .max(120, "Name must be 120 characters or fewer."),
  /** Optional public context, e.g. "Austin, TX" or "family of four". */
  attributionDetail: z
    .string()
    .trim()
    .max(120, "Please keep this to 120 characters or fewer.")
    .optional()
    .or(z.literal("")),
  /** Private - used only to verify authenticity and confirm permission. */
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .max(254, "Email must be 254 characters or fewer.")
    .optional()
    .or(z.literal("")),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  quote: z
    .string()
    .trim()
    .min(20, "Please share a little more (at least 20 characters).")
    .max(2000, "Please keep your testimonial to 2,000 characters or fewer."),
  consent: z.literal(true, {
    errorMap: () => ({
      message: "Please confirm you're happy for Jim to publish this with your permission.",
    }),
  }),
  /**
   * Honeypot: hidden from humans, labelled "Leave this field empty". Any value
   * silently discards the submission.
   */
  website: z.string().max(0, "Invalid submission.").optional().or(z.literal("")),
  /** Millisecond timestamp when the form rendered - used for a minimum fill time. */
  startedAt: z.coerce.number().int().positive().optional(),
});

export type TestimonialFormInput = z.input<typeof testimonialFormSchema>;
export type TestimonialFormData = z.output<typeof testimonialFormSchema>;

/** Build the public attribution string shown with a published testimonial. */
export function buildAttribution(name: string, detail?: string): string {
  const trimmedName = name.trim();
  const trimmedDetail = detail?.trim();
  return trimmedDetail ? `${trimmedName}, ${trimmedDetail}` : trimmedName;
}
