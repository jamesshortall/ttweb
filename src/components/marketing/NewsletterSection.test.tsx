import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { NewsletterSection } from "@/components/marketing/NewsletterSection";
import type { NewsletterSettings } from "@/lib/cms/types";

const base: NewsletterSettings = {
  mode: "coming-soon",
  heading: "The Travel Technician newsletter is coming soon",
  body: "Points news and tips.",
  topics: ["Transfer bonuses", "Beginner education"],
};

describe("NewsletterSection", () => {
  it("renders the coming-soon announcement WITHOUT any signup input (no fake workflow)", () => {
    render(<NewsletterSection settings={base} />);
    expect(screen.getByRole("heading", { name: base.heading })).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.getByText("Transfer bonuses")).toBeInTheDocument();
  });

  it("renders nothing when hidden", () => {
    const { container } = render(<NewsletterSection settings={{ ...base, mode: "hidden" }} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("explains the missing provider integration in active mode", () => {
    render(<NewsletterSection settings={{ ...base, mode: "active" }} />);
    expect(screen.getByText(/no provider integration is configured/i)).toBeInTheDocument();
  });
});
