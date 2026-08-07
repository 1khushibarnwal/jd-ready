import Link from "next/link";

import { CircleHelp, FileCheck2 } from "lucide-react";

import LandingUserMenu from "@/components/LandingUserMenu";

export default function Header({ session }) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink text-surface shadow-sm">
            <FileCheck2 size={18} />
          </span>

          <span className="font-display text-xl font-bold tracking-tight text-ink">
            JDReady
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {/* How it works */}
          <Link
            href="/guide"
            className="rounded-md p-2 text-ink-secondary transition-colors hover:bg-surface hover:text-ink"
            aria-label="How JDReady works"
            title="How JDReady works"
          >
            <CircleHelp size={18} />
          </Link>

          {session ? (
            <LandingUserMenu
              user={{
                name: session.user.name,
                email: session.user.email,
              }}
            />
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-ink-secondary transition-colors hover:text-ink"
              >
                Log in
              </Link>

              <Link
                href="/signup"
                className="rounded-lg bg-ink px-5 py-2 text-sm font-medium text-surface transition hover:opacity-90"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
