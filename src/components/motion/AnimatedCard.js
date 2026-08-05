"use client";

import { motion } from "motion/react";

export default function AnimatedCard({ children, className = "" }) {
  return (
    <motion.div
      className={className}
      whileHover={{
        y: -8,
        scale: 1.02,
      }}
      whileTap={{
        scale: 0.98,
      }}
      transition={{
        type: "spring",
        stiffness: 250,
        damping: 20,
      }}
    >
      {children}
    </motion.div>
  );
}
