import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { Icon } from "@/components/ui/Icon";
import { siteConfig } from "@/lib/site-config";

const points = [
  { icon: "chart" as const, text: "Every points and miles balance in one place" },
  { icon: "card" as const, text: "Statement credits and benefits, tracked all year" },
  { icon: "bell" as const, text: "Reminders before points expire" },
  { icon: "users" as const, text: "Cards and balances for the whole household" },
];

/** Homepage CardMaster feature band — navy canvas, gold accents, real screenshot. */
export function CardMasterHighlight() {
  return (
    <section aria-labelledby="cardmaster-highlight" className="relative overflow-hidden bg-navy-900 py-24 text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-80 [background:radial-gradient(45%_55%_at_80%_20%,rgba(31,147,168,0.22),transparent_60%),radial-gradient(40%_50%_at_10%_90%,rgba(199,150,58,0.12),transparent_60%)]"
      />
      <Container className="relative">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow flex items-center gap-3 text-gold-300">
              <span className="rule-gold" aria-hidden="true" />
              Free app · CardMaster
            </p>
            <h2 id="cardmaster-highlight" className="mt-5 text-balance text-3xl font-semibold sm:text-4xl md:text-[2.75rem] md:leading-[1.1]">
              Every point, card, and benefit — in one calm dashboard
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-navy-100/85">
              CardMaster is the free tracker Jim built to run his own points strategy: loyalty
              balances, credit card benefits and statement credits, annual fees, and expiration
              reminders — for you and your whole household.
            </p>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {points.map((point) => (
                <li key={point.text} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-gold-300">
                    <Icon name={point.icon} className="h-5 w-5" />
                  </span>
                  <span className="text-sm leading-snug text-navy-100/90">{point.text}</span>
                </li>
              ))}
            </ul>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <ButtonLink href={siteConfig.cardmasterUrl} external size="lg">
                Start Using CardMaster
              </ButtonLink>
              <Link href="/cardmaster" className="inline-flex min-h-13 items-center font-semibold text-white underline decoration-gold-400/70 decoration-2 underline-offset-4 hover:text-gold-200">
                Learn more
              </Link>
            </div>
            <p className="mt-4 text-sm text-navy-200/70">
              Free to use · New accounts require approval · A separate app from this site
            </p>
          </Reveal>

          <Reveal delay={120} className="relative">
            <div aria-hidden="true" className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-teal-400/30 to-gold-400/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-2xl border border-white/15 shadow-2xl shadow-navy-950/50">
              <Image
                src="/images/cardmaster/screenshot-dashboard.svg"
                alt="Placeholder screenshot of the CardMaster points dashboard"
                width={1440}
                height={900}
                className="w-full"
              />
            </div>
            <p className="mt-3 text-center text-xs text-navy-200/60">
              Placeholder screenshot — replace with the live app before launch
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
