"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function AppError({ error, reset }) {
  useEffect(() => {
    console.error("Unhandled error in authenticated app:", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] w-full flex-col items-center justify-center gap-6 bg-background px-4 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-danger/30 bg-surface text-danger">
        <AlertTriangle size={28} />
      </span>

      <div className="space-y-2">
        <h1 className="font-display text-2xl font-semibold text-ink">
          Something went wrong
        </h1>
        <p className="max-w-md text-sm leading-6 text-ink-secondary">
          That&apos;s on us, not you. Your data is safe — give it another try,
          or head back to your dashboard.
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
          href="/dashboard"
          className="text-sm font-medium text-ink-secondary underline hover:text-ink"
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}
