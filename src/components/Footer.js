import Link from "next/link";
import { FileCheck2 } from "lucide-react";

export default function Footer() {
  return (
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
            Match your resume to any job description, close the gaps, and apply
            with confidence.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-ink-secondary mb-3">
            Product
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#features" className="text-ink-secondary hover:text-ink">
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
              <a href="#compare" className="text-ink-secondary hover:text-ink">
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
            <li>
              <Link
                href="/signup"
                className="text-ink-secondary hover:text-ink"
              >
                Sign up
              </Link>
            </li>
            <li>
              <Link href="/login" className="text-ink-secondary hover:text-ink">
                Log in
              </Link>
            </li>
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
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 text-sm text-ink-secondary">
          © {new Date().getFullYear()} JDReady.
        </div>
      </div>
    </footer>
  );
}
