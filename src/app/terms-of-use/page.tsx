import type { Metadata } from "next";
import { termsOfUse } from "@/content/legal";
import { LegalView } from "@/components/marketing/LegalView";

export const metadata: Metadata = {
  title: termsOfUse.title,
  description: termsOfUse.description,
  alternates: { canonical: "/terms-of-use" },
};

export default function TermsOfUsePage() {
  return <LegalView document={termsOfUse} />;
}
