import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/site-config";
import { footerCompanyLinks, footerLearnLinks, footerLegalLinks } from "@/content/navigation";
import { independenceStatement } from "@/content/legal";
import { CookiePreferencesLink } from "@/components/consent/CookiePreferencesLink";

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-sm font-bold tracking-widest text-lagoon-200 uppercase">{title}</h2>
      <ul className="mt-4 space-y-2.5">{children}</ul>
    </div>
  );
}

const footerLink =
  "text-lagoon-50/90 hover:text-white hover:underline underline-offset-4 transition-colors";

export function Footer() {
  return (
    <footer className="bg-lagoon-950 text-lagoon-50">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Image
              src="/images/brand/logo-light.svg"
              alt="Travel Technician"
              width={240}
              height={45}
              className="h-9 w-auto"
            />
            <p className="mt-4 max-w-sm leading-relaxed text-lagoon-100/90">
              Points and miles education, strategy, and free tools that help you turn everyday
              spending into extraordinary travel.
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href={siteConfig.instagramUrl}
                rel="noopener noreferrer"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-lagoon-900 text-lagoon-100 transition-colors hover:bg-lagoon-800 hover:text-white"
              >
                <span className="sr-only">Travel Technician on Instagram (external link)</span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                  className="h-5 w-5"
                >
                  <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a
                href={siteConfig.facebookUrl}
                rel="noopener noreferrer"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-lagoon-900 text-lagoon-100 transition-colors hover:bg-lagoon-800 hover:text-white"
              >
                <span className="sr-only">Travel Technician on Facebook (external link)</span>
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5">
                  <path d="M13.5 21v-7h2.6l.4-3h-3V9.1c0-.9.3-1.5 1.6-1.5h1.5V4.9c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8V11H8v3h2.7v7h2.8Z" />
                </svg>
              </a>
            </div>
          </div>

          <FooterColumn title="Learn">
            {footerLearnLinks.map((item) =>
              item.external ? (
                <li key={item.label}>
                  <a href={item.href} rel="noopener noreferrer" className={footerLink}>
                    {item.label}
                  </a>
                </li>
              ) : (
                <li key={item.label}>
                  <Link href={item.href} className={footerLink}>
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </FooterColumn>

          <FooterColumn title="Travel Technician">
            {footerCompanyLinks.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className={footerLink}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <a href={siteConfig.cardmasterUrl} rel="noopener noreferrer" className={footerLink}>
                Launch CardMaster
              </a>
            </li>
          </FooterColumn>

          <FooterColumn title="Legal">
            {footerLegalLinks.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className={footerLink}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <CookiePreferencesLink className={footerLink} />
            </li>
          </FooterColumn>
        </div>

        <div className="mt-12 border-t border-lagoon-800 pt-8">
          <p className="max-w-4xl text-sm leading-relaxed text-lagoon-200/90">
            {independenceStatement}
          </p>
          <p className="mt-4 text-sm text-lagoon-300/80">
            © {new Date().getFullYear()} Travel Technician. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
