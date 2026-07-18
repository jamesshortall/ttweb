"use client";

import { useHydrated } from "@/lib/hooks";

/**
 * Renders an email address assembled client-side, so the plain address never
 * appears in the served HTML for harvesters. Falls back to a human-readable
 * "user [at] domain" for non-JS environments.
 */
export function ObfuscatedEmail({ user, domain }: { user: string; domain: string }) {
  const hydrated = useHydrated();

  if (!hydrated) {
    return (
      <span className="font-medium">
        {user} [at] {domain}
      </span>
    );
  }

  return (
    <a
      href={`mailto:${user}@${domain}`}
      className="font-medium text-lagoon-700 underline hover:text-lagoon-900"
    >
      {user}@{domain}
    </a>
  );
}
