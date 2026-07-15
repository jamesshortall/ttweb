import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CookieConsent } from "@/components/consent/CookieConsent";
import { CONSENT_OPEN_EVENT, CONSENT_STORAGE_KEY, readConsent } from "@/lib/consent";
import { analyticsConfig } from "@/lib/site-config";

describe("CookieConsent", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  function enableAnalytics() {
    // analyticsConfig reads env at module load; spoof the getter for the test.
    vi.spyOn(analyticsConfig, "enabled", "get").mockReturnValue(true);
  }

  it("stays hidden when no analytics are configured", () => {
    render(<CookieConsent />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("shows the banner when consent-gated analytics are configured and undecided", () => {
    enableAnalytics();
    render(<CookieConsent />);
    expect(screen.getByRole("dialog", { name: "Cookies and privacy" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Privacy Policy" })).toHaveAttribute(
      "href",
      "/privacy-policy",
    );
  });

  it("gives Accept and Reject equal prominence (both real buttons)", () => {
    enableAnalytics();
    render(<CookieConsent />);
    expect(screen.getByRole("button", { name: "Accept analytics" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reject nonessential" })).toBeInTheDocument();
  });

  it("persists an accept decision and hides", async () => {
    enableAnalytics();
    const user = userEvent.setup();
    render(<CookieConsent />);

    await user.click(screen.getByRole("button", { name: "Accept analytics" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(readConsent()?.analytics).toBe(true);
  });

  it("persists a reject decision", async () => {
    enableAnalytics();
    const user = userEvent.setup();
    render(<CookieConsent />);

    await user.click(screen.getByRole("button", { name: "Reject nonessential" }));
    expect(readConsent()?.analytics).toBe(false);
  });

  it("does not reappear once a decision is stored", () => {
    enableAnalytics();
    window.localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify({ analytics: false, decidedAt: new Date().toISOString() }),
    );
    render(<CookieConsent />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("reopens with details when Cookie Preferences is invoked", () => {
    window.localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify({ analytics: true, decidedAt: new Date().toISOString() }),
    );
    render(<CookieConsent />);
    act(() => {
      window.dispatchEvent(new CustomEvent(CONSENT_OPEN_EVENT));
    });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Essential")).toBeInTheDocument();
    expect(screen.getByText("Analytics (optional)")).toBeInTheDocument();
  });
});
