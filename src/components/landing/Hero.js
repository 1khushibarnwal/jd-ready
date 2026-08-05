"use client";

import Link from "next/link";
import { motion } from "motion/react";
import Counter from "@/components/motion/Counter";

export default function Hero({ session }) {
  return (
    <section className="relative overflow-hidden">
      {/* Background Glow */}

      <motion.div
        animate={{
          x: [0, 40, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl"
      />

      <motion.div
        animate={{
          x: [0, -50, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-violet-400/10 blur-3xl"
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        {/* LEFT */}

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.18,
              },
            },
          }}
        >
          <motion.h1
            variants={{
              hidden: {
                opacity: 0,
                y: 25,
              },
              visible: {
                opacity: 1,
                y: 0,
              },
            }}
            transition={{
              duration: 0.6,
            }}
            className="font-display text-5xl font-bold leading-tight"
          >
            Know exactly why your resume is not landing interviews.
          </motion.h1>

          <motion.p
            variants={{
              hidden: {
                opacity: 0,
                y: 25,
              },
              visible: {
                opacity: 1,
                y: 0,
              },
            }}
            transition={{
              duration: 0.6,
            }}
            className="mt-6 text-lg text-ink-secondary leading-relaxed"
          >
            JDReady matches your resume against any job description, shows what
            is missing, and helps you fix it.
          </motion.p>

          <motion.div
            variants={{
              hidden: {
                opacity: 0,
                y: 25,
              },
              visible: {
                opacity: 1,
                y: 0,
              },
            }}
            className="mt-8 flex flex-wrap gap-4"
          >
            {session ? (
              <motion.div
                whileHover={{
                  scale: 1.05,
                }}
                whileTap={{
                  scale: 0.95,
                }}
              >
                <Link
                  href="/dashboard"
                  className="rounded-md bg-ink text-surface px-6 py-3"
                >
                  Dashboard
                </Link>
              </motion.div>
            ) : (
              <>
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
                    className="rounded-md bg-ink text-surface px-6 py-3"
                  >
                    Get Started Free
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
                    href="/login"
                    className="rounded-md border border-border px-6 py-3"
                  >
                    Log In
                  </Link>
                </motion.div>
              </>
            )}
          </motion.div>
        </motion.div>

        {/* SCORE CARD */}

        <motion.div
          initial={{
            opacity: 0,
            x: 60,
            rotate: -3,
          }}
          animate={{
            opacity: 1,
            x: 0,
            rotate: 0,
          }}
          whileHover={{
            y: -8,
            rotate: 1,
          }}
          transition={{
            type: "spring",
            stiffness: 120,
          }}
          className="bg-surface border border-border rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="font-mono text-5xl font-bold text-success">
              <Counter value={82} />
            </div>

            <div>
              <p className="text-sm text-ink-secondary">/100 Match Score</p>

              <p className="mt-2 text-ink">
                Strong overlap with a few missing skills.
              </p>
            </div>
          </div>

          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              delay: 1.3,
            }}
            className="grid grid-cols-2 gap-5 mt-6 text-sm"
          >
            <div>
              <p className="font-semibold text-success">Matched</p>

              <p className="text-ink-secondary">React · Node.js · MongoDB</p>
            </div>

            <div>
              <p className="font-semibold text-danger">Missing</p>

              <p className="text-ink-secondary">GraphQL · Docker</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
