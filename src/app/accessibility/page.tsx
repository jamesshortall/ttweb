import type { Metadata } from "next";
import { accessibilityStatement } from "@/content/legal";
import { LegalView } from "@/components/marketing/LegalView";

export const metadata: Metadata = {
  title: accessibilityStatement.title,
  description: accessibilityStatement.description,
  alternates: { canonical: "/accessibility" },
};

export default function AccessibilityPage() {
  return <LegalView document={accessibilityStatement} />;
}
