import type { Faq } from "@/lib/cms/types";

/**
 * FAQ list built on native <details>/<summary> — keyboard accessible and
 * screen-reader friendly with zero JavaScript.
 */
export function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="divide-y divide-lagoon-100 rounded-2xl border border-lagoon-100 bg-white">
      {faqs.map((faq) => (
        <details key={faq.question} className="group px-6 py-4 open:bg-lagoon-50/40">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 py-1 font-semibold text-lagoon-950 [&::-webkit-details-marker]:hidden">
            <span>{faq.question}</span>
            <span
              aria-hidden="true"
              className="text-xl leading-none text-sunset-700 transition-transform duration-200 group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="pt-2 pb-2 leading-relaxed text-ink/80">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
