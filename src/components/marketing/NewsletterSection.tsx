import type { NewsletterSettings } from "@/lib/cms/types";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Newsletter section, CMS-controlled: "coming-soon" (default, no fake signup
 * input), "active" (renders once a provider is wired up), or "hidden".
 */
export function NewsletterSection({ settings }: { settings: NewsletterSettings }) {
  if (settings.mode === "hidden") return null;

  return (
    <section aria-labelledby="newsletter-heading" className="bg-porcelain-100 py-20">
      <Container>
        <Reveal className="relative overflow-hidden rounded-3xl border border-navy-100 bg-white px-6 py-14 shadow-xl shadow-navy-950/5 sm:px-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-90 [background:radial-gradient(40%_60%_at_100%_0%,rgba(31,147,168,0.1),transparent_60%),radial-gradient(40%_60%_at_0%_100%,rgba(199,150,58,0.1),transparent_60%)]"
          />
          <div className="relative max-w-2xl">
            <p className="eyebrow flex items-center gap-3 text-gold-600">
              <span className="rule-gold" aria-hidden="true" />
              Coming soon
            </p>
            <h2 id="newsletter-heading" className="mt-4 text-3xl font-semibold text-navy-900 sm:text-4xl">
              {settings.heading}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink/70">{settings.body}</p>
            {settings.mode === "active" ? (
              <p className="mt-6 rounded-xl bg-porcelain-100 p-4 text-sm text-ink/70">
                Newsletter signup is enabled, but no provider integration is configured yet.
                Connect a provider (see docs/CONTENT-GUIDE.md) to replace this notice with the
                signup form.
              </p>
            ) : (
              <ul className="mt-7 flex flex-wrap gap-2.5" aria-label="Planned newsletter topics">
                {settings.topics.map((topic) => (
                  <li
                    key={topic}
                    className="rounded-full border border-navy-100 bg-porcelain-50 px-3.5 py-1.5 text-sm font-medium text-navy-800"
                  >
                    {topic}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
