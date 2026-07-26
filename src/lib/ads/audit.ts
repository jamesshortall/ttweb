import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { serverEnv } from "@/lib/env";

/**
 * Administrative audit trail writer (ad_audit_log). Records who changed what for
 * advertising operations we perform server-side (status sync, aggregation runs,
 * admin sign-in). Fails soft — an audit-write failure must never block the
 * operation it describes.
 *
 * Studio content edits (ad create/modify) are audited via a Sanity publish
 * webhook in a later step; this writer covers the server-initiated actions.
 */

function client(): SupabaseClient | null {
  const env = serverEnv();
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) return null;
  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}

export interface AuditEvent {
  actor?: string;
  action: string;
  entityType?: string;
  entityId?: string;
  summary?: string;
  metadata?: Record<string, unknown>;
}

export async function recordAuditEvent(event: AuditEvent): Promise<boolean> {
  const supabase = client();
  if (!supabase) return false;
  try {
    const { error } = await supabase.from("ad_audit_log").insert({
      actor: event.actor ?? "system",
      action: event.action,
      entity_type: event.entityType ?? null,
      entity_id: event.entityId ?? null,
      summary: event.summary ?? null,
      metadata: event.metadata ?? null,
    });
    if (error) {
      console.error(`[ads] audit write failed: ${error.code ?? "unknown"}`);
      return false;
    }
    return true;
  } catch {
    console.error("[ads] audit write failed: request error");
    return false;
  }
}
