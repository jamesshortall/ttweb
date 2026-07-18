import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Header } from "@/components/layout/Header";

vi.mock("next/navigation", () => ({
  usePathname: () => "/services",
}));

describe("Header", () => {
  it("renders the primary navigation destinations", () => {
    render(<Header />);
    const nav = screen.getByRole("navigation", { name: "Main" });
    for (const label of ["Home", "Services", "CardMaster", "About Jim", "Blog"]) {
      expect(within(nav).getByRole("link", { name: label })).toBeInTheDocument();
    }
    // Educational pages are grouped under a "Learn" dropdown trigger.
    expect(within(nav).getByRole("button", { name: /Learn/ })).toBeInTheDocument();
  });

  it("opens the Learn dropdown and shows the grouped educational links", async () => {
    const user = userEvent.setup();
    render(<Header />);
    const trigger = screen.getByRole("button", { name: /Learn/ });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: /Points & Miles 101/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Tips & Strategies/ })).toBeInTheDocument();
  });

  it("marks the current page with aria-current", () => {
    render(<Header />);
    const active = screen
      .getAllByRole("link", { name: "Services" })
      .find((link) => link.getAttribute("aria-current") === "page");
    expect(active).toBeDefined();
  });

  it("shows the consultation CTA", () => {
    render(<Header />);
    expect(
      screen.getAllByRole("link", { name: "Book a Free Consultation" }).length,
    ).toBeGreaterThanOrEqual(1);
  });

  it("toggles the mobile drawer with an accessible button", async () => {
    const user = userEvent.setup();
    render(<Header />);

    const toggle = screen.getByRole("button", { name: "Open menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    // The drawer exposes the full flat navigation.
    const mobileNav = screen.getByRole("navigation", { name: "Mobile" });
    expect(within(mobileNav).getByRole("link", { name: "Success Stories" })).toBeInTheDocument();
    expect(within(mobileNav).getByRole("link", { name: "Contact" })).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("closes the drawer when a navigation link is clicked", async () => {
    const user = userEvent.setup();
    render(<Header />);

    const toggle = screen.getByRole("button", { name: "Open menu" });
    await user.click(toggle);
    const mobileNav = screen.getByRole("navigation", { name: "Mobile" });
    await user.click(within(mobileNav).getByRole("link", { name: "Resources" }));
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });
});
