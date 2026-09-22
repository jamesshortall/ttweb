import { z } from "zod";

/**
 * SMS opt-in schema, shared by the opt-in form and the API route (the route is
 * the source of truth). This form exists so there is one unambiguous, publicly
 * reachable place where a person consents to text messages — the opt-in proof
 * mobile carriers and A2P campaign review ask for.
 */

/** Digits only, so formatting differences never change the stored number. */
export function normalizePhone(input: string): string {
  return input.replace(/\D/g, "");
}

export const smsOptInFormSchema = z.object({
  name: z
    .string()
    .trim()
    .max(120, "Name must be 120 characters or fewer.")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .trim()
    .min(1, "Please enter your mobile number.")
    .max(32, "Phone number must be 32 characters or fewer.")
    .refine((value) => {
      const digits = normalizePhone(value);
      // 10 digits for a US number, up to 15 for E.164 with a country code.
      return digits.length >= 10 && digits.length <= 15;
    }, "Please enter a valid mobile number, including area code."),
  consent: z.literal(true, {
    errorMap: () => ({
      message: "Please check the box to agree to receive text messages.",
    }),
  }),
  /**
   * Honeypot: hidden from people, labelled "Leave this field empty". Any value
   * silently discards the submission.
   */
  website: z.string().max(0, "Invalid submission.").optional().or(z.literal("")),
  /** Millisecond timestamp when the form rendered — used for a minimum fill time. */
  startedAt: z.coerce.number().int().positive().optional(),
});

export type SmsOptInInput = z.input<typeof smsOptInFormSchema>;
export type SmsOptInData = z.output<typeof smsOptInFormSchema>;
