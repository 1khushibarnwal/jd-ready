import Link from "next/link";
import {
  FileCheck2,
  FileSearch,
  Layers,
  FileText,
  Mail,
  MessageCircle,
  History,
  Check,
  X,
} from "lucide-react";

import { auth } from "@/auth";
import LandingUserMenu from "@/components/LandingUserMenu";
import { faqs, comparisonRows } from "@/data/landing";
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";

export default async function Home() {
  const session = await auth();

  return (
    <div className="bg-background">
      {/* Public header */}
      <Header session={session} />

      {/* Hero */}
      <Hero session={session} />

      {/* Features */}
      <Features />

      {/* How it works */}
      <HowItWorks />

      {/* Comparison */}
      <section
        id="compare"
        className="max-w-6xl mx-auto px-4 sm:px-6 py-16 border-t border-border"
      >
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink mb-10">
          JDReady vs. reviewing it yourself
        </h2>
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="grid grid-cols-[2fr_1fr_1fr] bg-background text-sm font-semibold text-ink">
            <div className="px-5 py-3">Feature</div>
            <div className="px-5 py-3 text-center">JDReady</div>
            <div className="px-5 py-3 text-center">Manual review</div>
          </div>
          {comparisonRows.map((row, i) => (
            <div
              key={row.label}
              className={`grid grid-cols-[2fr_1fr_1fr] text-sm items-center ${i % 2 === 1 ? "bg-surface" : ""}`}
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
      <section
        id="faq"
        className="max-w-3xl mx-auto px-4 sm:px-6 py-16 border-t border-border"
      >
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
          href={session ? "/dashboard" : "/signup"}
          className="inline-block rounded-md bg-ink text-surface text-sm font-medium px-6 py-3 hover:opacity-90 transition-opacity"
        >
          {session ? "Go to dashboard" : "Get started free"}
        </Link>
      </section>

      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="md:col-span-1 sm:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="flex items-center justify-center h-7 w-7 rounded-md bg-ink text-surface">
                <FileCheck2 size={15} />
              </span>
              <span className="font-display text-lg font-bold text-ink tracking-tight">
                JDReady
              </span>
            </div>
            <p className="text-sm text-ink-secondary max-w-xs leading-relaxed">
              Match your resume to any job description, close the gaps, and
              apply with confidence.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-ink-secondary mb-3">
              Product
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#features"
                  className="text-ink-secondary hover:text-ink"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="text-ink-secondary hover:text-ink"
                >
                  How it works
                </a>
              </li>
              <li>
                <a
                  href="#compare"
                  className="text-ink-secondary hover:text-ink"
                >
                  Comparison
                </a>
              </li>
              <li>
                <a href="#faq" className="text-ink-secondary hover:text-ink">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-ink-secondary mb-3">
              Account
            </h4>
            <ul className="space-y-2 text-sm">
              {session ? (
                <>
                  <li>
                    <Link
                      href="/dashboard"
                      className="text-ink-secondary hover:text-ink"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/account"
                      className="text-ink-secondary hover:text-ink"
                    >
                      Account settings
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      href="/signup"
                      className="text-ink-secondary hover:text-ink"
                    >
                      Sign up
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/login"
                      className="text-ink-secondary hover:text-ink"
                    >
                      Log in
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-ink-secondary mb-3">
              Tools
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/dashboard"
                  className="text-ink-secondary hover:text-ink"
                >
                  Analyze resume
                </Link>
              </li>
              <li>
                <Link
                  href="/compare"
                  className="text-ink-secondary hover:text-ink"
                >
                  Compare jobs
                </Link>
              </li>
              <li>
                <Link
                  href="/builder"
                  className="text-ink-secondary hover:text-ink"
                >
                  Resume builder
                </Link>
              </li>
              <li>
                <Link
                  href="/cover-letter"
                  className="text-ink-secondary hover:text-ink"
                >
                  Cover letters
                </Link>
              </li>
              <li>
                <Link
                  href="/interview-prep"
                  className="text-ink-secondary hover:text-ink"
                >
                  Interview prep
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 text-sm text-ink-secondary">
            © {new Date().getFullYear()} JDReady.
          </div>
        </div>
      </footer>
    </div>
  );
}
