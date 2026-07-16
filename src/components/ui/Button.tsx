import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "inverse";
type Size = "md" | "lg";

const variantClasses: Record<Variant, string> = {
  // Gold — the premium accent, used for the main conversion actions.
  primary:
    "bg-gold-500 text-navy-950 hover:bg-gold-400 shadow-lg shadow-gold-500/25 hover:shadow-gold-500/40",
  // Navy — the brand primary.
  secondary: "bg-navy-900 text-white hover:bg-navy-800 shadow-lg shadow-navy-900/20",
  outline: "border border-navy-300 text-navy-900 hover:border-navy-900 hover:bg-navy-50",
  ghost: "text-navy-800 hover:bg-navy-50",
  inverse: "bg-white text-navy-900 hover:bg-porcelain-100 shadow-lg shadow-navy-950/20",
};

const sizeClasses: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm min-h-11",
  lg: "px-7 py-3.5 text-base min-h-13",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 select-none";

interface ButtonLinkProps {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  external?: boolean;
  children: React.ReactNode;
}

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
