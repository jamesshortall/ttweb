"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { contactFormSchema, inquiryCategories, type ContactFormInput } from "@/lib/contact-schema";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

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
 * Contact form with shared client/server Zod validation, a honeypot field,
 * minimum-fill-time spam check, and screen-reader-announced status messages.
 */
export function ContactForm({ defaultCategory }: { defaultCategory?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [serverMessage, setServerMessage] = useState("");

  // Render timestamp for the minimum-fill-time spam check (set post-hydration).
  const startedAtRef = useRef<number | null>(null);
  useEffect(() => {
    startedAtRef.current ??= Date.now();
  }, []);

  const validCategory = inquiryCategories.some((c) => c.value === defaultCategory)
    ? (defaultCategory as ContactFormInput["category"])
    : undefined;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      category: validCategory,
      preferredContact: "email",
      website: "",
    },
  });

  // Focus target for the confirmation panel, so success is seen and announced
  // even when the form was submitted from far down a long page.
  const successHeadingRef = useRef<HTMLParagraphElement | null>(null);
  useEffect(() => {
    if (status === "success") {
      // scrollIntoView is guarded — some environments (e.g. jsdom) don't provide it.
      successHeadingRef.current?.scrollIntoView?.({ behavior: "smooth", block: "center" });
      successHeadingRef.current?.focus();
    }
  }, [status]);

  const submitForm = async (data: ContactFormInput) => {
    setStatus("submitting");
    setServerMessage("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, startedAt: startedAtRef.current ?? Date.now() }),
      });
      const body = (await response.json()) as { message?: string };
      if (!response.ok) {
        setStatus("error");
        setServerMessage(
          body.message ?? "Something went wrong sending your message. Please try again.",
        );
        return;
      }
      setStatus("success");
      reset({ category: validCategory, preferredContact: "email", website: "" });
    } catch {
      setStatus("error");
      setServerMessage("We couldn't reach the server. Please check your connection and try again.");
    }
  };

  // On success, replace the whole form with an unambiguous confirmation panel —
  // no lingering fields to make the sender wonder whether it actually sent.
  if (status === "success") {
    return (
      <div aria-live="polite" role="status" className="rounded-2xl border border-palm-300 bg-palm-50 p-6 sm:p-8">
        <p
          ref={successHeadingRef}
          tabIndex={-1}
          className="text-xl font-semibold text-palm-900 outline-none"
        >
          Message sent — thank you!
        </p>
        <p className="mt-2 text-palm-900/90">
          Jim reads every inquiry personally and typically replies within one to two business days.
          Want to talk sooner? You can also{" "}
          <Link href="/services" className="font-medium underline">
            review the services
          </Link>{" "}
          while you wait.
        </p>
        <div className="mt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setStatus("idle");
              setServerMessage("");
            }}
          >
            Send another message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) => void handleSubmit(submitForm)(event)}
      noValidate
      className="space-y-6"
    >
      {/* Status region: announced politely to screen readers. */}
      <div aria-live="polite" role="status">
        {status === "error" ? (
          <div className="rounded-xl border border-sunset-300 bg-sunset-50 p-4">
            <p className="font-semibold text-sunset-900">Your message wasn&apos;t sent</p>
            <p className="mt-1 text-sm text-sunset-900/90">{serverMessage}</p>
          </div>
        ) : null}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="mb-1.5 block font-semibold text-lagoon-950">
            Name
          </label>
          <input
            id="contact-name"
            type="text"
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            className={inputClasses}
            {...register("name")}
          />
          <FieldError id="contact-name-error" message={errors.name?.message} />
        </div>

        <div>
          <label htmlFor="contact-email" className="mb-1.5 block font-semibold text-lagoon-950">
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            className={inputClasses}
            {...register("email")}
          />
          <FieldError id="contact-email-error" message={errors.email?.message} />
        </div>
      </div>

      <div>
        <label htmlFor="contact-category" className="mb-1.5 block font-semibold text-lagoon-950">
          What can Jim help you with?
        </label>
        <select
          id="contact-category"
          aria-invalid={!!errors.category}
          aria-describedby={errors.category ? "contact-category-error" : undefined}
          className={cn(inputClasses, "appearance-none")}
          defaultValue={validCategory ?? ""}
          {...register("category")}
        >
          <option value="" disabled>
            Choose an inquiry category…
          </option>
          {inquiryCategories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
        <FieldError id="contact-category-error" message={errors.category?.message} />
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-1.5 block font-semibold text-lagoon-950">
          Message
        </label>
        <p id="contact-message-hint" className="mb-1.5 text-sm text-ink/70">
          Share where you are with points today and what you&apos;d like to accomplish. No
          preparation needed.
        </p>
        <textarea
          id="contact-message"
          rows={6}
          aria-invalid={!!errors.message}
          aria-describedby={
            errors.message ? "contact-message-hint contact-message-error" : "contact-message-hint"
          }
          className={inputClasses}
          {...register("message")}
        />
        <FieldError id="contact-message-error" message={errors.message?.message} />
      </div>

      <fieldset>
        <legend className="mb-2 font-semibold text-lagoon-950">
          Preferred contact method <span className="font-normal text-ink/70">(optional)</span>
        </legend>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {[
            { value: "email", label: "Email" },
            { value: "either", label: "Email or scheduled call" },
            { value: "no-preference", label: "No preference" },
          ].map((option) => (
            <label key={option.value} className="flex min-h-11 items-center gap-2">
              <input
                type="radio"
                value={option.value}
                className="h-4 w-4 accent-lagoon-700"
                {...register("preferredContact")}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Honeypot — hidden from people, tempting to bots. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="contact-website">Leave this field empty</label>
        <input
          id="contact-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      <div>
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            aria-invalid={!!errors.consent}
            aria-describedby={errors.consent ? "contact-consent-error" : undefined}
            className="mt-1 h-5 w-5 shrink-0 accent-lagoon-700"
            {...register("consent")}
          />
          <span className="text-sm leading-relaxed text-ink/80">
            I agree that Travel Technician may use the details I&apos;ve provided to respond to this
            inquiry, as described in the{" "}
            <Link href="/privacy-policy" className="font-medium text-lagoon-700 underline">
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        <FieldError id="contact-consent-error" message={errors.consent?.message} />
      </div>

      <Button type="submit" size="lg" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}
