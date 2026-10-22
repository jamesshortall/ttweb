import { serverEnv } from "@/lib/env";
import type { RawTransferBonus } from "./normalize";

/**
 * Reading the transfer bonus feed from the CardMaster Base44 app.
 *
 * Base44 exposes entities as plain REST, so no SDK ships in the bundle. The
 * entity endpoint returns a bare JSON array — the `{items, next_cursor}`
 * envelope belongs to their backend functions, which this does not use.
 */

const BASE44_API = "https://app.base44.com/api/apps";

/** Upstream is slow far more often than it is broken; 30s is generous. */
const TIMEOUT_MS = 30_000;

export class Base44Error extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    // Deliberately carries no response body: upstream records contain an
    // email address, and error bodies get logged.
    super(message);
    this.name = "Base44Error";
  }
}

export function isBase44Configured(): boolean {
  const env = serverEnv();
  return !!(env.BASE44_APP_ID && env.BASE44_ACCESS_TOKEN);
}

async function fetchEntity(entity: string): Promise<RawTransferBonus[]> {
  const env = serverEnv();
  if (!env.BASE44_APP_ID || !env.BASE44_ACCESS_TOKEN) {
    throw new Base44Error("Base44 is not configured");
  }

  let response: Response;
  try {
    response = await fetch(`${BASE44_API}/${env.BASE44_APP_ID}/entities/${entity}`, {
      headers: { Authorization: `Bearer ${env.BASE44_ACCESS_TOKEN}` },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
  } catch (error) {
    const reason = error instanceof Error ? error.name : "unknown";
    throw new Base44Error(`Request to Base44 failed (${reason})`);
  }

  if (!response.ok) {
    // 401 is worth calling out by name: the feed uses a personal access token,
    // so a revoked or expired token stops the sync and needs a human.
    const hint = response.status === 401 ? " — check BASE44_ACCESS_TOKEN" : "";
    throw new Base44Error(`Base44 returned ${response.status}${hint}`, response.status);
  }

  const body: unknown = await response.json().catch(() => null);
  if (!Array.isArray(body)) {
    throw new Base44Error("Base44 returned an unexpected shape");
  }
  return body as RawTransferBonus[];
}

/** Current bonuses: the 'TransferBonus' entity. */
export function fetchCurrentBonuses(): Promise<RawTransferBonus[]> {
  return fetchEntity("TransferBonus");
}

/** The archive, 2017 onward: the 'TransferBonusHistory' entity. */
export function fetchBonusHistory(): Promise<RawTransferBonus[]> {
  return fetchEntity("TransferBonusHistory");
}
