import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="relative isolate overflow-hidden bg-lagoon-950 py-24 sm:py-32">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(63,175,191,0.35),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(249,93,23,0.2),transparent_50%)]"
      />
      <Container className="text-center">
        <p className="font-display text-7xl font-bold text-sunset-400 sm:text-8xl">404</p>
        <h1 className="font-display mt-4 text-3xl font-bold text-white sm:text-4xl">
          This route has no award availability
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-lagoon-100">
          The page you&apos;re looking for doesn&apos;t exist — it may have moved, or the link may
          be out of date. Happens to the best itineraries.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <ButtonLink href="/" size="lg">
            Back to the homepage
          </ButtonLink>
          <ButtonLink href="/points-and-miles-101" variant="inverse" size="lg">
            Start learning instead
          </ButtonLink>
        </div>
        <p className="mt-8 text-sm text-lagoon-200">
          Still stuck?{" "}
          <Link href="/contact" className="font-semibold underline hover:text-white">
            Contact Jim
          </Link>{" "}
          and mention what you were looking for.
        </p>
      </Container>
    </section>
  );
}
