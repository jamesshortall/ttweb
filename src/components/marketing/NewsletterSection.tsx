import type { NewsletterSettings } from "@/lib/cms/types";
import { Container } from "@/components/ui/Container";

/**
 * Newsletter section, CMS-controlled:
 *  - "coming-soon" (default): polished announcement, deliberately with NO
 *    email input — we never fake a signup workflow.
 *  - "active": renders the provider form once one is integrated (the
 *    provider-agnostic seam is documented in docs/CONTENT-GUIDE.md).
 *  - "hidden": renders nothing.
 */
export function NewsletterSection({ settings }: { settings: NewsletterSettings }) {
  if (settings.mode === "hidden") return null;

  return (
    <section aria-labelledby="newsletter-heading" className="bg-sand-50 py-20">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-lagoon-900 px-6 py-12 sm:px-12">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(249,93,23,0.25),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(63,175,191,0.3),transparent_55%)]"
          />
          <div className="relative max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full bg-sunset-500/20 px-4 py-1 text-sm font-bold tracking-wide text-sunset-200 uppercase">
              Coming soon
            </p>
            <h2 id="newsletter-heading" className="font-display mt-4 text-3xl font-bold text-white">
              {settings.heading}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-lagoon-100">{settings.body}</p>
            {settings.mode === "active" ? (
              <p className="mt-6 rounded-xl bg-white/10 p-4 text-sm text-lagoon-100">
                Newsletter signup is enabled in settings, but no provider integration is configured
                yet. Connect a provider (see docs/CONTENT-GUIDE.md, “Activating the newsletter”) to
                replace this notice with the signup form.
              </p>
            ) : (
              <ul className="mt-6 flex flex-wrap gap-2" aria-label="Planned newsletter topics">
                {settings.topics.map((topic) => (
                  <li
                    key={topic}
                    className="rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-medium text-lagoon-50"
                  >
                    {topic}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
