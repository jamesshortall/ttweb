import type { Metadata } from "next";
import { disclaimer } from "@/content/legal";
import { LegalView } from "@/components/marketing/LegalView";

export const metadata: Metadata = {
  title: disclaimer.title,
  description: disclaimer.description,
  alternates: { canonical: "/disclaimer" },
};

export default function DisclaimerPage() {
  return <LegalView document={disclaimer} />;
}
