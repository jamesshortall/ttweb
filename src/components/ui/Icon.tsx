import type { IconName } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

/**
 * Two-tone (duotone) icon set. Each glyph pairs a soft filled shape (16%
 * currentColor) with crisp strokes on top, so it reads as a refined duotone in
 * whatever color it inherits — a deliberate upgrade over thin single-line icons.
 * Icons are decorative; always pair them with visible text.
 */
const icons: Record<IconName, React.ReactNode> = {
  compass: (
    <>
      <circle cx="12" cy="12" r="9" className="fill-current opacity-15" />
      <circle cx="12" cy="12" r="9" />
      <path d="m15.6 8.4-2.1 5.1-5.1 2.1 2.1-5.1 5.1-2.1Z" className="fill-current opacity-40" />
      <circle cx="12" cy="12" r="1.1" className="fill-current" stroke="none" />
    </>
  ),
  card: (
    <>
      <rect x="3" y="6" width="18" height="12.5" rx="2.4" className="fill-current opacity-15" />
      <rect x="3" y="6" width="18" height="12.5" rx="2.4" />
      <path d="M3 10h18" className="stroke-current" strokeWidth="2.4" />
      <path d="M6.5 14.5h4" />
    </>
  ),
  plane: (
    <>
      <path
        d="M11 3.6c.5-.9 1.9-.9 2.4 0l1 8 6 3.5c.4.2.6.6.6 1v.6c0 .5-.5.9-1 .8l-6.6-1.7-.6 3.4 1.6 1.3c.2.2.3.5.3.8 0 .5-.5.8-1 .7L12 21l-2.6.5c-.5.1-1-.2-1-.7 0-.3.1-.6.3-.8l1.6-1.3-.6-3.4L3 17c-.5.1-1-.3-1-.8v-.6c0-.4.2-.8.6-1l6-3.5 1-8Z"
        className="fill-current opacity-15"
      />
      <path d="M11 3.6c.5-.9 1.9-.9 2.4 0l1 8 6 3.5c.4.2.6.6.6 1v.6c0 .5-.5.9-1 .8l-6.6-1.7-.6 3.4 1.6 1.3c.2.2.3.5.3.8 0 .5-.5.8-1 .7L12 21l-2.6.5c-.5.1-1-.2-1-.7 0-.3.1-.6.3-.8l1.6-1.3-.6-3.4L3 17c-.5.1-1-.3-1-.8v-.6c0-.4.2-.8.6-1l6-3.5 1-8Z" />
    </>
  ),
  chart: (
    <>
      <path d="M4 4v15a1 1 0 0 0 1 1h15" />
      <rect x="7" y="12" width="2.6" height="5" rx="0.6" className="fill-current opacity-40" />
      <rect x="11.7" y="8.5" width="2.6" height="8.5" rx="0.6" className="fill-current opacity-25" />
      <rect x="16.4" y="5.5" width="2.6" height="11.5" rx="0.6" className="fill-current opacity-40" />
    </>
  ),
  shield: (
    <>
      <path
        d="M12 3 5 5.8v5c0 4.6 3 8.2 7 10 4-1.8 7-5.4 7-10v-5L12 3Z"
        className="fill-current opacity-15"
      />
      <path d="M12 3 5 5.8v5c0 4.6 3 8.2 7 10 4-1.8 7-5.4 7-10v-5L12 3Z" />
      <path d="m9 12 2.2 2.2L15.5 10" />
    </>
  ),
  bell: (
    <>
      <path
        d="M6 10a6 6 0 1 1 12 0c0 3.5 1 5 1.8 5.7.5.4.2 1.3-.5 1.3H4.7c-.7 0-1-.9-.5-1.3C5 15 6 13.5 6 10Z"
        className="fill-current opacity-15"
      />
      <path d="M6 10a6 6 0 1 1 12 0c0 3.5 1 5 1.8 5.7.5.4.2 1.3-.5 1.3H4.7c-.7 0-1-.9-.5-1.3C5 15 6 13.5 6 10Z" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.4" className="fill-current opacity-15" />
      <circle cx="9" cy="8" r="3.4" />
      <path d="M2.5 20c0-3.6 3-5.6 6.5-5.6s6.5 2 6.5 5.6" className="fill-current opacity-15" />
      <path d="M2.5 20c0-3.6 3-5.6 6.5-5.6s6.5 2 6.5 5.6" />
      <path d="M16 5.2a3.4 3.4 0 0 1 0 6.6M18.6 15.4c1.7.8 2.9 2.3 2.9 4.6" />
    </>
  ),
  map: (
    <>
      <path d="m9 4-5 2v14l5-2 6 2 5-2V4l-5 2-6-2Z" className="fill-current opacity-15" />
      <path d="m9 4-5 2v14l5-2 6 2 5-2V4l-5 2-6-2Z" />
      <path d="M9 4v14M15 6v14" />
    </>
  ),
  sparkles: (
    <>
      <path
        d="M12 3.5 13.9 9 19.5 11 13.9 13 12 18.5 10.1 13 4.5 11 10.1 9 12 3.5Z"
        className="fill-current opacity-25"
      />
      <path d="M12 3.5 13.9 9 19.5 11 13.9 13 12 18.5 10.1 13 4.5 11 10.1 9 12 3.5Z" />
      <path d="M18.5 15.5 19.4 18l2.5.9-2.5.9-.9 2.5-.9-2.5-2.5-.9 2.5-.9.9-2.5Z" className="fill-current opacity-50" />
    </>
  ),
  calculator: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2.2" className="fill-current opacity-15" />
      <rect x="5" y="3" width="14" height="18" rx="2.2" />
      <rect x="8" y="6" width="8" height="3" rx="0.8" className="fill-current opacity-40" />
      <path d="M8.5 12.5h.01M12 12.5h.01M15.5 12.5h.01M8.5 15.8h.01M12 15.8h.01M15.5 15.8v2.4" strokeWidth="2.2" />
    </>
  ),
  luggage: (
    <>
      <rect x="6" y="7" width="12" height="13" rx="2.2" className="fill-current opacity-15" />
      <rect x="6" y="7" width="12" height="13" rx="2.2" />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M10 11v5M14 11v5" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" className="fill-current opacity-15" />
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.6 2.6 3.6 5.6 3.6 9S14.6 18.4 12 21c-2.6-2.6-3.6-5.6-3.6-9S9.4 5.6 12 3Z" />
    </>
  ),
  book: (
    <>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15Z" className="fill-current opacity-15" />
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15Z" />
      <path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20v3M9 7.5h6" />
    </>
  ),
  wrench: (
    <>
      <path
        d="M14.7 6.3a4.6 4.6 0 0 0-6 6L4.2 16.8a2.1 2.1 0 0 0 3 3l4.5-4.5a4.6 4.6 0 0 0 6-6L14.9 12l-3-3 2.8-2.7Z"
        className="fill-current opacity-15"
      />
      <path d="M14.7 6.3a4.6 4.6 0 0 0-6 6L4.2 16.8a2.1 2.1 0 0 0 3 3l4.5-4.5a4.6 4.6 0 0 0 6-6L14.9 12l-3-3 2.8-2.7Z" />
    </>
  ),
  calendar: (
    <>
      <rect x="4" y="5" width="16" height="16" rx="2.2" className="fill-current opacity-15" />
      <rect x="4" y="5" width="16" height="16" rx="2.2" />
      <path d="M4 10h16M8 3v4M16 3v4" />
      <path d="m9 15 2 2 4-4" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.2" className="fill-current opacity-15" />
      <rect x="3" y="5" width="18" height="14" rx="2.2" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" className="fill-current opacity-15" />
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.6-3.6" strokeWidth="2.2" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="9" className="fill-current opacity-15" />
      <path d="m8 12 2.6 2.6L16 9" />
    </>
  ),
};

export function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("h-6 w-6", className)}
    >
      {icons[name]}
    </svg>
  );
}
