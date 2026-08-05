"use client";

import { animate, motion, useMotionValue, useTransform } from "motion/react";

import { useEffect } from "react";

export default function Counter({ value, className = "" }) {
  const count = useMotionValue(0);

  const rounded = useTransform(() => Math.round(count.get()));

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 1.4,
    });

    return () => controls.stop();
  }, [value]);

  return <motion.span className={className}>{rounded}</motion.span>;
}
