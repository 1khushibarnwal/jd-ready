"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { FileCheck2 } from "lucide-react";
import LandingUserMenu from "@/components/LandingUserMenu";

export default function Header({ session }) {
  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.6,
      }}
      className="border-b border-border bg-surface backdrop-blur"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <motion.div
          className="flex items-center gap-2"
          whileHover={{
            scale: 1.03,
          }}
        >
          <span className="flex items-center justify-center h-8 w-8 rounded-md bg-ink text-surface">
            <FileCheck2 size={18} />
          </span>

          <span className="font-display text-xl font-bold tracking-tight">
            JDReady
          </span>
        </motion.div>

        <div className="flex items-center gap-3">
          {session ? (
            <LandingUserMenu
              user={{
                name: session.user.name,
                email: session.user.email,
              }}
            />
          ) : (
            <>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/login"
                  className="rounded-md px-4 py-2 text-sm font-medium text-ink-secondary hover:text-ink"
                >
                  Log in
                </Link>
              </motion.div>

              <motion.div
                whileHover={{
                  scale: 1.05,
                }}
                whileTap={{
                  scale: 0.95,
                }}
              >
                <Link
                  href="/signup"
                  className="rounded-md bg-ink text-surface px-4 py-2 text-sm font-medium"
                >
                  Get Started
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
}
