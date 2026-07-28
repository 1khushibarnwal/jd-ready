"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/actions";

function scoreColor(score) {
  if (score >= 75) return "text-green-600";
  if (score >= 50) return "text-amber-600";
  return "text-red-600";
}

export default function Sidebar({ user, recentAnalyses }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { href: "/dashboard", label: "Analyze resume" },
    { href: "/builder", label: "Build a resume" },
    { href: "/cover-letter", label: "Cover letter" },
  ];

  return (
    <>
      {/* Mobile top bar with menu toggle */}
      <div className="md:hidden flex items-center justify-between border-b border-neutral-200 px-4 py-3">
        <span className="font-semibold">JDReady</span>
        <button
          onClick={() => setMobileOpen(true)}
          className="text-sm font-medium text-neutral-600 underline"
        >
          Menu
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
          w-72 shrink-0 border-r border-neutral-200 bg-white
          flex flex-col h-screen md:h-auto
          transform transition-transform md:transform-none
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        `}
      >
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="font-semibold text-lg tracking-tight"
          >
            JDReady
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden text-sm text-neutral-500"
          >
            ✕
          </button>
        </div>

        <nav className="p-3 space-y-1 border-b border-neutral-200">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                pathname === item.href
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex-1 overflow-y-auto p-3">
          <div className="flex items-center justify-between px-1 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
              Recent analyses
            </span>
            {recentAnalyses.length > 0 && (
              <Link
                href="/history"
                onClick={() => setMobileOpen(false)}
                className="text-xs font-medium text-neutral-500 hover:text-neutral-900 underline"
              >
                View all
              </Link>
            )}
          </div>

          {recentAnalyses.length === 0 ? (
            <p className="text-xs text-neutral-400 px-1">No analyses yet</p>
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
                        isActive ? "bg-neutral-100" : "hover:bg-neutral-50"
                      }`}
                    >
                      <span className="truncate text-neutral-700">
                        {analysis.resumeFilename || "Deleted resume"}
                      </span>
                      <span
                        className={`text-xs font-semibold shrink-0 ${scoreColor(analysis.matchScore)}`}
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

        <div className="p-3 border-t border-neutral-200">
          <p className="text-sm font-medium text-neutral-900 truncate">
            {user.name}
          </p>
          <p className="text-xs text-neutral-500 truncate mb-2">{user.email}</p>
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-xs font-medium text-neutral-600 hover:text-neutral-900 underline"
            >
              Log out
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
