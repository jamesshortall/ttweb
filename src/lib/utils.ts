/** Join conditional class names (tiny local alternative to clsx). */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Estimated cents-per-point for a redemption, based on the comparable cash
 * price net of award taxes and fees. Always presented as an estimate.
 */
export function centsPerPoint(cashValueUsd: number, taxesFeesUsd: number, points: number): number {
  if (points <= 0) return 0;
  return ((cashValueUsd - taxesFeesUsd) * 100) / points;
}

export function formatCentsPerPoint(value: number): string {
  return `${value.toFixed(1)}¢`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatUsd(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Shuffled display order for a rotating-image collection with the constraint
 * that the first image of the new sequence never repeats the previously shown
 * image (no identical image twice in succession across reshuffles).
 */
export function shuffledRotation(length: number, previousIndex: number | null = null): number[] {
  const order = Array.from({ length }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const a = order[i] as number;
    order[i] = order[j] as number;
    order[j] = a;
  }
  if (length > 1 && previousIndex !== null && order[0] === previousIndex) {
    const swapWith = 1 + Math.floor(Math.random() * (length - 1));
    const first = order[0] as number;
    order[0] = order[swapWith] as number;
    order[swapWith] = first;
  }
  return order;
}
