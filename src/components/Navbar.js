"use client";

import { useState, useRef, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  FileCheck2,
  FileSearch,
  Layers,
  FileText,
  Mail,
  History,
  Sun,
  Moon,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Settings,
} from "lucide-react";
import { logoutAction } from "@/app/actions";

function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

const navItems = [
  { href: "/dashboard", label: "Analyze", icon: FileSearch },
  { href: "/compare", label: "Compare", icon: Layers },
  { href: "/builder", label: "Builder", icon: FileText },
  { href: "/cover-letter", label: "Cover letter", icon: Mail },
  { href: "/history", label: "History", icon: History },
];

export default function Navbar({ user }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close the user menu on outside click.
  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const initial = user.name?.[0]?.toUpperCase() || "?";

  return (
    <header className="border-b border-border bg-surface">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo — the first thing that should catch the eye */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="flex items-center justify-center h-8 w-8 rounded-md bg-ink text-surface">
            <FileCheck2 size={18} />
          </span>
          <span className="font-display text-xl font-bold text-ink tracking-tight">
            JDReady
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-background text-ink"
                    : "text-ink-secondary hover:text-ink"
                }`}
              >
                <Icon size={15} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side: theme toggle + user menu (desktop), hamburger (mobile) */}
        <div className="flex items-center gap-2">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hidden sm:flex rounded-md p-2 text-ink-secondary hover:text-ink hover:bg-background transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          )}

          {/* User menu — desktop */}
          <div className="hidden md:block relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 rounded-md pl-1 pr-2 py-1 hover:bg-background transition-colors"
            >
              <span className="flex items-center justify-center h-7 w-7 rounded-full bg-accent text-accent-foreground text-sm font-semibold">
                {initial}
              </span>
              <ChevronDown size={14} className="text-ink-secondary" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-md border border-border bg-surface shadow-lg py-1 z-50">
                <div className="px-3 py-2 border-b border-border">
                  <p className="text-sm font-medium text-ink truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-ink-secondary truncate">
                    {user.email}
                  </p>
                </div>
                <Link
                  href="/account"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-ink hover:bg-background transition-colors"
                >
                  <Settings size={15} />
                  Account settings
                </Link>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-danger hover:bg-background transition-colors"
                  >
                    <LogOut size={15} />
                    Log out
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Hamburger — mobile */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden rounded-md p-2 text-ink-secondary hover:text-ink"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-surface px-4 py-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium ${
                  isActive ? "bg-background text-ink" : "text-ink-secondary"
                }`}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}

          <div className="border-t border-border mt-2 pt-2">
            <div className="px-3 py-1.5">
              <p className="text-sm font-medium text-ink truncate">
                {user.name}
              </p>
              <p className="text-xs text-ink-secondary truncate">
                {user.email}
              </p>
            </div>

            <Link
              href="/account"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium text-ink-secondary"
            >
              <Settings size={16} />
              Account settings
            </Link>

            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-full flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium text-ink-secondary"
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                {theme === "dark" ? "Light mode" : "Dark mode"}
              </button>
            )}

            <form action={logoutAction}>
              <button
                type="submit"
                className="w-full flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium text-danger *:hover:bg-background transition-colors *:hover:text-danger cursor-pointer *:focus:outline-none *:focus:ring-2 *:focus:ring-ink"
              >
                <LogOut size={16} />
                Log out
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
