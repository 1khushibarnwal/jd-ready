"use client";

import { motion } from "motion/react";

export default function FadeIn({
  children,
  delay = 0,
  duration = 0.6,
  y = 25,
  className = "",
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.2,
      }}
      transition={{
        delay,
        duration,
        ease: "easeOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
