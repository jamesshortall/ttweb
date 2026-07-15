/**
 * Legal page content — clearly written placeholders for review by legal
 * counsel before launch (see docs/LAUNCH-CHECKLIST.md). Editable in Sanity
 * (legalPage documents) once configured.
 */

export interface LegalSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface LegalDocument {
  slug: string;
  title: string;
  description: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
}

const LAST_UPDATED = "July 15, 2026";

export const independenceStatement =
  "Travel Technician is independent and is not affiliated with, endorsed by, or sponsored by any airline, hotel company, bank, credit card issuer, loyalty program, or travel agency. Travel Technician does not provide travel booking services.";

export const privacyPolicy: LegalDocument = {
  slug: "privacy-policy",
  title: "Privacy Policy",
  description:
    "How Travel Technician collects, uses, and protects information on www.traveltechnician.info.",
  lastUpdated: LAST_UPDATED,
  intro:
    'This Privacy Policy describes how Travel Technician ("we," "us") handles information collected through www.traveltechnician.info. It is a placeholder draft prepared for review by legal counsel before launch.',
  sections: [
    {
      heading: "Information we collect",
      paragraphs: [
        "We collect information you choose to provide through the contact form: your name, email address, inquiry category, message, and optional contact preference. We do not require an account to use this website.",
        "If nonessential analytics are enabled and you consent, we collect aggregate usage information (such as pages visited and approximate region) through a configurable analytics provider. Analytics are disabled until configured and, where required, until you consent.",
      ],
    },
    {
      heading: "How we use information",
      paragraphs: [
        "Contact-form submissions are used solely to respond to your inquiry and provide the services you request. We do not sell personal information, and we do not use contact-form details for marketing without your separate consent.",
      ],
    },
    {
      heading: "Cookies and consent",
      paragraphs: [
        'Essential functionality on this site does not depend on tracking cookies. A consent banner lets you accept or reject nonessential analytics; your choice is stored in your browser and can be changed at any time via the "Cookie Preferences" link in the footer.',
      ],
    },
    {
      heading: "Data retention",
      paragraphs: [
        "Contact-form submissions delivered by email are retained in the recipient mailbox in line with ordinary email retention. Where optional database storage is enabled, submissions are reviewed and deleted when no longer needed, and no later than 24 months after receipt unless an active client relationship exists. [Retention period pending legal review.]",
      ],
    },
    {
      heading: "Third-party services",
      paragraphs: [
        "This site links to separate services — including CardMaster (cardmaster.traveltechnician.info), the Travel Technician blog (blog.traveltechnician.info), Instagram, Facebook, and, when configured, Calendly for scheduling. Each has its own privacy practices; this policy covers only www.traveltechnician.info.",
        "CardMaster is a separate application with its own accounts. This website does not access CardMaster user data.",
      ],
    },
    {
      heading: "Your choices and contact",
      paragraphs: [
        "You may request a copy or deletion of the personal information you submitted through this site by contacting jim@traveltechnician.info. You can withdraw analytics consent at any time via Cookie Preferences.",
      ],
    },
  ],
};

export const termsOfUse: LegalDocument = {
  slug: "terms-of-use",
  title: "Terms of Use",
  description: "The terms that govern use of www.traveltechnician.info.",
  lastUpdated: LAST_UPDATED,
  intro:
    "These Terms of Use govern your use of www.traveltechnician.info, operated by Travel Technician. By using the site you accept these terms. This is a placeholder draft prepared for review by legal counsel before launch.",
  sections: [
    {
      heading: "Educational purpose",
      paragraphs: [
        "All content on this site is provided for general educational purposes. It is not financial, legal, tax, or investment advice, and it is not a recommendation to open, keep, or close any credit product. You are responsible for your own decisions and for reviewing the current terms and conditions of any loyalty program, credit card, or travel provider.",
      ],
    },
    {
      heading: "What Travel Technician is not",
      paragraphs: [independenceStatement],
      bullets: [
        "Travel Technician is not a bank and is not a credit card issuer.",
        "Travel Technician is not an airline, a hotel company, or a loyalty program.",
        "Travel Technician is not a travel agency and does not book travel.",
        "Credit card approval decisions are made solely by issuers.",
      ],
    },
    {
      heading: "Accuracy and change",
      paragraphs: [
        "Loyalty programs, credit card offers, award pricing, benefits, taxes, and fees change frequently and without notice. Content is believed accurate when published but may become outdated. Award availability is never guaranteed, and all redemption values described on this site are estimates.",
      ],
    },
    {
      heading: "Third-party links",
      paragraphs: [
        "Links to third-party sites — including the Travel Technician blog and CardMaster, which are separate applications — are provided for convenience. Travel Technician is not responsible for third-party content or practices. There are currently no credit card affiliate links on this site; see the Disclaimer for how any future referral or affiliate relationships will be disclosed.",
      ],
    },
    {
      heading: "Intellectual property and acceptable use",
      paragraphs: [
        "Site content is owned by Travel Technician and may not be republished commercially without permission. You agree not to misuse the site, including attempting to disrupt it or submitting unlawful, deceptive, or abusive content through its forms.",
      ],
    },
    {
      heading: "Disclaimer of warranties and limitation of liability",
      paragraphs: [
        'The site is provided "as is" without warranties of any kind. To the maximum extent permitted by law, Travel Technician is not liable for losses arising from use of the site or reliance on its content. [Jurisdiction and dispute-resolution provisions pending legal review.]',
      ],
    },
  ],
};

