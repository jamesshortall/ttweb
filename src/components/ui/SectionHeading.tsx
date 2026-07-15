import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "default" | "inverse";
  as?: "h1" | "h2" | "h3";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "default",
  as: Heading = "h2",
  className,
}: SectionHeadingProps) {
  const inverse = tone === "inverse";
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow ? (
        <p
          className={cn(
            "mb-3 text-sm font-bold tracking-widest uppercase",
            inverse ? "text-lagoon-200" : "text-sunset-700",
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <Heading
        className={cn(
          "font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl",
          inverse ? "text-white" : "text-lagoon-950",
        )}
      >
        {title}
      </Heading>
      {description ? (
        <p
          className={cn(
            "mt-4 text-lg leading-relaxed",
            inverse ? "text-lagoon-100" : "text-ink/80",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
