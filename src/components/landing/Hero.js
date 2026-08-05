import Link from "next/link";

import FadeIn from "@/components/animations/FadeIn";
import AnimatedButton from "@/components/animations/AnimatedButton";

import AnalysisCard from "./AnalysisCard";

export default function Hero({ session }) {
  return (
    <section className="relative overflow-hidden">
      {/* background glow */}

      <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />

      <div className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-success/10 blur-3xl" />

      <div className="mx-auto grid max-w-6xl gap-16 px-4 py-20 sm:px-6 md:grid-cols-2 md:items-center">
        <FadeIn>
          <div>
            <p className="mb-4 inline-flex rounded-full border border-border bg-surface px-4 py-2 text-sm text-ink-secondary">
              ✨ AI Resume Intelligence
            </p>

            <h1 className="font-display text-5xl font-bold leading-tight tracking-tight text-ink">
              Know exactly why your resume is not landing interviews.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-secondary">
              Upload your resume, compare it against any job description,
              discover missing skills, generate ATS-friendly resumes, create
              tailored cover letters, and prepare for interviews — all powered
              by AI.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              {session ? (
                <AnimatedButton>
                  <Link
                    href="/dashboard"
                    className="rounded-lg bg-ink px-6 py-3 font-medium text-surface"
                  >
                    Go to Dashboard
                  </Link>
                </AnimatedButton>
              ) : (
                <>
                  <AnimatedButton>
                    <Link
                      href="/signup"
                      className="rounded-lg bg-ink px-6 py-3 font-medium text-surface"
                    >
                      Get Started Free
                    </Link>
                  </AnimatedButton>

                  <AnimatedButton>
                    <Link
                      href="/login"
                      className="rounded-lg border border-border px-6 py-3 font-medium text-ink"
                    >
                      Log In
                    </Link>
                  </AnimatedButton>
                </>
              )}
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <AnalysisCard />
        </FadeIn>
      </div>
    </section>
  );
}
