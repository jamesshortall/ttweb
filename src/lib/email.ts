import { serverEnv } from "@/lib/env";
import { categoryLabel, type ContactFormData } from "@/lib/contact-schema";

/**
 * Provider-agnostic transactional email.
 *
 * Both built-in drivers (Resend, Postmark) use plain HTTPS calls, so no
 * provider SDK ships in the bundle. Adding an SMTP or other provider means
 * implementing `EmailDriver` and registering it in `resolveDriver`.
 */

export interface EmailMessage {
  to: string;
  from: string;
  replyTo?: string;
  subject: string;
  text: string;
}

export interface EmailDriver {
  name: string;
  send(message: EmailMessage): Promise<void>;
}

class EmailDeliveryError extends Error {
  constructor(driver: string, status: number) {
    // Deliberately excludes response bodies — they can echo submitted content.
    super(`Email delivery via ${driver} failed with status ${status}`);
    this.name = "EmailDeliveryError";
  }
}

function resendDriver(apiKey: string): EmailDriver {
  return {
    name: "resend",
    async send(message) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: message.from,
          to: [message.to],
          reply_to: message.replyTo,
          subject: message.subject,
          text: message.text,
        }),
      });
      if (!response.ok) throw new EmailDeliveryError("resend", response.status);
    },
  };
}

function postmarkDriver(serverToken: string): EmailDriver {
  return {
    name: "postmark",
    async send(message) {
      const response = await fetch("https://api.postmarkapp.com/email", {
        method: "POST",
        headers: {
          "X-Postmark-Server-Token": serverToken,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          From: message.from,
          To: message.to,
          ReplyTo: message.replyTo,
          Subject: message.subject,
          TextBody: message.text,
        }),
      });
      if (!response.ok) throw new EmailDeliveryError("postmark", response.status);
    },
  };
}

interface SmtpConfig {
  host: string;
  port: number;
  /** true for implicit TLS (port 465); false for STARTTLS (port 587). */
  secure: boolean;
  user: string;
  pass: string;
}

/**
 * SMTP driver for a standard mailbox (e.g. IONOS). Nodemailer is imported
 * dynamically so it only loads when SMTP is actually the configured provider,
 * keeping it out of every other server bundle.
 */
function smtpDriver(config: SmtpConfig): EmailDriver {
  return {
    name: "smtp",
    async send(message) {
      const nodemailer = await import("nodemailer");
      const transport = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth: { user: config.user, pass: config.pass },
      });
      // sendMail throws on failure; the caller logs the error's name only.
      await transport.sendMail({
        from: message.from,
        to: message.to,
        replyTo: message.replyTo,
        subject: message.subject,
        text: message.text,
      });
    },
  };
}

function resolveDriver(): EmailDriver | null {
  const env = serverEnv();
  if (env.EMAIL_PROVIDER === "resend" && env.RESEND_API_KEY) {
    return resendDriver(env.RESEND_API_KEY);
  }
  if (env.EMAIL_PROVIDER === "postmark" && env.POSTMARK_SERVER_TOKEN) {
    return postmarkDriver(env.POSTMARK_SERVER_TOKEN);
  }
  if (env.EMAIL_PROVIDER === "smtp" && env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASSWORD) {
    const port = env.SMTP_PORT ?? 587;
    return smtpDriver({
      host: env.SMTP_HOST,
      port,
      // Default from the port (465 = implicit TLS); SMTP_SECURE overrides.
      secure: env.SMTP_SECURE ? env.SMTP_SECURE === "true" : port === 465,
      user: env.SMTP_USER,
      pass: env.SMTP_PASSWORD,
    });
  }
  return null;
}

export function isEmailConfigured(): boolean {
  const env = serverEnv();
  return resolveDriver() !== null && !!env.CONTACT_TO_EMAIL && !!env.EMAIL_FROM_ADDRESS;
}

/**
 * Deliver a contact-form submission. Returns false (without throwing) when no
 * provider is configured, so development environments degrade to logging.
 */
export async function sendContactEmail(data: ContactFormData): Promise<boolean> {
  const env = serverEnv();
  const driver = resolveDriver();

  if (!driver || !env.CONTACT_TO_EMAIL || !env.EMAIL_FROM_ADDRESS) {
    // Log metadata only — never the message body or personal details.
    console.info(
      `[contact] Email provider not configured; submission received (category: ${data.category}).`,
    );
    return false;
  }

  await driver.send({
    to: env.CONTACT_TO_EMAIL,
    from: env.EMAIL_FROM_ADDRESS,
    replyTo: data.email,
    subject: `[Travel Technician] ${categoryLabel(data.category)} — ${data.name}`,
    text: [
      `New inquiry from the Travel Technician website`,
      ``,
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Category: ${categoryLabel(data.category)}`,
      `Preferred contact: ${data.preferredContact}`,
      ``,
      `Message:`,
      data.message,
    ].join("\n"),
  });
  return true;
}
