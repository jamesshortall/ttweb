import { describe, expect, it } from "vitest";
import { describeEmailError } from "@/lib/email";

/** Nodemailer/Node attach the useful fields to a plain Error. */
function smtpError(fields: Record<string, unknown>): Error {
  return Object.assign(new Error("connection closed"), fields);
}

describe("describeEmailError", () => {
  it("surfaces the transport code that a bare error name hides", () => {
    const described = describeEmailError(smtpError({ code: "EAUTH" }));
    expect(described).toContain("EAUTH");
  });

  it("includes the SMTP status, failing command, and server reply", () => {
    const described = describeEmailError(
      smtpError({
        code: "EENVELOPE",
        responseCode: 550,
        command: "RCPT TO",
        response: "550 5.7.1 Sender address rejected",
      }),
    );
    expect(described).toContain("smtp=550");
    expect(described).toContain("command=RCPT TO");
    expect(described).toContain("Sender address rejected");
  });

  it("falls back to the message when there is no server reply", () => {
    expect(describeEmailError(smtpError({ code: "ETIMEDOUT" }))).toContain("connection closed");
  });

  it("truncates a long server reply so logs stay readable", () => {
    const described = describeEmailError(smtpError({ response: "x".repeat(500) }));
    expect(described.length).toBeLessThan(300);
  });

  it("collapses newlines so one failure stays on one log line", () => {
    const described = describeEmailError(smtpError({ response: "550 rejected\n  retry later" }));
    expect(described).not.toContain("\n");
  });

  it("handles a non-Error value without throwing", () => {
    expect(describeEmailError("boom")).toBe("unknown error");
  });
});
