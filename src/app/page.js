import Link from "next/link";
import {
  FileCheck2,
  FileSearch,
  Layers,
  FileText,
  Mail,
  History,
  Check,
  X,
} from "lucide-react";

const features = [
  {
    icon: FileSearch,
    title: "Resume analysis",
    description:
      "Upload your resume and a job description to get an instant match score, along with the specific skills you're missing.",
  },
  {
    icon: Layers,
    title: "Compare multiple jobs",
    description:
      "Paste in several job descriptions at once and see, ranked, which role your resume is actually the strongest fit for.",
  },
  {
    icon: FileText,
    title: "ATS-friendly builder",
    description:
      "No resume yet? Build one from scratch with a guided form and export a clean, single-column PDF that parses correctly.",
  },
  {
    icon: Mail,
    title: "Cover letters",
    description:
      "Generate a tailored, professional cover letter from your resume and a job description in seconds.",
  },
  {
    icon: History,
    title: "Full history",
    description:
      "Every analysis and cover letter is saved, so you can revisit past results or pick up a draft where you left off.",
  },
];

const steps = [
  {
    title: "Upload or build",
    description:
      "Upload an existing resume, or build one from scratch with our guided form.",
  },
  {
    title: "Paste the job description",
    description:
      "Drop in the JD you're applying to — or several, if you're comparing options.",
  },
  {
    title: "Get your score & gaps",
    description:
      "See a match score, the skills you already show, and what's missing.",
  },
  {
    title: "Download & apply",
    description:
      "Export an ATS-ready resume and a tailored cover letter, ready to send.",
  },
];

const comparisonRows = [
  { label: "Instant match scoring", jdready: true, manual: false },
  { label: "Identifies missing keywords/skills", jdready: true, manual: false },
  { label: "ATS-friendly formatting built in", jdready: true, manual: false },
  { label: "Tailored cover letter generation", jdready: true, manual: false },
  { label: "Compare several roles at once", jdready: true, manual: false },
  { label: "Takes more than a few minutes", jdready: false, manual: true },
];

const faqs = [
  {
    q: "What file formats can I upload?",
    a: "JDReady accepts .pdf and .docx resume files. If you don't have one yet, you can build one from scratch instead.",
  },
  {
    q: "How is the match score calculated?",
    a: "An AI model compares your resume's actual content against the job description and scores the overlap. It's a guide to help you improve your resume — not a guarantee of interview outcomes.",
  },
  {
    q: "Is my resume data private?",
    a: "Your resumes, analyses, and cover letters are only visible to your account. We don't share your data with other users.",
  },
  {
    q: "Do I need an existing resume to use JDReady?",
    a: "No — if you don't have one, the built-in resume builder walks you through creating an ATS-friendly resume from scratch.",
  },
  {
    q: "Can I use JDReady for more than one job application?",
    a: "Yes. Every resume, analysis, and cover letter is saved to your account, and you can compare one resume against multiple job descriptions at once.",
  },
];

