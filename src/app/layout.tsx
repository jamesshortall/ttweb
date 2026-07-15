import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import { siteConfig } from "@/lib/site-config";
import { serverEnv } from "@/lib/env";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/consent/CookieConsent";
import { Analytics } from "@/components/consent/Analytics";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationJsonLd, personJsonLd, webSiteJsonLd } from "@/lib/structured-data";
import "./globals.css";

// Validate environment configuration at startup (server-side, fails loudly).
serverEnv();

const sora = Sora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sora",
  weight: ["600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "points and miles for beginners",
    "how to use credit card points",
    "travel rewards strategy",
    "track credit card benefits",
    "loyalty program tips",
    "free points and miles tracker",
  ],
  authors: [{ name: siteConfig.founder.legalName, url: `${siteConfig.url}/about` }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable}`}>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <JsonLd data={[organizationJsonLd(), personJsonLd(), webSiteJsonLd()]} />
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <CookieConsent />
        <Analytics />
      </body>
    </html>
  );
}
