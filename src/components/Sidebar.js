"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Menu,
  X,
  Sun,
  Moon,
  FileSearch,
  Layers,
  FileText,
  Mail,
  LogOut,
} from "lucide-react";
import { logoutAction } from "@/app/actions";

// Tells us whether we're past hydration yet, without the setState-in-effect
// anti-pattern — this is exactly what useSyncExternalStore is designed for.
function useMounted() {
  return useSyncExternalStore(
    () => () => {}, // no-op subscribe: this value never changes after mount
    () => true, // client snapshot
    () => false, // server snapshot
  );
}

function scoreColor(score) {
  if (score >= 75) return "text-success";
  if (score >= 50) return "text-warning";
  return "text-danger";
}

export default function Sidebar({ user, recentAnalyses }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  const navItems = [
    { href: "/dashboard", label: "Analyze resume", icon: FileSearch },
    { href: "/compare", label: "Compare multiple JDs", icon: Layers },
    { href: "/builder", label: "Build a resume", icon: FileText },
    { href: "/cover-letter", label: "Cover letter", icon: Mail },
  ];

  return (
    <>
      {/* Mobile top bar with menu toggle */}
      <div className="md:hidden flex items-center justify-between border-b border-border bg-surface px-4 py-3">
        <span className="font-display font-semibold text-lg text-ink">
          JDReady
        </span>
        <button
          onClick={() => setMobileOpen(true)}
          className="text-ink-secondary hover:text-ink"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-50
          w-72 shrink-0 border-r border-border bg-surface
          flex flex-col h-screen md:h-auto
          transform transition-transform md:transform-none
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        `}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <Link
            href="/dashboard"
            className="font-display font-semibold text-lg text-ink tracking-tight"
          >
            JDReady
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden text-ink-secondary hover:text-ink"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="p-3 space-y-1 border-b border-border">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-ink text-surface"
                    : "text-ink hover:bg-background"
                }`}
              >
                <Icon size={16} className="shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex-1 overflow-y-auto p-3">
          <div className="flex items-center justify-between px-1 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-ink-secondary">
              Recent analyses
            </span>
            {recentAnalyses.length > 0 && (
              <Link
                href="/history"
                onClick={() => setMobileOpen(false)}
                className="text-xs font-medium text-ink-secondary hover:text-ink underline"
              >
                View all
              </Link>
            )}
          </div>

          {recentAnalyses.length === 0 ? (
            <p className="text-xs text-ink-secondary px-1">No analyses yet</p>
          ) : (
            <ul className="space-y-1">
              {recentAnalyses.map((analysis) => {
                const href = `/history/${analysis._id}`;
                const isActive = pathname === href;
                return (
                  <li key={analysis._id}>
                    <Link
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between gap-2 rounded-md px-2 py-2 text-sm transition-colors ${
                        isActive ? "bg-background" : "hover:bg-background"
                      }`}
                    >
                      <span className="truncate text-ink">
                        {analysis.label ||
                          analysis.resumeFilename ||
                          "Deleted resume"}
                      </span>
                      <span
                        className={`font-mono text-xs font-semibold shrink-0 ${scoreColor(analysis.matchScore)}`}
                      >
                        {analysis.matchScore}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="p-3 border-t border-border space-y-3">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-sm font-medium text-ink truncate">
                {user.name}
              </p>
              <p className="text-xs text-ink-secondary truncate">
                {user.email}
              </p>
            </div>
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="shrink-0 rounded-md p-2 text-ink-secondary hover:text-ink hover:bg-background transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            )}
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex items-center gap-1.5 text-xs font-medium text-ink-secondary hover:text-ink"
            >
              <LogOut size={14} />
              Log out
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
