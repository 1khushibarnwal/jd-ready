import Link from "next/link";

export default function Home() {
  return (
    <div className="flex-1 flex items-center justify-center px-4 bg-background">
      <div className="max-w-lg text-center">
        <h1 className="font-display text-4xl font-semibold tracking-tight mb-4 text-ink">
          JDReady
        </h1>
        <p className="text-ink-secondary mb-8">
          Match your resume against any job description, close the gaps, and
          download an ATS-friendly version — all in one place.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/signup"
            className="rounded-md bg-ink text-surface text-sm font-medium px-5 py-2.5 hover:opacity-90 transition-opacity"
          >
            Get started
          </Link>
          <Link
            href="/login"
            className="rounded-md border border-border text-ink text-sm font-medium px-5 py-2.5 hover:bg-surface transition-colors"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
