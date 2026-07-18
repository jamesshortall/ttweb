/** Small badge marking links that leave the Travel Technician website. */
export function ExternalTag({ label = "External link" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-sand-100 px-2.5 py-0.5 text-xs font-semibold text-sand-900">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="h-3 w-3"
      >
        <path d="M7 17 17 7M9 7h8v8" />
      </svg>
      {label}
    </span>
  );
}
