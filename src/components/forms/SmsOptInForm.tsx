"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Script from "next/script";
import { smsOptInFormSchema, type SmsOptInInput } from "@/lib/sms-optin-schema";
import { CONSENT_TEXT } from "@/content/sms-program";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site-config";

interface TurnstileApi {
  render: (
    element: HTMLElement,
    options: {
      sitekey: string;
      theme?: string;
      callback: (token: string) => void;
      "expired-callback"?: () => void;
      "error-callback"?: () => void;
    },
  ) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

type Status = "idle" | "submitting" | "success" | "error";

const inputClasses =
  "w-full rounded-xl border border-lagoon-200 bg-white px-4 py-3 text-ink placeholder:text-ink/40 focus:border-lagoon-500 aria-[invalid=true]:border-sunset-700";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-sm font-medium text-sunset-800">
      {message}
    </p>
  );
}

/**
 * Public SMS opt-in form. The consent checkbox is unchecked by default and the
 * agreement shown beside it is the exact text stored with the consent record.
 */
export function SmsOptInForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [serverMessage, setServerMessage] = useState("");

  const turnstileSiteKey = siteConfig.turnstileSiteKey;
  const [turnstileToken, setTurnstileToken] = useState("");
  const widgetRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | undefined>(undefined);

  /**
   * Render the widget explicitly rather than letting the script auto-scan for
   * it. Implicit rendering only scans when the script first loads, so it
   * misses this form on client-side navigation, when the script is already
   * there and never scans again.
   */
  const renderTurnstile = useCallback(() => {
    if (!turnstileSiteKey || !widgetRef.current) return;
    if (widgetIdRef.current !== undefined) return;
    if (!window.turnstile) return;
    widgetIdRef.current = window.turnstile.render(widgetRef.current, {
      sitekey: turnstileSiteKey,
      theme: "light",
      callback: (token: string) => setTurnstileToken(token),
      // A token is short-lived and single-use; drop it when it stops counting.
      "expired-callback": () => setTurnstileToken(""),
      "error-callback": () => setTurnstileToken(""),
    });
  }, [turnstileSiteKey]);

  // Covers the case where the script loaded before this form mounted.
  useEffect(() => {
    renderTurnstile();
  }, [renderTurnstile]);

  const startedAtRef = useRef<number | null>(null);
  useEffect(() => {
    startedAtRef.current ??= Date.now();
  }, []);

  const confirmationRef = useRef<HTMLParagraphElement | null>(null);
  useEffect(() => {
    if (status === "success") {
      confirmationRef.current?.scrollIntoView?.({ behavior: "smooth", block: "center" });
      confirmationRef.current?.focus();
    }
  }, [status]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SmsOptInInput>({
    resolver: zodResolver(smsOptInFormSchema),
    // Consent must start unchecked — never pre-consent a visitor.
    defaultValues: { name: "", phone: "", website: "", consent: false as unknown as true },
  });

  const submitForm = async (data: SmsOptInInput) => {
    if (turnstileSiteKey && !turnstileToken) {
      setStatus("error");
      setServerMessage(
        "The verification check hasn't finished. Give it a moment and try again — if it never appears, reload the page.",
      );
      return;
    }

    setStatus("submitting");
    setServerMessage("");
    try {
      const response = await fetch("/api/sms-optin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          startedAt: startedAtRef.current ?? Date.now(),
          turnstileToken: turnstileSiteKey ? turnstileToken : undefined,
        }),
      });
      const body = (await response.json()) as { message?: string };
      if (!response.ok) {
        setStatus("error");
        setServerMessage(body.message ?? "Something went wrong. Please try again.");
        // A token is single-use; get a fresh one for the retry.
        window.turnstile?.reset(widgetIdRef.current);
        setTurnstileToken("");
        return;
      }
      setStatus("success");
    } catch {
      setStatus("error");
      setServerMessage("We couldn't reach the server. Please check your connection and try again.");
    }
  };

  // What a subscriber sees immediately after submitting.
  if (status === "success") {
    return (
      <div
        aria-live="polite"
        role="status"
        className="rounded-2xl border border-palm-300 bg-palm-50 p-6 sm:p-8"
      >
        <p
          ref={confirmationRef}
          tabIndex={-1}
          className="text-xl font-semibold text-palm-900 outline-none"
        >
          You&apos;re subscribed — check your phone.
        </p>
        <p className="mt-2 leading-relaxed text-palm-900/90">
          A welcome text from Travel Technician is on its way to the number you gave us, confirming
          you&apos;re enrolled. Message frequency varies, and message and data rates may apply.
        </p>
        <p className="mt-3 leading-relaxed text-palm-900/90">
          You can stop any time by replying <strong>STOP</strong> to any message, or reply{" "}
          <strong>HELP</strong> for help.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) => void handleSubmit(submitForm)(event)}
      noValidate
      className="space-y-6"
    >
      <div aria-live="polite" role="status">
        {status === "error" ? (
          <div className="rounded-xl border border-sunset-300 bg-sunset-50 p-4">
            <p className="font-semibold text-sunset-900">We couldn&apos;t sign you up</p>
            <p className="mt-1 text-sm text-sunset-900/90">{serverMessage}</p>
          </div>
        ) : null}
      </div>

      <div>
        <label htmlFor="sms-name" className="mb-1.5 block font-semibold text-lagoon-950">
          Name <span className="font-normal text-ink/70">(optional)</span>
        </label>
        <input
          id="sms-name"
          type="text"
          autoComplete="name"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "sms-name-error" : undefined}
          className={inputClasses}
          {...register("name")}
        />
        <FieldError id="sms-name-error" message={errors.name?.message} />
      </div>

      <div>
        <label htmlFor="sms-phone" className="mb-1.5 block font-semibold text-lagoon-950">
          Mobile number
        </label>
        <input
          id="sms-phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="(555) 555-5555"
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? "sms-phone-error" : undefined}
          className={inputClasses}
          {...register("phone")}
        />
        <FieldError id="sms-phone-error" message={errors.phone?.message} />
      </div>

      {/* Honeypot — hidden from people, tempting to bots. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="sms-website">Leave this field empty</label>
        <input id="sms-website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div>
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            aria-invalid={!!errors.consent}
            aria-describedby="sms-consent-text"
            className="mt-1 h-5 w-5 shrink-0 accent-lagoon-700"
            {...register("consent")}
          />
          <span id="sms-consent-text" className="text-sm leading-relaxed text-ink/80">
            {CONSENT_TEXT}
          </span>
        </label>
        <FieldError id="sms-consent-error" message={errors.consent?.message} />
        <p className="mt-3 pl-8 text-sm text-ink/70">
          See our{" "}
          <Link href="/privacy-policy" className="font-medium text-lagoon-700 underline">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href="/terms-of-use" className="font-medium text-lagoon-700 underline">
            Terms of Service
          </Link>
          .
        </p>
      </div>

      {turnstileSiteKey ? (
        <div>
          <Script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
            strategy="afterInteractive"
            onLoad={renderTurnstile}
            onReady={renderTurnstile}
          />
          <div ref={widgetRef} />
        </div>
      ) : null}

      <Button type="submit" size="lg" disabled={status === "submitting"}>
        {status === "submitting" ? "Signing you up…" : "Sign Up for Text Updates"}
      </Button>
    </form>
  );
}
