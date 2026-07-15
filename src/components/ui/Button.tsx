import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "inverse";
type Size = "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-sunset-700 text-white hover:bg-sunset-800 active:bg-sunset-900 shadow-md shadow-sunset-700/20",
  secondary:
    "bg-lagoon-800 text-white hover:bg-lagoon-900 active:bg-lagoon-950 shadow-md shadow-lagoon-900/20",
  outline:
    "border-2 border-lagoon-800 text-lagoon-900 hover:bg-lagoon-50 active:bg-lagoon-100 bg-white/70",
  ghost: "text-lagoon-800 hover:bg-lagoon-50 active:bg-lagoon-100",
  inverse: "bg-white text-lagoon-950 hover:bg-lagoon-50 active:bg-lagoon-100 shadow-md",
};

const sizeClasses: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm min-h-11",
  lg: "px-7 py-3.5 text-base min-h-12",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors duration-150 select-none";

interface ButtonLinkProps {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  external?: boolean;
  children: React.ReactNode;
}

/** Call-to-action link styled as a button. External links get rel protection. */
export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  external = false,
  children,
}: ButtonLinkProps) {
  const classes = cn(baseClasses, variantClasses[variant], sizeClasses[size], className);
  if (external) {
    return (
      <a href={href} className={classes} rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({ variant = "primary", size = "md", className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        "disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
}
