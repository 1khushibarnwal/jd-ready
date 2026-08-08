import FadeIn from "@/components/animations/FadeIn";
import AnimatedCard from "@/components/animations/AnimatedCard";
import { features } from "@/data/landing";

export default function Features() {
  return (
    <section className="border-t border-border py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <FadeIn>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">
            Everything you need to land more interviews
          </h2>

          <p className="mt-3 max-w-2xl text-ink-secondary">
            Analyze resumes, compare job descriptions, build ATS-friendly
            resumes and prepare for interviews — all in one place.
          </p>
        </FadeIn>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3 [&>*:last-child:nth-child(3n+1)]:lg:col-start-2">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <AnimatedCard
                key={feature.title}
                delay={index * 0.08}
                className="rounded-xl border border-border bg-surface p-6 shadow-sm"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-background">
                  <Icon size={20} />
                </div>

                <h3 className="font-semibold text-ink">{feature.title}</h3>

                <p className="mt-3 text-sm leading-7 text-ink-secondary">
                  {feature.description}
                </p>
              </AnimatedCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
