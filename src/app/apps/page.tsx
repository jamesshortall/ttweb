import type { Metadata } from "next";
import Image from "next/image";
import { type AppEntry } from "@/content/apps";
import { getApps } from "@/lib/cms";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/marketing/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { JsonLd } from "@/components/seo/JsonLd";
import { webPageJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Apps & Tools — The Travel Technician Suite",
  description:
    "Every app and tool from Travel Technician in one place: CardMaster, AppPassport, and more — free tools to help you earn, organize, and redeem points and miles.",
  alternates: { canonical: "/apps" },
};

export const revalidate = 3600;

function AppCard({ app }: { app: AppEntry }) {
  const comingSoon = app.status === "coming-soon";
  return (
    <a
      href={comingSoon ? undefined : app.url}
      {...(comingSoon
        ? { "aria-disabled": true, tabIndex: -1 }
        : { target: "_blank", rel: "noopener noreferrer" })}
      className={
        "group flex flex-col rounded-2xl border border-navy-100 bg-white p-6 shadow-sm transition-all " +
        (comingSoon
          ? "cursor-default opacity-70"
          : "hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500")
      }
    >
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-teal-50 text-teal-700">
          {app.image ? (
            <Image
              src={app.image.src}
              alt={app.image.alt}
              width={48}
              height={48}
              className="h-12 w-12 object-cover"
            />
          ) : (
            <Icon name={app.icon ?? "compass"} className="h-6 w-6" />
          )}
        </span>
        <div>
          <h3 className="font-display text-lg font-bold text-navy-900">{app.name}</h3>
          <p className="text-sm text-navy-600">{app.tagline}</p>
        </div>
        {app.badge ? (
          <span className="ml-auto rounded-full bg-gold-100 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-gold-800">
            {app.badge}
          </span>
        ) : null}
      </div>
      <p className="mt-4 flex-1 text-sm leading-relaxed text-ink/80">{app.description}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-teal-700 group-hover:text-teal-600">
        {comingSoon ? "Coming soon" : app.cta}
        {!comingSoon ? <span aria-hidden="true">→</span> : null}
      </span>
    </a>
  );
}

export default async function AppsPage() {
  const appList = await getApps();
  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            title: metadata.title as string,
            description: metadata.description as string,
            path: "/apps",
          }),
        ]}
      />
      <PageHero
        eyebrow="The suite"
        title="Apps & tools from Travel Technician"
        description="Free tools to help you earn, organize, and redeem points and miles — built and maintained by Jim. More on the way."
        crumbs={[{ name: "Apps", path: "/apps" }]}
      />

      <section aria-labelledby="apps-heading" className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Everything in one place"
            title="The Travel Technician suite"
            description="Each app is independent and free to use. Sign-in and account rules are handled within each app."
          />
          <h2 id="apps-heading" className="sr-only">
            Travel Technician apps and tools
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {appList.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
