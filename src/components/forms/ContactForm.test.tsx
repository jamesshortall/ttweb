import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactForm } from "@/components/forms/ContactForm";

function mockFetchOnce(response: { ok: boolean; status?: number; body?: unknown }) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: response.ok,
    status: response.status ?? (response.ok ? 200 : 500),
    json: async () => response.body ?? {},
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByRole("textbox", { name: "Name" }), "Ada Traveler");
  await user.type(screen.getByRole("textbox", { name: "Email" }), "ada@example.com");
  await user.selectOptions(
    screen.getByLabelText("What can Jim help you with?"),
    "free-consultation",
  );
  await user.type(
    screen.getByLabelText("Message"),
    "I have 200,000 points and no idea how to use them for a trip to Japan.",
  );
  await user.click(screen.getByRole("checkbox"));
}

describe("ContactForm", () => {
  it("renders all fields including the nine inquiry categories", () => {
    render(<ContactForm />);
    expect(screen.getByRole("textbox", { name: "Name" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Email" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Message" })).toBeInTheDocument();
    const select = screen.getByLabelText("What can Jim help you with?");
    // 9 categories + 1 disabled prompt option.
    expect(select.querySelectorAll("option")).toHaveLength(10);
  });

  it("preselects a category passed via defaultCategory", () => {
    render(<ContactForm defaultCategory="cardmaster-support" />);
    expect(screen.getByLabelText("What can Jim help you with?")).toHaveValue("cardmaster-support");
  });

  it("shows accessible validation errors and does not submit an empty form", async () => {
    const fetchMock = mockFetchOnce({ ok: true });
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.click(screen.getByRole("button", { name: "Send Message" }));

    const alerts = await screen.findAllByRole("alert");
    expect(alerts.length).toBeGreaterThanOrEqual(3);
    expect(screen.getByRole("textbox", { name: "Name" })).toHaveAttribute("aria-invalid", "true");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("submits a valid form and announces success", async () => {
    const fetchMock = mockFetchOnce({ ok: true, body: { ok: true } });
    const user = userEvent.setup();
    render(<ContactForm />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "Send Message" }));

    await waitFor(() => {
      expect(screen.getByText("Message sent — thank you!")).toBeInTheDocument();
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/contact",
      expect.objectContaining({ method: "POST" }),
    );
    const payload = JSON.parse((fetchMock.mock.calls[0]?.[1] as RequestInit).body as string);
    expect(payload).toMatchObject({
      name: "Ada Traveler",
      email: "ada@example.com",
      category: "free-consultation",
      consent: true,
    });
  });

  it("shows the server's failure message when delivery fails", async () => {
    mockFetchOnce({
      ok: false,
      status: 502,
      body: { message: "We couldn't send your message right now. Please try again shortly." },
    });
    const user = userEvent.setup();
    render(<ContactForm />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "Send Message" }));

    await waitFor(() => {
      expect(screen.getByText("Your message wasn't sent")).toBeInTheDocument();
    });
    expect(
      screen.getByText("We couldn't send your message right now. Please try again shortly."),
    ).toBeInTheDocument();
  });

  it("shows a network-failure message when fetch rejects", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));
    const user = userEvent.setup();
    render(<ContactForm />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "Send Message" }));

    await waitFor(() => {
      expect(
        screen.getByText(
          "We couldn't reach the server. Please check your connection and try again.",
        ),
      ).toBeInTheDocument();
    });
  });
});
