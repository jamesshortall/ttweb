import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/marketing/PageHero";
import { SmsOptInForm } from "@/components/forms/SmsOptInForm";
import { SMS_PROGRAM } from "@/content/sms-program";
import { JsonLd } from "@/components/seo/JsonLd";
import { webPageJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Text Message Updates — Sign Up",
  description:
    "Opt in to receive text messages from Travel Technician about your inquiry, scheduling, and appointment reminders. Message frequency varies. Message and data rates may apply. Reply STOP to cancel.",
  alternates: { canonical: "/sms-opt-in" },
};

const programFacts = [
  { label: "What you'll get", value: SMS_PROGRAM.description },
  { label: "How often", value: SMS_PROGRAM.frequency },
  { label: "Cost", value: `${SMS_PROGRAM.rates} Travel Technician never charges for texts.` },
  { label: "Stopping", value: SMS_PROGRAM.optOut },
];

export default function SmsOptInPage() {
  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: metadata.title as string,
          description: metadata.description as string,
          path: "/sms-opt-in",
        })}
      />

      <PageHero
        eyebrow="Text updates"
        title="Get text updates from Travel Technician"
        description="Prefer a text to an email? Enter your mobile number below and you'll get messages about your inquiry, scheduling, and appointment reminders — nothing else."
        crumbs={[{ name: "Text Updates", path: "/sms-opt-in" }]}
      />

      <section aria-labelledby="signup-heading" className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <h2 id="signup-heading" className="sr-only">
            Sign up for text updates
          </h2>

          <dl className="grid gap-4 rounded-2xl border border-lagoon-100 bg-porcelain-50 p-6 sm:grid-cols-2">
            {programFacts.map((fact) => (
              <div key={fact.label}>
                <dt className="text-sm font-semibold text-lagoon-950">{fact.label}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-ink/75">{fact.value}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-6 text-sm leading-relaxed text-ink/70">
            Signing up is optional and is never a condition of buying anything. Travel Technician
            does not sell or share your SMS opt-in data or personal information with third parties
            for marketing purposes — see the{" "}
            <Link href="/privacy-policy" className="font-medium text-lagoon-700 underline">
              Privacy Policy
            </Link>{" "}
            for details.
          </p>

          <div className="mt-10">
            <SmsOptInForm />
          </div>
        </Container>
      </section>
    </>
  );
}
