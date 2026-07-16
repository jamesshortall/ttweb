import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/Reveal";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "default" | "inverse";
  as?: "h1" | "h2" | "h3";
  className?: string;
}

/**
 * Editorial section heading: a gold-ruled eyebrow, a large serif title, and an
 * optional lead paragraph. Revealed on scroll.
 */
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
    <Reveal className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow ? (
        <p
          className={cn(
            "eyebrow mb-4 flex items-center gap-3",
            align === "center" && "justify-center",
            inverse ? "text-gold-300" : "text-gold-700",
          )}
        >
          <span className="rule-gold" aria-hidden="true" />
          {eyebrow}
        </p>
      ) : null}
      <Heading
        className={cn(
          "text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-[2.75rem] md:leading-[1.1]",
          inverse ? "text-white" : "text-navy-900",
        )}
      >
        {title}
      </Heading>
      {description ? (
        <p className={cn("mt-5 text-lg leading-relaxed", inverse ? "text-navy-100/90" : "text-ink/70")}>
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}
