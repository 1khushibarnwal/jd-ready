import FadeIn from "@/components/animations/FadeIn";
import { faqs } from "@/data/landing";

export default function FAQ() {
  return (
    <section className="border-t border-border py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <FadeIn>
          <h2 className="font-display text-3xl font-bold text-ink">
            Frequently Asked Questions
          </h2>
        </FadeIn>

        <div className="mt-10 space-y-4">
          {faqs.map((faq, index) => (
            <FadeIn key={faq.q} delay={index * 0.08}>
              <details className="group rounded-xl border border-border bg-surface p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between font-medium gap-4 text-sm sm:text-base">
                  {faq.q}

                  <span className="transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>

                <p className="mt-4 leading-7 text-ink-secondary">{faq.a}</p>
              </details>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
