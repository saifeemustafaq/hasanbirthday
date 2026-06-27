"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

const FF_KEY = "ff_star_field";

interface Star {
  x: number;
  y: number;
  r: number;          // radius px
  phase: number;      // initial sine phase 0–2π
  speed: number;      // twinkling speed rad/s
  minOp: number;      // minimum opacity (dim point)
  maxOp: number;      // peak opacity
}

function buildStars(w: number, h: number): Star[] {
  return Array.from({ length: 140 }, () => {
    const big = Math.random() < 0.12; // ~12% are slightly larger / brighter
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      r: big ? 1.2 + Math.random() * 0.8 : 0.4 + Math.random() * 0.7,
      phase: Math.random() * Math.PI * 2,
      speed: big
        ? 1.2 + Math.random() * 2.0   // big stars twinkle slower & more
        : 2.0 + Math.random() * 5.0,  // small stars can be fast or slow
      minOp: big ? 0.2 : 0.05,
      maxOp: big ? 1.0 : 0.6,
    };
  });
}

export default function StarField() {
  const reduced = useReducedMotion();
  const [flagEnabled, setFlagEnabled] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem(FF_KEY);
    setFlagEnabled(stored === null || stored === "1");
  }, []);

  useEffect(() => {
    if (reduced || !flagEnabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let stars: Star[] = [];

    function resize() {
      if (!canvas) return;
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      stars = buildStars(canvas.width, canvas.height);
    }
    resize();
    window.addEventListener("resize", resize);

    const t0 = performance.now();
    let raf: number;

    function tick(now: number) {
      const t = (now - t0) / 1000;
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      for (const s of stars) {
        // Smooth sine-based twinkle: opacity oscillates between minOp and maxOp
        const wave = 0.5 + 0.5 * Math.sin(t * s.speed + s.phase);
        const opacity = s.minOp + (s.maxOp - s.minOp) * wave;

        ctx!.beginPath();
        ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(255,255,255,${opacity.toFixed(3)})`;
        ctx!.fill();
      }

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [reduced, flagEnabled]);

  if (reduced || !flagEnabled) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        /*
         * z-index 1: above the static 8-dot body::before stars (z=0)
         * but below the boarding-pass card wrapper (z=10), so the white
         * card background naturally masks the stars behind it.
         */
        zIndex: 1,
        pointerEvents: "none",
      }}
    />
  );
}
