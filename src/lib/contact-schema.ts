import { z } from "zod";

/**
 * Contact-form schema, shared by the client form (react-hook-form resolver)
 * and the API route (server-side validation — the source of truth).
 */

export const inquiryCategories = [
  { value: "free-consultation", label: "Free consultation" },
  { value: "points-strategy", label: "Points strategy" },
  { value: "credit-card-strategy", label: "Credit card strategy" },
  { value: "award-travel", label: "Award travel assistance" },
  { value: "loyalty-program-review", label: "Loyalty program review" },
  { value: "points-portfolio-audit", label: "Points portfolio audit" },
  { value: "cardmaster-support", label: "CardMaster support" },
  { value: "general", label: "General question" },
  { value: "partnership-media", label: "Partnership or media inquiry" },
] as const;

export type InquiryCategory = (typeof inquiryCategories)[number]["value"];

const categoryValues = inquiryCategories.map((c) => c.value) as [
  InquiryCategory,
  ...InquiryCategory[],
];

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name.")
    .max(120, "Name must be 120 characters or fewer."),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .max(254, "Email must be 254 characters or fewer."),
  category: z.enum(categoryValues, {
    errorMap: () => ({ message: "Please choose an inquiry category." }),
  }),
  message: z
    .string()
    .trim()
    .min(20, "Please add a little more detail (at least 20 characters).")
    .max(5000, "Message must be 5,000 characters or fewer."),
  preferredContact: z.enum(["email", "either", "no-preference"]).optional().default("email"),
  consent: z.literal(true, {
    errorMap: () => ({
      message: "Please confirm you agree to be contacted about your inquiry.",
    }),
  }),
  /**
   * Honeypot: hidden from humans, labelled "Leave this field empty". Any value
   * silently discards the submission.
   */
  website: z.string().max(0, "Invalid submission.").optional().or(z.literal("")),
  /** Millisecond timestamp when the form rendered — used for a minimum fill time. */
  startedAt: z.coerce.number().int().positive().optional(),
});

export type ContactFormInput = z.input<typeof contactFormSchema>;
export type ContactFormData = z.output<typeof contactFormSchema>;

export function categoryLabel(value: InquiryCategory): string {
  return inquiryCategories.find((c) => c.value === value)?.label ?? value;
}
