"use client";

import { motion } from "motion/react";

import Counter from "@/components/animations/Counter";

import { CheckCircle2, XCircle, BrainCircuit } from "lucide-react";

export default function AnalysisCard() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.95,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      whileHover={{
        y: -6,
      }}
      transition={{
        duration: 0.5,
      }}
      className="rounded-2xl border border-border bg-surface p-6 shadow-xl"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-ink-secondary">Match Score</p>

          <Counter
            value={82}
            className="font-mono text-5xl font-bold text-success"
          />
        </div>

        <BrainCircuit className="text-accent" size={34} />
      </div>

      <div className="mt-8 grid grid-cols-2 gap-6">
        <div>
          <p className="mb-3 font-semibold text-success">Matched</p>

          <div className="space-y-3">
            {["React", "Node.js", "MongoDB", "Express"].map((skill) => (
              <motion.div
                key={skill}
                initial={{
                  opacity: 0,
                  x: -20,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: 0.3,
                }}
                className="flex items-center gap-2"
              >
                <CheckCircle2 size={16} className="text-success" />

                <span className="text-sm">{skill}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-3 font-semibold text-danger">Missing</p>

          <div className="space-y-3">
            {["Docker", "GraphQL"].map((skill) => (
              <motion.div
                key={skill}
                initial={{
                  opacity: 0,
                  x: 20,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: 0.6,
                }}
                className="flex items-center gap-2"
              >
                <XCircle size={16} className="text-danger" />

                <span className="text-sm">{skill}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <motion.div
        initial={{
          width: 0,
        }}
        animate={{
          width: "100%",
        }}
        transition={{
          duration: 1.5,
        }}
        className="mt-8 h-2 rounded-full bg-success"
      />
    </motion.div>
  );
}
