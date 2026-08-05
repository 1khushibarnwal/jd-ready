"use client";

import { motion } from "motion/react";
import { steps } from "@/data/landing";
import { fadeUp, staggerContainer } from "@/components/motion/variants";

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="max-w-6xl mx-auto px-4 sm:px-6 py-16 border-t border-border"
    >
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.15,
        }}
      >
        <motion.h2
          variants={fadeUp}
          className="font-display text-2xl sm:text-3xl font-bold text-ink mb-10"
        >
          How it works
        </motion.h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              variants={fadeUp}
              whileHover={{
                y: -6,
              }}
            >
              <motion.div
                initial={{
                  scale: 0,
                }}
                whileInView={{
                  scale: 1,
                }}
                transition={{
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 250,
                }}
                className="font-mono text-sm font-semibold text-accent mb-2"
              >
                {String(index + 1).padStart(2, "0")}
              </motion.div>

              <h3 className="font-semibold text-ink mb-2">{step.title}</h3>

              <p className="text-sm text-ink-secondary leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
