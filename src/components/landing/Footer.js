import Link from "next/link";
import { FileCheck2 } from "lucide-react";
import { FaGithub as Github } from "react-icons/fa";

export default function Footer({ session }) {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink text-surface">
              <FileCheck2 size={16} />
            </span>

            <span className="font-display text-lg font-bold">JDReady</span>
          </div>

          <p className="text-sm leading-7 text-ink-secondary">
            Helping developers optimize resumes, prepare for interviews and land
            better jobs.
          </p>
        </div>

        <div>
          <h3 className="mb-4 font-semibold">Product</h3>

          <ul className="space-y-3 text-sm">
            <li>
              <a href="#features">Features</a>
            </li>

            <li>
              <a href="#how-it-works">How it Works</a>
            </li>

            <li>
              <a href="#compare">Comparison</a>
            </li>

            <li>
              <a href="#faq">FAQ</a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-semibold">Account</h3>

          <ul className="space-y-3 text-sm">
            {session ? (
              <>
                <li>
                  <Link href="/dashboard">Dashboard</Link>
                </li>

                <li>
                  <Link href="/account">Account</Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/signup">Sign Up</Link>
                </li>

                <li>
                  <Link href="/login">Log In</Link>
                </li>
              </>
            )}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-semibold">Tools</h3>

          <ul className="space-y-3 text-sm">
            <li>
              <Link href="/dashboard">Resume Analysis</Link>
            </li>

            <li>
              <Link href="/compare">Compare against multiple JDs</Link>
            </li>

            <li>
              <Link href="/builder">Resume Builder</Link>
            </li>

            <li>
              <Link href="/cover-letter">Cover Letters</Link>
            </li>

            <li>
              <Link href="/interview-prep">Interview Prep</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-5 text-sm text-ink-secondary sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} JDReady</span>

          <div className="flex items-center gap-5">
            <Link href="/about" className="hover:text-ink">
              About
            </Link>
            <Link href="/privacy" className="hover:text-ink">
              Privacy
            </Link>

            <a
              href="https://github.com/1khushibarnwal/jd-ready"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="JDReady on GitHub"
              title="JDReady on GitHub"
              className="hover:text-ink"
            >
              <Github size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