export const disclaimer: LegalDocument = {
  slug: "disclaimer",
  title: "Disclaimer",
  description:
    "Important context about the educational content, estimates, and independence of Travel Technician.",
  lastUpdated: LAST_UPDATED,
  intro:
    "Points and miles are genuinely valuable — and genuinely complicated. This page states plainly what this site's content is, what it is not, and the limits you should keep in mind. It is a placeholder draft prepared for review by legal counsel before launch.",
  sections: [
    {
      heading: "Educational content only",
      paragraphs: [
        "Everything on this site — including consultations and other services — is educational. It is not financial, legal, tax, or investment advice. Specific credit cards may be discussed for educational purposes; that discussion is never a recommendation that any card is right for you. Credit card approval is determined solely by the issuer.",
        "Use credit responsibly. Rewards never outweigh interest: do not carry an interest-bearing balance in order to earn points or miles, and do not open credit products that don't fit your broader financial situation.",
      ],
    },
    {
      heading: "Independence",
      paragraphs: [
        independenceStatement,
        "References to airlines, hotels, banks, card issuers, and loyalty programs are for identification and education only. All trademarks belong to their owners.",
      ],
    },
    {
      heading: "Estimates, availability, and change",
      paragraphs: ["When this site describes redemptions and values, remember:"],
      bullets: [
        "Award availability changes constantly and is not guaranteed.",
        "Loyalty program rules and award pricing change without notice.",
        "Taxes, fees, and surcharges vary by program, route, and date.",
        "Cash prices fluctuate; cents-per-point figures are estimates based on comparable cash prices, not promises of savings.",
        "Transfer availability between programs is not guaranteed.",
        "Offers, benefits, and program features described here may have changed since publication — always verify current terms with the provider.",
      ],
    },
    {
      heading: "Affiliate, referral, and informational links",
      paragraphs: [
        "There are currently no credit card affiliate links on this site, and this site does not currently earn affiliate revenue. Referral relationships may exist in the future; if Travel Technician ever receives compensation for a link, a clear disclosure will appear near that link.",
        "For clarity: an affiliate link pays commission on purchases or approvals; a referral link provides a benefit (often points) to the referrer; an informational link is uncompensated. Unless disclosed otherwise, links on this site are informational.",
      ],
    },
    {
      heading: "Your responsibility",
      paragraphs: [
        "You are responsible for reviewing the current terms and conditions of any program, card, or travel provider before acting, and for decisions made based on this site's content.",
      ],
    },
  ],
};

export const accessibilityStatement: LegalDocument = {
  slug: "accessibility",
  title: "Accessibility Statement",
  description: "Travel Technician's accessibility goals, features, and feedback channel.",
  lastUpdated: LAST_UPDATED,
  intro:
    "Travel Technician wants everyone to be able to learn about points and miles. This site targets WCAG 2.2 Level AA conformance.",
  sections: [
    {
      heading: "What we've built in",
      paragraphs: ["Accessibility measures on this site include:"],
      bullets: [
        "Full keyboard operability, visible focus indicators, and a skip-to-content link.",
        "Semantic HTML with a logical heading structure and landmarks.",
        "Labeled form fields with described, announced error messages.",
        "Color contrast meeting WCAG AA, with no information conveyed by color alone.",
        "Respect for reduced-motion preferences — rotating imagery becomes static.",
        "Descriptive alternative text for meaningful images.",
        "Touch targets sized for mobile use.",
      ],
    },
    {
      heading: "Known limitations",
      paragraphs: [
        "Some linked services — the Travel Technician blog, CardMaster, social platforms, and the scheduling provider — are separate applications whose accessibility we don't fully control. Automated and manual testing continues, and issues found on this site are prioritized for fixing.",
      ],
    },
    {
      heading: "Feedback",
      paragraphs: [
        "If you encounter an accessibility barrier on this site, please contact jim@traveltechnician.info or use the contact form. Please describe the page and the problem; we aim to respond within a few business days.",
      ],
    },
  ],
};

export const legalDocuments = [privacyPolicy, termsOfUse, disclaimer, accessibilityStatement];
