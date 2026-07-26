import { cn } from "@/lib/utils";

/**
 * Sponsored-content disclosure. Kept deliberately distinct from editorial
 * styling so paid placements are never mistaken for Travel Technician's own
 * recommendations.
 */
export function AdDisclosure({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
        "bg-porcelain-200 text-porcelain-800",
        className,
      )}
    >
      {label}
    </span>
  );
}
