import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  FileCheck2,
  FileText,
  GitCompare,
  History,
  MessageSquare,
} from "lucide-react";

const tools = [
  {
    number: "01",
    title: "Analyze",
    icon: BarChart3,
    description:
      "Find out how well your resume matches a specific job before you apply.",
    details: [
      "Upload your resume",
      "Paste a job description",
      "Get an overall match score",
      "See matched and missing skills",
      "Review suggestions and choose which to apply",
      "Get AI help wording each one, then download the result",
    ],
    href: "/dashboard",
    action: "Analyze your resume",
  },
  {
    number: "02",
    title: "Compare",
    icon: GitCompare,
    description:
      "Compare multiple job opportunities and see which ones are the best fit for your resume.",
    details: [
      "Select an uploaded resume",
      "Add 2–5 job descriptions",
      "Compare your match across roles",
      "Identify the strongest opportunities",
      "Make better application decisions",
    ],
    href: "/compare",
    action: "Compare jobs",
  },
  {
    number: "03",
    title: "Builder",
    icon: FileCheck2,
    description:
      "Create and maintain an ATS-friendly resume without starting from a blank page.",
    details: [
      "Enter your personal information",
      "Add education and experience",
      "Add skills and projects",
      "Organize your resume content",
      "Build a polished, job-ready resume",
    ],
    href: "/builder",
    action: "Build your resume",
  },
  {
    number: "04",
    title: "Cover Letter",
    icon: FileText,
    description:
      "Create a tailored cover letter using your resume and the job you're applying for.",
    details: [
      "Choose one of your resumes",
      "Paste the target job description",
      "Generate a tailored cover letter",
      "Review and refine the result",
      "Keep your generated letters for later",
    ],
    href: "/cover-letter",
    action: "Create a cover letter",
  },
  {
    number: "05",
    title: "Interview Prep",
    icon: MessageSquare,
    description:
      "Practice interview questions tailored to your resume and the role you're targeting.",
    details: [
      "Choose an uploaded resume",
      "Provide the job description",
      "Get role-specific interview questions",
      "Answer questions one at a time",
      "Receive feedback on your responses",
    ],
    href: "/interview-prep",
    action: "Start practicing",
  },
  {
    number: "06",
    title: "History",
    icon: History,
    description:
      "Keep track of your previous resume analyses so you can revisit them whenever you need.",
    details: [
      "View previous analyses",
      "See which resume was analyzed",
      "Revisit previous results",
      "Keep your job-search work organized",
      "Delete analyses you no longer need",
    ],
    href: "/history",
    action: "View your history",
  },
];

export default function GuidePage() {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 pt-12 pb-10 sm:pt-16 sm:pb-12">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-widest text-ink-secondary mb-3">
            JDReady
          </p>

          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink tracking-tight">
            How JDReady works
          </h1>

          <p className="mt-4 text-base sm:text-lg leading-7 text-ink-secondary max-w-xl">
            Everything you need to go from job description to interview-ready
            application — all in one place.
          </p>
        </div>

        {/* Starting point */}
        <div className="mt-8 rounded-2xl border border-border bg-surface p-5 sm:p-6">
          <h2 className="font-display text-base font-semibold text-ink">
            Not sure where to start?
          </h2>

          <p className="mt-1 text-sm text-ink-secondary">
            Pick the path that matches where you are right now.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Link
              href="/dashboard"
              className="group rounded-xl border border-border bg-background p-4 transition-colors hover:border-ink/20"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-ink">
                    I already have a resume
                  </p>
                  <p className="mt-1 text-xs leading-5 text-ink-secondary">
                    Analyze it against a job description first.
                  </p>
                </div>

                <ArrowRight
                  size={16}
                  className="shrink-0 text-ink-secondary transition-transform group-hover:translate-x-1"
                />
              </div>
            </Link>

            <Link
              href="/builder"
              className="group rounded-xl border border-border bg-background p-4 transition-colors hover:border-ink/20"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-ink">
                    I need to build a resume
                  </p>
                  <p className="mt-1 text-xs leading-5 text-ink-secondary">
                    Create your resume with the Builder.
                  </p>
                </div>

                <ArrowRight
                  size={16}
                  className="shrink-0 text-ink-secondary transition-transform group-hover:translate-x-1"
                />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="grid gap-5 md:grid-cols-2">
          {tools.map((tool) => {
            const Icon = tool.icon;

            return (
              <article
                key={tool.title}
                className="group flex flex-col rounded-2xl border border-border bg-surface p-5 sm:p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-ink/20"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background">
                      <Icon size={18} strokeWidth={1.8} className="text-ink" />
                    </div>

                    <div>
                      <p className="text-[11px] font-medium tracking-widest text-ink-secondary">
                        {tool.number}
                      </p>

                      <h2 className="font-display text-lg font-semibold text-ink">
                        {tool.title}
                      </h2>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="mt-5 text-sm leading-6 text-ink-secondary">
                  {tool.description}
                </p>

                {/* What it does */}
                <div className="mt-5">
                  <p className="text-xs font-medium uppercase tracking-wider text-ink">
                    What you can do
                  </p>

                  <ul className="mt-3 space-y-2">
                    {tool.details.map((detail) => (
                      <li
                        key={detail}
                        className="flex items-start gap-2.5 text-sm text-ink-secondary"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ink-secondary/60" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div className="mt-auto pt-4 border-t border-border">
                  <Link
                    href={tool.href}
                    className="inline-flex items-center gap-2 text-sm font-medium text-ink transition-colors hover:text-ink-secondary"
                  >
                    {tool.action}
                    <ArrowRight
                      size={15}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Workflow */}
      <section className="border-t border-border">
        <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-widest text-ink-secondary mb-3">
              A simple workflow
            </p>

            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
              From application to interview
            </h2>

            <p className="mt-3 text-sm sm:text-base leading-6 text-ink-secondary">
              JDReady does not force you into a fixed process. Use whichever
              tools you need, in whatever order makes sense for your job search.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {tools.map((tool, index) => (
              <Link
                key={tool.title}
                href={tool.href}
                className="group rounded-xl border border-border bg-surface p-4 transition-colors hover:border-ink/20"
              >
                <span className="text-[11px] font-medium tracking-widest text-ink-secondary">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <p className="mt-2 text-sm font-medium text-ink">
                  {tool.title}
                </p>

                <ArrowRight
                  size={14}
                  className="mt-4 text-ink-secondary transition-transform group-hover:translate-x-1"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
