import type { IconName } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

/**
 * Minimal inline icon set (24×24, stroke-based) — avoids an icon-library
 * dependency. Icons are decorative; pair them with visible text labels.
 */
const paths: Record<IconName, React.ReactNode> = {
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
    </>
  ),
  card: (
    <>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 10h18M7 15h4" />
    </>
  ),
  plane: (
    <path d="M10.5 13.5 4 11l1.5-1.5 5.5.5 4.5-4.5a1.4 1.4 0 0 1 2 2L13 12l.5 5.5L12 19l-2.5-6.5-3 3 .25 2.25L5.5 19l-1-3.5L1 14.5l1.25-1.25L4.5 13.5" />
  ),
  chart: (
    <>
      <path d="M4 20V4" />
      <path d="M4 20h16" />
      <path d="M8 16v-5M12 16V8M16 16v-3" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  bell: (
    <>
      <path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.5 3-5.5 6.5-5.5s6.5 2 6.5 5.5" />
      <path d="M16 5a3.5 3.5 0 0 1 0 7M18.5 15.2c1.8.8 3 2.3 3 4.8" />
    </>
  ),
  map: (
    <>
      <path d="m9 4-5 2v14l5-2 6 2 5-2V4l-5 2-6-2Z" />
      <path d="M9 4v14M15 6v14" />
    </>
  ),
  sparkles: (
    <>
      <path d="M12 4 13.8 9.2 19 11l-5.2 1.8L12 18l-1.8-5.2L5 11l5.2-1.8L12 4Z" />
      <path d="M19 16.5 19.7 18.3 21.5 19l-1.8.7L19 21.5l-.7-1.8-1.8-.7 1.8-.7.7-1.8Z" />
    </>
  ),
  calculator: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M8.5 7.5h7M8.5 12h.01M12 12h.01M15.5 12h.01M8.5 15.5h.01M12 15.5h.01M15.5 15.5v2" />
    </>
  ),
  luggage: (
    <>
      <rect x="6" y="7" width="12" height="13" rx="2" />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M9 11v5M15 11v5" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9S14.5 18.5 12 21c-2.5-2.5-3.5-5.5-3.5-9S9.5 5.5 12 3Z" />
    </>
  ),
  book: (
    <>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15Z" />
      <path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20v3" />
    </>
  ),
  wrench: (
    <path d="M14.5 6.5a4.5 4.5 0 0 0-6 6L4 17a2.1 2.1 0 0 0 3 3l4.5-4.5a4.5 4.5 0 0 0 6-6L14 13l-3-3 3.5-3.5Z" />
  ),
  calendar: (
    <>
      <rect x="4" y="5" width="16" height="16" rx="2" />
      <path d="M4 10h16M8 3v4M16 3v4M9 15l2 2 4-4" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </>
  ),
  check: <path d="m5 13 4 4L19 7" />,
};

export function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("h-6 w-6", className)}
    >
      {paths[name]}
    </svg>
  );
}
