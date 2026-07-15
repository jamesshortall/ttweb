import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Header } from "@/components/layout/Header";

vi.mock("next/navigation", () => ({
  usePathname: () => "/services",
}));

describe("Header", () => {
  it("renders the main navigation with all primary destinations", () => {
    render(<Header />);
    const nav = screen.getByRole("navigation", { name: "Main" });
    for (const label of [
      "Start Here",
      "Tips & Strategies",
      "Services",
      "CardMaster",
      "Success Stories",
      "Resources",
      "Blog",
      "About Jim",
      "Contact",
    ]) {
      expect(nav).toContainElement(screen.getAllByRole("link", { name: label })[0]!);
    }
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
      screen.getAllByRole("link", { name: "Schedule a Free Consultation" }).length,
    ).toBeGreaterThanOrEqual(1);
  });

  it("toggles the mobile menu with an accessible button", async () => {
    const user = userEvent.setup();
    render(<Header />);

    const toggle = screen.getByRole("button", { name: "Open menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);
    expect(screen.getByRole("button", { name: "Close menu" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getByRole("navigation", { name: "Mobile" })).toBeVisible();

    await user.keyboard("{Escape}");
    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("closes the mobile menu when a navigation link is clicked", async () => {
    const user = userEvent.setup();
    render(<Header />);

    await user.click(screen.getByRole("button", { name: "Open menu" }));
    const mobileNav = screen.getByRole("navigation", { name: "Mobile" });
    const link = Array.from(mobileNav.querySelectorAll("a")).find(
      (a) => a.textContent === "Resources",
    )!;
    await user.click(link);
    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });
});
