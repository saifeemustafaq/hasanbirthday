"use client";

import { motion, useReducedMotion } from "motion/react";

// Two planes hug the top of the viewport, two hug the bottom —
// both safe zones clear the centred boarding-pass card on any screen size.
// Different durations + delays keep them visually staggered at all times.
const PLANES: {
  top?: string;
  bottom?: string;
  duration: number;
  delay: number;
  size: number;
  opacity: number;
}[] = [
  { top: "6px",    duration: 4.5, delay: 0.0, size: 19, opacity: 0.80 },
  { top: "36px",   duration: 7.0, delay: 2.6, size: 15, opacity: 0.55 },
  { bottom: "34px", duration: 6.0, delay: 1.3, size: 17, opacity: 0.70 },
  { bottom: "6px",  duration: 9.0, delay: 4.0, size: 14, opacity: 0.50 },
];

export default function PlaneFlyBy() {
  const reduced = useReducedMotion();
  if (reduced) return null;

  return (
    <>
      {PLANES.map((plane, i) => (
        <motion.div
          key={i}
          aria-hidden="true"
          className="fixed z-20 pointer-events-none select-none"
          style={{
            top: plane.top,
            bottom: plane.bottom,
            fontSize: plane.size,
            opacity: plane.opacity,
            color: "#f59e0b",
            filter:
              "drop-shadow(-6px 0 5px rgba(245,158,11,0.7)) drop-shadow(-14px 0 10px rgba(245,158,11,0.3))",
          }}
          initial={{ x: -44 }}
          animate={{ x: "calc(100vw + 44px)" }}
          transition={{
            duration: plane.duration,
            delay: plane.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          ✈
        </motion.div>
      ))}
    </>
  );
}
