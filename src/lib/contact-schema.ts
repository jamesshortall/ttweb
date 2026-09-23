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
  /** Optional mobile number. Required only when SMS consent is given. */
  phone: z
    .string()
    .trim()
    .max(32, "Phone number must be 32 characters or fewer.")
    .optional()
    .or(z.literal("")),
  /**
   * Explicit opt-in to text messages, unchecked by default. Recorded as the
   * consent of record for A2P 10DLC messaging.
   */
  smsConsent: z.boolean().optional().default(false),
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
})
  .superRefine((data, ctx) => {
    // You cannot consent to texts without giving a number to text.
    if (data.smsConsent && !data.phone) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["phone"],
        message: "Add your mobile number so we can text you, or uncheck the text-message box.",
      });
    }
  });

export type ContactFormInput = z.input<typeof contactFormSchema>;
export type ContactFormData = z.output<typeof contactFormSchema>;

export function categoryLabel(value: InquiryCategory): string {
  return inquiryCategories.find((c) => c.value === value)?.label ?? value;
}
