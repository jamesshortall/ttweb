import type { SiteStat } from "@/lib/cms/types";
import { Container } from "@/components/ui/Container";

/**
 * Homepage statistics band. Placeholder stats (like the pending
 * estimated-travel-value figure) are visibly tagged so unfinished content is
 * obvious rather than accidentally shipped as fact.
 */
export function StatsSection({ stats }: { stats: SiteStat[] }) {
  return (
    <section aria-labelledby="stats-heading" className="bg-lagoon-950 py-14">
      <Container>
        <h2 id="stats-heading" className="sr-only">
          Travel Technician by the numbers
        </h2>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.id} className="text-center">
              <dd className="font-display text-4xl font-bold text-white sm:text-5xl">
                {stat.value}
                {stat.isPlaceholder ? (
                  <span className="mt-2 block text-xs font-semibold tracking-wide text-sunset-300 uppercase">
                    Final figure pending
                  </span>
                ) : null}
              </dd>
              <dt className="mx-auto mt-3 max-w-[16rem] text-sm leading-snug font-medium text-lagoon-200">
                {stat.label}
              </dt>
            </div>
          ))}
        </dl>
        <p className="mt-10 text-center text-xs text-lagoon-300/80">
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
