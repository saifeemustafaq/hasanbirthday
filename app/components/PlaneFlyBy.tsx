"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Plane } from "lucide-react";

const FF_KEY = "ff_flight_animation";

// ─── Bezier helpers ───────────────────────────────────────────────────────────

function bPt(t: number, p0: number, p1: number, p2: number, p3: number) {
  const u = 1 - t;
  return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
}

function bTan(t: number, p0: number, p1: number, p2: number, p3: number) {
  const u = 1 - t;
  return 3 * u * u * (p1 - p0) + 6 * u * t * (p2 - p1) + 3 * t * t * (p3 - p2);
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

// ─── Plane state ─────────────────────────────────────────────────────────────

interface PlaneState {
  p0x: number; p0y: number;
  p1x: number; p1y: number;
  p2x: number; p2y: number;
  p3x: number; p3y: number;
  t: number;
  speed: number;
}

// Spawn a plane entering from left or bottom edge,
// curving toward the top or right edge via an S-bend.
function spawnPlane(w: number, h: number): PlaneState {
  const fromLeft = Math.random() < 0.6;
  const p0x = fromLeft ? -30 : rand(w * 0.05, w * 0.85);
  const p0y = fromLeft ? rand(h * 0.05, h * 0.85) : h + 30;

  const toTop = fromLeft ? Math.random() < 0.6 : true;
  const p3x = toTop ? rand(w * 0.1, w * 0.95) : w + 30;
  const p3y = toTop ? -30 : rand(h * 0.04, h * 0.55);

  // Control points on opposite sides of the direct line → natural S-curve
  const dx = p3x - p0x;
  const dy = p3y - p0y;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const bend = rand(w * 0.14, w * 0.28);
  const perpX = (-dy / len) * bend;
  const perpY = ( dx / len) * bend;

  return {
    p0x, p0y,
    p1x: p0x + dx * 0.35 + perpX, p1y: p0y + dy * 0.35 + perpY,
    p2x: p0x + dx * 0.65 - perpX, p2y: p0y + dy * 0.65 - perpY,
    p3x, p3y,
    t: 0,
    speed: rand(0.00008, 0.00016), // t-units per ms (~10–20 s crossing)
  };
}

const NUM_PLANES = 4;

export default function PlaneFlyBy() {
  const reduced = useReducedMotion();

  // Read feature flag from localStorage (default ON if not explicitly disabled)
  const [flagEnabled, setFlagEnabled] = useState(true);
  useEffect(() => {
    const stored = localStorage.getItem(FF_KEY);
    setFlagEnabled(stored === null || stored === "1");
  }, []);

  const wrapperRefs = useRef<(HTMLDivElement | null)[]>([]);
  const planesRef   = useRef<PlaneState[]>([]);

  useEffect(() => {
    if (reduced) return;

    const vw = () => window.innerWidth;
    const vh = () => window.innerHeight;

    // Spawn planes staggered along their paths so the screen isn't empty
    planesRef.current = Array.from({ length: NUM_PLANES }, (_, i) => {
      const p = spawnPlane(vw(), vh());
      p.t = (i / NUM_PLANES) * 0.75;
      return p;
    });

    let last = performance.now();
    let raf: number;

    function tick(now: number) {
      const dt = Math.min(now - last, 50); // cap so a tab-switch doesn't teleport planes
      last = now;

      planesRef.current.forEach((p, i) => {
        const el = wrapperRefs.current[i];
        if (!el) return;

        p.t = Math.min(1, p.t + p.speed * dt);

        const x  = bPt(p.t, p.p0x, p.p1x, p.p2x, p.p3x);
        const y  = bPt(p.t, p.p0y, p.p1y, p.p2y, p.p3y);
        const tx = bTan(p.t, p.p0x, p.p1x, p.p2x, p.p3x);
        const ty = bTan(p.t, p.p0y, p.p1y, p.p2y, p.p3y);

        // atan2 gives angle from East (right); Lucide's Plane icon points NE
        // by default (≈ –45° from horizontal), so we add 45° to compensate.
        const angle = Math.atan2(ty, tx) * (180 / Math.PI) + 45;

        // translate(-50%,-50%) centres the icon on (x, y)
        el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${angle}deg)`;

        if (p.t >= 1) planesRef.current[i] = spawnPlane(vw(), vh());
      });

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  if (reduced || !flagEnabled) return null;

  return (
    <>
      {Array.from({ length: NUM_PLANES }, (_, i) => (
        <div
          key={i}
          ref={(el) => { wrapperRefs.current[i] = el; }}
          aria-hidden="true"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 5,
            pointerEvents: "none",
            willChange: "transform",
            lineHeight: 0,
            filter: "drop-shadow(0 0 5px rgba(245,158,11,0.7))",
          }}
        >
          <Plane size={22} color="#f59e0b" strokeWidth={1.5} />
        </div>
      ))}
    </>
  );
}
