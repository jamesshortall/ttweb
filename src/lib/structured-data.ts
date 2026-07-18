import { absoluteUrl, siteConfig } from "@/lib/site-config";

/**
 * JSON-LD builders (schema.org).
 *
 * Deliberately conservative: no ratings, reviews, or paid prices are ever
 * emitted. CardMaster is the only offer described, and it is genuinely free.
 */

type JsonLd = Record<string, unknown>;

export function organizationJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absoluteUrl("/#organization"),
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    slogan: siteConfig.tagline,
    logo: absoluteUrl("/images/brand/logo-primary.svg"),
    founder: { "@id": absoluteUrl("/#person") },
    sameAs: [siteConfig.instagramUrl, siteConfig.facebookUrl, siteConfig.blogUrl],
  };
}

export function personJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": absoluteUrl("/#person"),
    name: siteConfig.founder.name,
    alternateName: siteConfig.founder.legalName,
    url: absoluteUrl("/about"),
    jobTitle: "Points and Miles Strategist",
    worksFor: { "@id": absoluteUrl("/#organization") },
    knowsAbout: [
      "Airline loyalty programs",
      "Hotel loyalty programs",
      "Credit card rewards",
      "Award travel",
      "Transferable points currencies",
    ],
    sameAs: [siteConfig.instagramUrl, siteConfig.facebookUrl],
  };
}

export function webSiteJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: { "@id": absoluteUrl("/#organization") },
    inLanguage: "en-US",
  };
}

export function webPageJsonLd(options: {
  title: string;
  description: string;
  path: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: options.title,
    description: options.description,
    url: absoluteUrl(options.path),
    isPartOf: { "@id": absoluteUrl("/#website") },
    inLanguage: "en-US",
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqJsonLd(faqs: Array<{ question: string; answer: string }>): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function articleJsonLd(options: {
  title: string;
  description: string;
  path: string;
  datePublished?: string;
  dateModified?: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: options.title,
    description: options.description,
    url: absoluteUrl(options.path),
    author: { "@id": absoluteUrl("/#person") },
    publisher: { "@id": absoluteUrl("/#organization") },
    ...(options.datePublished ? { datePublished: options.datePublished } : {}),
    ...(options.dateModified ? { dateModified: options.dateModified } : {}),
    inLanguage: "en-US",
  };
}

export function softwareApplicationJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "CardMaster",
    url: siteConfig.cardmasterUrl,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    description:
      "Free points, miles, and credit card benefits tracker: balances, statement credits, annual fees, expiration reminders, and household card management.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    publisher: { "@id": absoluteUrl("/#organization") },
  };
}

export function serviceJsonLd(options: {
  name: string;
  description: string;
  path: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: options.name,
    description: options.description,
    url: absoluteUrl(options.path),
    provider: { "@id": absoluteUrl("/#organization") },
    serviceType: "Points and miles education and consulting",
    areaServed: "Worldwide (remote)",
  };
}
