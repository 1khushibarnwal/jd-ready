import Link from "next/link";

import FadeIn from "@/components/animations/FadeIn";
import AnimatedButton from "@/components/animations/AnimatedButton";

export default function CTA({ session }) {
  return (
    <section className="border-t border-border py-20">
      <FadeIn>
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-display text-4xl font-bold text-ink">
            Ready to land more interviews?
          </h2>

          <p className="mt-4 text-lg text-ink-secondary">
            Upload your resume and let AI tell you exactly what recruiters are
            looking for.
          </p>

          <AnimatedButton className="mt-8 inline-block">
            <Link
              href={session ? "/dashboard" : "/signup"}
              className="rounded-lg bg-ink px-7 py-3 font-medium text-surface"
            >
              {session ? "Go to Dashboard" : "Get Started Free"}
            </Link>
          </AnimatedButton>
        </div>
      </FadeIn>
    </section>
  );
}
