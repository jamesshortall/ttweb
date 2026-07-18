import type { Metadata } from "next";
import { privacyPolicy } from "@/content/legal";
import { LegalView } from "@/components/marketing/LegalView";

export const metadata: Metadata = {
  title: privacyPolicy.title,
  description: privacyPolicy.description,
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return <LegalView document={privacyPolicy} />;
}
