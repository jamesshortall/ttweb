"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { testimonialFormSchema, type TestimonialFormInput } from "@/lib/testimonial-schema";
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
 * Testimonial submission form. Mirrors the contact form's shared client/server
 * Zod validation, honeypot, and minimum-fill-time spam checks. A submission is
 * saved as an unpublished draft for Jim to verify and publish - it never
 * appears on the site automatically.
 */
export function TestimonialForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [serverMessage, setServerMessage] = useState("");

  const startedAtRef = useRef<number | null>(null);
  useEffect(() => {
    startedAtRef.current ??= Date.now();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TestimonialFormInput>({
    resolver: zodResolver(testimonialFormSchema),
    defaultValues: { website: "" },
  });

  const submitForm = async (data: TestimonialFormInput) => {
    setStatus("submitting");
    setServerMessage("");
    try {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, startedAt: startedAtRef.current ?? Date.now() }),
      });
      const body = (await response.json()) as { message?: string };
      if (!response.ok) {
        setStatus("error");
        setServerMessage(
          body.message ?? "Something went wrong submitting your testimonial. Please try again.",
        );
        return;
      }
      setStatus("success");
      reset({ website: "" });
    } catch {
      setStatus("error");
      setServerMessage("We couldn't reach the server. Please check your connection and try again.");
    }
  };

  return (
    <form
      onSubmit={(event) => void handleSubmit(submitForm)(event)}
      noValidate
      className="space-y-6"
    >
      <div aria-live="polite" role="status">
        {status === "success" ? (
          <div className="rounded-xl border border-palm-300 bg-palm-50 p-4">
            <p className="font-semibold text-palm-900">Thank you - your testimonial is with Jim.</p>
            <p className="mt-1 text-sm text-palm-900/90">
              Nothing is published automatically. Jim reviews every submission and, with your
              permission, may add it to the site. He may reach out to confirm first.
            </p>
          </div>
        ) : null}
        {status === "error" ? (
          <div className="rounded-xl border border-sunset-300 bg-sunset-50 p-4">
            <p className="font-semibold text-sunset-900">Your testimonial wasn&apos;t submitted</p>
            <p className="mt-1 text-sm text-sunset-900/90">{serverMessage}</p>
          </div>
        ) : null}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="tm-name" className="mb-1.5 block font-semibold text-lagoon-950">
            Your name
          </label>
          <input
            id="tm-name"
            type="text"
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "tm-name-error" : undefined}
            className={inputClasses}
            {...register("name")}
          />
          <FieldError id="tm-name-error" message={errors.name?.message} />
        </div>

        <div>
          <label htmlFor="tm-detail" className="mb-1.5 block font-semibold text-lagoon-950">
            How to credit you{" "}
            <span className="font-normal text-ink/70">(optional)</span>
          </label>
          <input
            id="tm-detail"
            type="text"
            placeholder="e.g. Austin, TX or family of four"
            aria-invalid={!!errors.attributionDetail}
            aria-describedby={errors.attributionDetail ? "tm-detail-error" : undefined}
            className={inputClasses}
            {...register("attributionDetail")}
          />
          <FieldError id="tm-detail-error" message={errors.attributionDetail?.message} />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="tm-email" className="mb-1.5 block font-semibold text-lagoon-950">
            Email <span className="font-normal text-ink/70">(optional, never published)</span>
          </label>
          <input
            id="tm-email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby="tm-email-hint"
            className={inputClasses}
            {...register("email")}
          />
          <p id="tm-email-hint" className="mt-1.5 text-sm text-ink/70">
            So Jim can confirm it&apos;s really you before publishing.
          </p>
          <FieldError id="tm-email-error" message={errors.email?.message} />
        </div>

        <div>
          <label htmlFor="tm-rating" className="mb-1.5 block font-semibold text-lagoon-950">
            Rating <span className="font-normal text-ink/70">(optional)</span>
          </label>
          <select
            id="tm-rating"
            className={cn(inputClasses, "appearance-none")}
            defaultValue=""
            {...register("rating")}
          >
            <option value="">No rating</option>
            <option value="5">5 - Excellent</option>
            <option value="4">4 - Great</option>
            <option value="3">3 - Good</option>
            <option value="2">2 - Fair</option>
            <option value="1">1 - Poor</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="tm-quote" className="mb-1.5 block font-semibold text-lagoon-950">
          Your experience
        </label>
        <textarea
          id="tm-quote"
          rows={6}
          aria-invalid={!!errors.quote}
          aria-describedby={errors.quote ? "tm-quote-error" : undefined}
          className={inputClasses}
          {...register("quote")}
        />
        <FieldError id="tm-quote-error" message={errors.quote?.message} />
      </div>

      {/* Honeypot - hidden from people, tempting to bots. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="tm-website">Leave this field empty</label>
        <input
          id="tm-website"
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
            aria-describedby={errors.consent ? "tm-consent-error" : undefined}
            className="mt-1 h-5 w-5 shrink-0 accent-lagoon-700"
            {...register("consent")}
          />
          <span className="text-sm leading-relaxed text-ink/80">
            These are my own words, and I&apos;m happy for Jim to publish them (with the credit
            above) on the Travel Technician site if he chooses to.
          </span>
        </label>
        <FieldError id="tm-consent-error" message={errors.consent?.message} />
      </div>

      <Button type="submit" size="lg" disabled={status === "submitting"}>
        {status === "submitting" ? "Submitting…" : "Submit Testimonial"}
      </Button>
    </form>
  );
}
