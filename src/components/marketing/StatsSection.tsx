import type { SiteStat } from "@/lib/cms/types";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { CountUp } from "@/components/motion/CountUp";

/** Splits a display value like "5M+" or "$150,000+" into count-up parts. */
function parseStat(value: string): { prefix: string; number: number; suffix: string } | null {
  const match = value.match(/^(\D*)(\d[\d,]*)(.*)$/);
  if (!match) return null;
  const number = Number(match[2]!.replace(/,/g, ""));
  if (!Number.isFinite(number)) return null;
  return { prefix: match[1] ?? "", number, suffix: match[3] ?? "" };
}

/**
 * Editorial statistics band on deep navy: large serif figures that count up as
 * they scroll into view, separated by gold rules. Placeholder figures (the
 * pending travel-value estimate) are clearly tagged.
 */
export function StatsSection({ stats }: { stats: SiteStat[] }) {
  return (
    <section aria-labelledby="stats-heading" className="relative overflow-hidden bg-navy-950 py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-80 [background:radial-gradient(50%_60%_at_50%_0%,rgba(31,147,168,0.16),transparent_60%)]"
      />
      <Container className="relative">
        <h2 id="stats-heading" className="sr-only">
          Travel Technician by the numbers
        </h2>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const parsed = stat.isPlaceholder ? null : parseStat(stat.value);
            return (
              <Reveal
                key={stat.id}
                as="li"
                delay={index * 90}
                className="relative list-none text-center lg:border-l lg:border-white/10 lg:first:border-l-0"
              >
                <p className="font-serif text-5xl font-semibold text-white sm:text-6xl">
                  {parsed ? (
                    <CountUp value={parsed.number} prefix={parsed.prefix} suffix={parsed.suffix} />
                  ) : (
                    <span className="text-gold-300">{stat.value}</span>
                  )}
                </p>
                {stat.isPlaceholder ? (
                  <span className="mt-2 inline-block rounded-full bg-gold-500/15 px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-gold-300">
                    Final figure pending
                  </span>
                ) : (
                  <span className="mx-auto mt-3 block h-px w-8 bg-gold-500/70" aria-hidden="true" />
                )}
                <p className="mx-auto mt-3 max-w-[15rem] text-sm leading-snug text-navy-100/80">
                  {stat.label}
                </p>
              </Reveal>
            );
          })}
        </ul>
        <p className="mt-12 text-center text-xs text-navy-300/70">
          Value figures are estimates based on comparable cash prices at redemption time — see the{" "}
          <a href="/disclaimer" className="underline hover:text-white">
            Disclaimer
          </a>
          .
        </p>
      </Container>
    </section>
  );
}
