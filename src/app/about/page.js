import { auth } from "@/auth";
import Link from "next/link";

import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import FadeIn from "@/components/animations/FadeIn";

export const metadata = {
  title: "About — JDReady",
  description: "Why JDReady exists and what it helps you do before you apply.",
};

export default async function AboutPage() {
  const session = await auth();

  return (
    <div className="bg-background">
      <Header session={session} />

      <main className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <FadeIn>
          <h1 className="font-display text-4xl font-bold text-ink">
            About JDReady
          </h1>
        </FadeIn>

        <FadeIn delay={0.08}>
          <p className="mt-6 leading-8 text-ink-secondary">
            Applying to a role usually means guessing: does my resume actually
            match this job description, or am I just hoping it does? JDReady was
            built to replace that guess with something concrete — an honest
            comparison between what a job asks for and what your resume actually
            shows, plus the tools to close the gap before you hit submit.
          </p>
        </FadeIn>

        <FadeIn delay={0.14}>
          <div className="mt-10 space-y-6">
            <div className="rounded-xl border border-border bg-surface p-5">
              <h2 className="font-display text-lg font-semibold text-ink">
                What it does
              </h2>
              <p className="mt-2 leading-7 text-ink-secondary">
                Upload a resume and a job description and get a match score, the
                skills you&apos;re missing, and what to fix. From there, you
                choose exactly which suggestions to apply — get AI help drafting
                the wording and knowing where it goes, edit it your way, and
                only then generate an updated resume. Don&apos;t have a resume
                yet? Build one from scratch, or generate a starting point from a
                job description and the skills you already know. JDReady can
                also draft a tailored cover letter and run you through a mock
                interview for the role — all saved to your account so you can
                revisit or compare across as many jobs as you&apos;re applying
                to.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-surface p-5">
              <h2 className="font-display text-lg font-semibold text-ink">
                What it won&apos;t do
              </h2>
              <p className="mt-2 leading-7 text-ink-secondary">
                JDReady won&apos;t invent work experience, employers, degrees,
                or achievements you didn&apos;t give it — every AI-assisted
                feature only ever reframes and organizes what you actually
                provide. And it won&apos;t edit your resume on its own: every
                suggested change is opt-in, one by one, and nothing is applied
                until you&apos;ve reviewed and approved it. It&apos;s a tool for
                presenting your real skills and experience as clearly as
                possible, not for fabricating a resume that isn&apos;t true.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-surface p-5">
              <h2 className="font-display text-lg font-semibold text-ink">
                Your data
              </h2>
              <p className="mt-2 leading-7 text-ink-secondary">
                Your resumes, analyses, cover letters, and interview sessions
                are private to your account. You can delete your account and
                everything tied to it at any time. Details on what&apos;s
                collected and why are in the{" "}
                <Link href="/privacy" className="text-ink underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="mt-10 text-sm text-ink-secondary">
            Built by{" "}
            <a
              href="https://github.com/1khushibarnwal"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink underline"
            >
              Khushi Barnwal
            </a>
            . Have feedback or found a bug? Open an issue on{" "}
            <a
              href="https://github.com/1khushibarnwal/jd-ready"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink underline"
            >
              GitHub
            </a>
            .
          </p>
        </FadeIn>
      </main>

      <Footer session={session} />
    </div>
  );
}