export default function Home() {
  return (
    <div className="bg-background">
      {/* Public header */}
      <header className="border-b border-border bg-surface">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center h-8 w-8 rounded-md bg-ink text-surface">
              <FileCheck2 size={18} />
            </span>
            <span className="font-display text-xl font-bold text-ink tracking-tight">
              JDReady
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-md px-4 py-2 text-sm font-medium text-ink-secondary hover:text-ink transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-md bg-ink text-surface text-sm font-medium px-4 py-2 hover:opacity-90 transition-opacity"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-ink mb-5 leading-[1.1]">
            Know exactly why your resume isn&apos;t landing interviews.
          </h1>
          <p className="text-lg text-ink-secondary mb-8 leading-relaxed">
            JDReady matches your resume against any job description, shows you
            precisely what&apos;s missing, and helps you fix it — with an
            ATS-friendly resume builder and tailored cover letters built in.
          </p>
          <div className="flex items-center gap-3">
            <Link
              href="/signup"
              className="rounded-md bg-ink text-surface text-sm font-medium px-6 py-3 hover:opacity-90 transition-opacity"
            >
              Get started free
            </Link>
            <Link
              href="/login"
              className="rounded-md border border-border text-ink text-sm font-medium px-6 py-3 hover:bg-surface transition-colors"
            >
              Log in
            </Link>
          </div>
        </div>

        {/* Illustrative score card mockup */}
        <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-5">
            <div className="font-mono text-4xl font-semibold text-success">
              82
            </div>
            <div className="text-sm text-ink-secondary">
              / 100 match score
              <p className="mt-1 text-ink">
                Strong overlap on core skills, with a few gaps worth addressing.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold text-success mb-1.5">Matched</p>
              <p className="text-ink-secondary">React · Node.js · MongoDB</p>
            </div>
            <div>
              <p className="font-semibold text-danger mb-1.5">Missing</p>
              <p className="text-ink-secondary">GraphQL · Docker</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 border-t border-border">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink mb-2">
          Everything you need to apply with confidence
        </h2>
        <p className="text-ink-secondary mb-10 max-w-2xl">
          One place to analyze, build, and tailor your application materials.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="border border-border rounded-lg p-5 bg-surface"
              >
                <div className="h-9 w-9 rounded-md bg-background flex items-center justify-center mb-4 text-ink">
                  <Icon size={18} />
                </div>
                <h3 className="font-semibold text-ink mb-1.5">{f.title}</h3>
                <p className="text-sm text-ink-secondary leading-relaxed">
                  {f.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 border-t border-border">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink mb-10">
          How it works
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={step.title}>
              <div className="font-mono text-sm font-semibold text-accent mb-2">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="font-semibold text-ink mb-1.5">{step.title}</h3>
              <p className="text-sm text-ink-secondary leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 border-t border-border">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink mb-10">
          JDReady vs. reviewing it yourself
        </h2>
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="grid grid-cols-3 bg-background text-sm font-semibold text-ink">
            <div className="px-5 py-3">Feature</div>
            <div className="px-5 py-3 text-center">JDReady</div>
            <div className="px-5 py-3 text-center">Manual review</div>
          </div>
          {comparisonRows.map((row, i) => (
            <div
              key={row.label}
              className={`grid grid-cols-3 text-sm ${i % 2 === 1 ? "bg-surface" : ""}`}
            >
              <div className="px-5 py-3 text-ink">{row.label}</div>
              <div className="px-5 py-3 flex justify-center">
                {row.jdready ? (
                  <Check size={16} className="text-success" />
                ) : (
                  <X size={16} className="text-ink-secondary" />
                )}
              </div>
              <div className="px-5 py-3 flex justify-center">
                {row.manual ? (
                  <Check size={16} className="text-success" />
                ) : (
                  <X size={16} className="text-ink-secondary" />
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 border-t border-border">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink mb-10">
          Frequently asked questions
        </h2>
        <div className="space-y-3">
          {faqs.map((item) => (
            <details
              key={item.q}
              className="group border border-border rounded-lg px-5 py-4 bg-surface"
            >
              <summary className="cursor-pointer font-medium text-ink list-none flex items-center justify-between">
                {item.q}
                <span className="text-ink-secondary group-open:rotate-45 transition-transform ml-4 shrink-0">
                  +
                </span>
              </summary>
              <p className="text-sm text-ink-secondary mt-3 leading-relaxed">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 border-t border-border text-center">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink mb-4">
          Ready to see your match score?
        </h2>
        <Link
          href="/signup"
          className="inline-block rounded-md bg-ink text-surface text-sm font-medium px-6 py-3 hover:opacity-90 transition-opacity"
        >
          Get started free
        </Link>
      </section>

      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-sm text-ink-secondary">
          © {new Date().getFullYear()} JDReady.
        </div>
      </footer>
    </div>
  );
}
