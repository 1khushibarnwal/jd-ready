import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { auth } from "@/auth";
import GoBackButton from "@/components/GoBackButton";

export const metadata = {
  title: "Page not found — JDReady",
};

export default async function NotFound() {
  const session = await auth();
  const homeHref = session ? "/dashboard" : "/";

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-6 bg-background px-4 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-surface text-ink-secondary">
        <FileQuestion size={28} />
      </span>

      <div className="space-y-2">
        <h1 className="font-display text-2xl font-semibold text-ink">
          We can&apos;t find that page
        </h1>
        <p className="max-w-md text-sm leading-6 text-ink-secondary">
          The page you&apos;re looking for doesn&apos;t exist, may have moved,
          or the link might be a little off. Nothing to worry about — let&apos;s
          get you back on track.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href={homeHref}
          className="rounded-md bg-ink px-5 py-2.5 text-sm font-medium text-surface transition hover:opacity-90"
        >
          {session ? "Go to dashboard" : "Go to homepage"}
        </Link>
        <GoBackButton />
        <a
          href="https://github.com/1khushibarnwal/jd-ready/issues"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-ink-secondary underline hover:text-ink"
        >
          Report a broken link
        </a>
      </div>
    </div>
  );
}
