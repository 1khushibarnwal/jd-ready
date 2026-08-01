"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { LogOut, ChevronDown, LayoutDashboard, Settings } from "lucide-react";
import { logoutAction } from "@/app/actions";

export default function LandingUserMenu({ user }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

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
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setMenuOpen((v) => !v)}
        className="flex items-center gap-2 rounded-md pl-1 pr-2 py-1 hover:bg-background transition-colors"
      >
        <span className="flex items-center justify-center h-8 w-8 rounded-full bg-accent text-accent-foreground text-sm font-semibold">
          {initial}
        </span>
        <ChevronDown size={14} className="text-ink-secondary" />
      </button>

      {menuOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md border border-border bg-surface shadow-lg py-1 z-50">
          <div className="px-3 py-2 border-b border-border">
            <p className="text-sm font-medium text-ink truncate">{user.name}</p>
            <p className="text-xs text-ink-secondary truncate">{user.email}</p>
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-ink hover:bg-background transition-colors"
          >
            <LayoutDashboard size={15} />
            Go to dashboard
          </Link>
          <Link
            href="/account"
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
  );
}
