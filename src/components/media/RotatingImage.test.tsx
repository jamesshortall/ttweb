import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { RotatingImage } from "@/components/media/RotatingImage";
import * as hooks from "@/lib/hooks";

const images = [
  { src: "/images/travel/hero-lagoon.svg", alt: "Bright tropical lagoon" },
  { src: "/images/travel/hero-sunset.svg", alt: "Golden island sunset" },
  { src: "/images/travel/hero-palms.svg", alt: "Palm-lined beach cove" },
];

function visibleAlt(): string | null {
  const frames = document.querySelectorAll("[aria-hidden]");
  for (const frame of frames) {
    if (frame.getAttribute("aria-hidden") === "false") {
      return frame.querySelector("img")?.getAttribute("alt") ?? null;
    }
  }
  return null;
}

describe("RotatingImage", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the first image with its alt text and no layout-shifting siblings", () => {
    render(<RotatingImage images={images} />);
    expect(visibleAlt()).toBe("Bright tropical lagoon");
  });

  it("rotates on the configured interval without immediate repeats", () => {
    render(<RotatingImage images={images} intervalMs={60_000} />);
    const seen: string[] = [visibleAlt()!];

    for (let i = 0; i < 6; i++) {
      act(() => {
        vi.advanceTimersByTime(60_000);
      });
      const current = visibleAlt()!;
      expect(current).not.toBe(seen[seen.length - 1]);
      seen.push(current);
    }
  });

  it("does not rotate when prefers-reduced-motion is set", () => {
    vi.spyOn(hooks, "useReducedMotion").mockReturnValue(true);
    render(<RotatingImage images={images} intervalMs={60_000} />);
    const first = visibleAlt();
    act(() => {
      vi.advanceTimersByTime(180_000);
    });
    expect(visibleAlt()).toBe(first);
  });

  it("pauses while the tab is hidden and resumes when visible", () => {
    render(<RotatingImage images={images} intervalMs={60_000} />);
    const first = visibleAlt();

    Object.defineProperty(document, "hidden", { configurable: true, value: true });
    act(() => {
      document.dispatchEvent(new Event("visibilitychange"));
      vi.advanceTimersByTime(300_000);
    });
    expect(visibleAlt()).toBe(first);

    Object.defineProperty(document, "hidden", { configurable: true, value: false });
    act(() => {
      document.dispatchEvent(new Event("visibilitychange"));
      vi.advanceTimersByTime(60_000);
    });
    expect(visibleAlt()).not.toBe(first);
  });

  it("renders nothing for an empty collection", () => {
    const { container } = render(<RotatingImage images={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
