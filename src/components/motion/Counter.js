"use client";

import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect } from "react";

export default function Counter({ value }) {
  const count = useMotionValue(0);

  const rounded = useTransform(() => Math.round(count.get()));

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 1.5,
    });

    return () => controls.stop();
  }, [value]);

  return <motion.span>{rounded}</motion.span>;
}
