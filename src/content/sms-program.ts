/**
 * The text-message program, in one place.
 *
 * The form renders `CONSENT_TEXT` verbatim beside the checkbox, and the API
 * stores that same string with the consent record — so what a subscriber
 * agreed to is exactly what is on file.
 */

export const SMS_PROGRAM = {
  brand: "Travel Technician",
  /** What the messages are about — must match the Terms and the campaign. */
  description:
    "Travel Technician sends text messages about the inquiry you submitted, scheduling, and appointment reminders.",
  frequency: "Message frequency varies.",
  rates: "Message and data rates may apply.",
  optOut: "Reply STOP to cancel at any time. Reply HELP for help.",
} as const;

/** The exact agreement shown beside the checkbox and stored with the consent. */
export const CONSENT_TEXT =
  "By checking this box, I agree to receive text messages from Travel Technician at the mobile number provided, about my inquiry, scheduling, and appointment reminders. Consent is not a condition of purchase. Message frequency varies. Message and data rates may apply. Reply STOP to cancel or HELP for help.";
