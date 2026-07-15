import { createClient } from "@supabase/supabase-js";
import { serverEnv } from "@/lib/env";
import type { ContactFormData } from "@/lib/contact-schema";

/**
 * Optional Supabase persistence for contact submissions.
 *
 * Uses the server-only service-role key (never shipped to the browser); the
 * table denies all anon/authenticated access via RLS — see
 * supabase/migrations/0001_contact_submissions.sql.
 *
 * Storage failures are logged (without content) and never block the visitor:
 * email delivery is the primary channel.
 */
export async function storeContactSubmission(data: ContactFormData): Promise<boolean> {
  const env = serverEnv();
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    return false;
  }

  try {
    const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });
    const { error } = await supabase.from("contact_submissions").insert({
      name: data.name,
      email: data.email,
      category: data.category,
      message: data.message,
      preferred_contact: data.preferredContact,
    });
    if (error) {
      console.error(`[contact] Supabase storage failed: ${error.code ?? "unknown error"}`);
      return false;
    }
    return true;
  } catch {
    console.error("[contact] Supabase storage failed: request error");
    return false;
  }
}
