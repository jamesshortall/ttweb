import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site-config";

/** Homepage CardMaster feature band. */
export function CardMasterHighlight() {
  return (
    <section aria-labelledby="cardmaster-highlight" className="bg-lagoon-50/60 py-20">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-bold tracking-widest text-sunset-600 uppercase">
              Free app · CardMaster
            </p>
            <h2 id="cardmaster-highlight" className="font-display text-3xl font-bold text-lagoon-950 sm:text-4xl">
              Every point, card, and benefit — in one dashboard
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink/80">
              CardMaster is the free tracker Jim built to run his own points strategy: loyalty
              balances, credit card benefits and statement credits, annual fees, and expiration
              reminders — for you and your whole household.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Track points and miles across every program",
                "Never miss a statement credit or annual fee again",
                "Get reminded before points expire",
                "Manage cards for the whole household",
              ].map((item) => (
                <li key={item} className="flex gap-3 font-medium text-ink/85">
                  <span aria-hidden="true" className="mt-0.5 text-palm-600">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-4">
              <ButtonLink href={siteConfig.cardmasterUrl} external size="lg">
                Start Using CardMaster
              </ButtonLink>
              <Link
                href="/cardmaster"
                className="inline-flex min-h-12 items-center font-semibold text-lagoon-800 underline decoration-2 underline-offset-4 hover:text-lagoon-950"
              >
                Learn more about CardMaster
              </Link>
            </div>
            <p className="mt-4 text-sm text-ink/60">
              Free to use · New accounts require approval · A separate app from this website
            </p>
          </div>
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-lagoon-300/50 to-sunset-300/50 blur-xl"
            />
            <Image
              src="/images/cardmaster/screenshot-dashboard.svg"
              alt="Placeholder screenshot of the CardMaster points dashboard"
              width={1440}
              height={900}
              className="relative w-full rounded-2xl border border-lagoon-100 shadow-2xl"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
