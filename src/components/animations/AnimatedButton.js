"use client";

import { motion } from "motion/react";

export default function AnimatedButton({ children, className = "" }) {
  return (
    <motion.div
      whileHover={{
        scale: 1.04,
      }}
      whileTap={{
        scale: 0.96,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 18,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
