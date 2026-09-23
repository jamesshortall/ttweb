import { createClient } from "@supabase/supabase-js";
import { serverEnv } from "@/lib/env";
import { normalizePhone, type SmsOptInData } from "@/lib/sms-optin-schema";

/**
 * Durable consent log for SMS opt-ins (see supabase/migrations/0004_sms_optins.sql).
 *
 * Storage failures are logged without content and never block the visitor —
 * the notification email is the backup record.
 */
export async function storeSmsOptIn(
  data: SmsOptInData,
  consentText: string,
  welcomeSent: boolean,
): Promise<boolean> {
  const env = serverEnv();
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    return false;
  }

  try {
    const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });
    const { error } = await supabase.from("sms_optins").insert({
      name: data.name || null,
      phone: normalizePhone(data.phone),
      consent: true,
      consent_text: consentText,
      welcome_sent: welcomeSent,
    });
    if (error) {
      console.error(`[sms-optin] Supabase storage failed: ${error.code ?? "unknown error"}`);
      return false;
    }
    return true;
  } catch {
    console.error("[sms-optin] Supabase storage failed: request error");
    return false;
  }
}
