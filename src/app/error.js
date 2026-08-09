"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Swap this for a real error-reporting service (e.g. Sentry) when you
    // have one wired up — for now this at least keeps it out of silence.
    console.error("Unhandled route error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-6 bg-background px-4 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-danger/30 bg-surface text-danger">
        <AlertTriangle size={28} />
      </span>

      <div className="space-y-2">
        <h1 className="font-display text-2xl font-semibold text-ink">
          Something went wrong
        </h1>
        <p className="max-w-md text-sm leading-6 text-ink-secondary">
          That&apos;s on us, not you. Give it another try — if it keeps
          happening, let us know and we&apos;ll take a look.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={reset}
          className="rounded-md bg-ink px-5 py-2.5 text-sm font-medium text-surface transition hover:opacity-90"
        >
          Try again
        </button>
        <Link
          href="/"
          className="text-sm font-medium text-ink-secondary underline hover:text-ink"
        >
          Go to homepage
        </Link>
        <a
          href="https://github.com/1khushibarnwal/jd-ready/issues"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-ink-secondary underline hover:text-ink"
        >
          Report this
        </a>
      </div>
    </div>
  );
}
