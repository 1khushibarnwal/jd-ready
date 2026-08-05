"use client";

import { motion } from "motion/react";
import AnimatedCard from "@/components/motion/AnimatedCard";
import { fadeUp, staggerContainer } from "@/components/motion/variants";
import { features } from "@/data/landing";

export default function Features() {
  return (
    <section
      id="features"
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
          className="font-display text-2xl sm:text-3xl font-bold text-ink mb-2"
        >
          Everything you need to apply with confidence
        </motion.h2>

        <motion.p
          variants={fadeUp}
          className="text-ink-secondary mb-10 max-w-2xl"
        >
          One place to analyze, build, tailor, and practice for your next
          application.
        </motion.p>

        <motion.div
          variants={staggerContainer}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <motion.div key={feature.title} variants={fadeUp}>
                <AnimatedCard className="border border-border rounded-lg p-5 bg-surface h-full shadow-sm hover:shadow-lg transition-shadow">
                  <motion.div
                    whileHover={{
                      rotate: 8,
                      scale: 1.1,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                    }}
                    className="h-9 w-9 rounded-md bg-background flex items-center justify-center mb-4 text-ink"
                  >
                    <Icon size={18} />
                  </motion.div>

                  <h3 className="font-semibold text-ink mb-2">
                    {feature.title}
                  </h3>

                  <p className="text-sm text-ink-secondary leading-relaxed">
                    {feature.description}
                  </p>
                </AnimatedCard>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}
