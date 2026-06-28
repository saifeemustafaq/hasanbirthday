"use client";

import { useState, useEffect, useRef } from "react";
import PlaneFlyBy from "./PlaneFlyBy";

interface BoardingPassProps {
  type: "winner" | "general";
  number?: number;
  emoji: string;
  headline: string;
  message: string;
}

const FUN_FACTS = [
  {
    emoji: "🍯",
    text: "Loves medicine syrups. Any syrup. Just hand him the spoon and he's already opening his mouth.",
  },
  {
    emoji: "🍼",
    text: "Favourite toy is a Rs.10 plastic drinking bottle. The crunching sound gets him every time. Every. Time.",
  },
  {
    emoji: "🛁",
    text: "Loves baths so much he'd be fine having three a day. Getting him out is the hard part.",
  },
  {
    emoji: "🎂",
    text: "Officially one whole year old and already has more personality than most adults in the room.",
  },
  {
    emoji: "🌍",
    text: "Making the world a brighter place, one giggle, one crinkle, and one very enthusiastic bath at a time.",
  },
];

export default function BoardingPass({
  type,
  number,
  emoji,
  headline,
  message,
}: BoardingPassProps) {
  const isWinner = type === "winner";
  const [flipped, setFlipped] = useState(false);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [loadingMsg, setLoadingMsg] = useState(0);
  const loadingTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const tapOrigin = useRef<{ x: number; y: number } | null>(null);

  const LOADING_MESSAGES = [
    "Checking the passenger manifest… ✈️",
    "Reserving your lucky seat on the flight…",
    "Stamping your boarding pass… almost there 🎟️",
  ];

  useEffect(() => {
    if (submitting) {
      setLoadingMsg(0);
      loadingTimer.current = setInterval(() => {
        setLoadingMsg((m) => Math.min(m + 1, LOADING_MESSAGES.length - 1));
      }, 900);
    } else {
      if (loadingTimer.current) clearInterval(loadingTimer.current);
    }
    return () => {
      if (loadingTimer.current) clearInterval(loadingTimer.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitting]);
  const [result, setResult] = useState<{
    status: "created" | "exists";
    token: number;
    name: string;
  } | null>(null);

  function toggle() {
    setFlipped((f) => !f);
  }

  function handlePointerDown(e: React.PointerEvent) {
    tapOrigin.current = { x: e.clientX, y: e.clientY };
  }

  function handlePointerUp(e: React.PointerEvent) {
    if (!tapOrigin.current) return;
    const dx = Math.abs(e.clientX - tapOrigin.current.x);
    const dy = Math.abs(e.clientY - tapOrigin.current.y);
    tapOrigin.current = null;
    // Only flip if the pointer barely moved — genuine tap, not a scroll gesture
    if (dx < 8 && dy < 8) toggle();
  }

  async function handleSubmit() {
    if (submitting) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/attendees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), mobile }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error ?? "Something went wrong.");
      } else {
        setResult(data);
      }
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function pad(n: number) {
    return String(n).padStart(3, "0");
  }

  return (
    <>
      {/*
       * PlaneFlyBy is intentionally rendered OUTSIDE the relative z-10 wrapper.
       * Inside that stacking context z=5 would beat the card content at z=auto.
       * Outside it, z=5 (planes) < z=10 (card wrapper) in the root stacking
       * context, so planes naturally slide behind the boarding-pass card.
       */}
      <PlaneFlyBy />

      <div
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8"
        style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }}
      >
        {/* Plane + event name */}
        <div className="float-in text-center mb-5">
          <div
            className="text-5xl mb-1 leading-none"
            aria-hidden="true"
          >
            ✈️
          </div>
          <p className="text-sky-300 text-xs font-semibold tracking-[0.18em] uppercase">
            Hasan&apos;s First Birthday
          </p>
        </div>

        {/*
         * Outer wrapper: float-in entrance + optional winner glow.
         * card-scene provides the perspective for the 3-D flip.
         */}
        <div
          className="w-full max-w-sm float-in float-in-delay-1 winner-glow-wrap"
        >
          <div className="card-scene">
            {/* card-inner rotates on tap/click */}
            <div
              className={`card-inner${flipped ? " card-inner--flipped" : ""}`}
              role="button"
              tabIndex={0}
              aria-label={
                flipped
                  ? "Flip back to boarding pass"
                  : "Flip card to reveal fun facts about Hasan"
              }
              style={{ touchAction: "pan-y" }}
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") toggle();
              }}
            >
              {/* ── FRONT FACE ─────────────────────────────────── */}
              <div className="card-face card-face--front">
                <div className="boarding-pass">

                  {/* Coloured header */}
                  <div
                    className={`px-5 pt-7 pb-5 ${
                      isWinner
                        ? "bg-gradient-to-br from-amber-500 to-amber-600"
                        : "bg-gradient-to-br from-sky-500 to-sky-700"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-white/75 text-[11px] font-bold tracking-widest uppercase mb-1">
                          {isWinner ? "Winner · Boarding Pass" : "Guest · Boarding Pass"}
                        </p>
                        <h1 className="text-white text-xl font-bold leading-snug">
                          {headline}
                        </h1>
                      </div>
                      <span
                        className="text-4xl flex-shrink-0 leading-none"
                        aria-hidden="true"
                      >
                        {emoji}
                      </span>
                    </div>
                  </div>

                  {/* Flight strip */}
                  <div className="bg-slate-800 px-5 py-3 flex items-center justify-between">
                    <div className="text-center">
                      <p className="text-slate-400 text-[10px] uppercase tracking-widest">From</p>
                      <p className="text-white font-bold text-base leading-tight">YOUR</p>
                      <p className="text-slate-300 text-[11px]">Heart</p>
                    </div>

                    <div className="flex-1 flex items-center px-3" aria-hidden="true">
                      <div className="flex-1 border-t border-dashed border-slate-600" />
                      <span className="text-slate-400 mx-2 text-lg">✈</span>
                      <div className="flex-1 border-t border-dashed border-slate-600" />
                    </div>

                    <div className="text-center">
                      <p className="text-slate-400 text-[10px] uppercase tracking-widest">To</p>
                      <p className="text-white font-bold text-base leading-tight">JOY</p>
                      <p className="text-slate-300 text-[11px]">& Celebration</p>
                    </div>
                  </div>

                  {/* Tear-line perforation */}
                  <div className="relative px-5 py-3 bg-white" aria-hidden="true">
                    <div className="circle-cutout-left" />
                    <div className="circle-cutout-right" />
                    <div className="perforation-line" />
                  </div>

                  {/* Message body — pb-10 gives ~2 extra lines of height so the
                      back face has room on phones where text wraps differently */}
                  <div className="bg-white px-5 pb-10">
                    <p className="text-slate-700 text-[16px] leading-relaxed text-center">
                      {message}
                    </p>

                    {isWinner && number !== undefined && (
                      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                        <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-full border border-amber-300 min-h-[36px] flex items-center">
                          WINNER #{number}
                        </span>
                        <span className="bg-sky-100 text-sky-700 text-xs font-bold px-3 py-1.5 rounded-full border border-sky-300 min-h-[36px] flex items-center">
                          PRIZE ENCLOSED 🎁
                        </span>
                      </div>
                    )}

                    <div className="barcode-strip mt-5 mx-2" aria-hidden="true" />
                    <p className="text-center text-slate-400 text-[10px] mt-1 font-mono tracking-widest">
                      HASAN · 2025 · BIRTHDAY
                    </p>

                    {/* Flip hint */}
                    <p className="flip-hint text-center text-slate-400 text-[10px] mt-3 select-none">
                      tap to reveal fun facts ✨
                    </p>
                  </div>

                </div>{/* /.boarding-pass */}
              </div>{/* /.card-face--front */}

              {/* ── BACK FACE ──────────────────────────────────── */}
              <div className="card-face card-face--back">
                <div className="boarding-pass-back">

                  {/* Coloured header */}
                  <div className="bg-gradient-to-br from-violet-600 to-indigo-700 px-5 pt-7 pb-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-white/70 text-[11px] font-bold tracking-widest uppercase mb-1">
                          Classified Info · Top Secret
                        </p>
                        <h2 className="text-white text-xl font-bold leading-snug">
                          Fun Facts About Hasan
                        </h2>
                      </div>
                      <span className="text-4xl flex-shrink-0 leading-none" aria-hidden="true">
                        🌟
                      </span>
                    </div>
                  </div>

                  {/* Facts list */}
                  <div className="bg-slate-900 px-5 pt-5 pb-1">
                    {FUN_FACTS.map((fact, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 mb-4 last:mb-0"
                      >
                        <span
                          className="text-lg flex-shrink-0 leading-snug mt-0.5"
                          aria-hidden="true"
                        >
                          {fact.emoji}
                        </span>
                        <p className="text-slate-200 text-[13px] leading-relaxed">
                          {fact.text}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="bg-slate-900 px-5 pt-2 pb-2">
                    <p className="text-center text-slate-500 text-[10px] select-none">
                      tap to flip back ↩
                    </p>
                  </div>

                </div>{/* /.boarding-pass-back */}
              </div>{/* /.card-face--back */}

            </div>{/* /.card-inner */}
          </div>{/* /.card-scene */}
        </div>{/* /.winner-glow-wrap (or plain wrapper) */}

        {/* ── Guest fields / token reveal (general pass only) ─── */}
        {!isWinner && (
          <div className="w-full max-w-sm mt-5 float-in float-in-delay-2">

            {result ? (
              /* ── Token reveal ─────────────────────────────── */
              <div
                className="rounded-2xl p-6 text-center"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                }}
              >
                <div className="text-4xl mb-3" aria-hidden="true">
                  {result.status === "created" ? "🎉" : "👋"}
                </div>
                <p className="text-slate-300 text-sm mb-4">
                  {result.status === "created"
                    ? `You're in, ${result.name.split(" ")[0]}!`
                    : `Welcome back, ${result.name.split(" ")[0]}!`}
                </p>
                {/* Token badge */}
                <div
                  className="inline-block px-8 py-4 rounded-2xl mb-4"
                  style={{
                    background: "linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)",
                    boxShadow: "0 0 32px rgba(99,102,241,0.4)",
                  }}
                >
                  <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest mb-1">
                    Your Token
                  </p>
                  <p className="text-white text-4xl font-bold font-mono tracking-wider">
                    #{pad(result.token)}
                  </p>
                </div>
                <p className="text-slate-500 text-[11px]">
                  {result.status === "created"
                    ? "Keep this number handy for the lucky draw!"
                    : "You were already registered with this number."}
                </p>
              </div>
            ) : (
              <>
                {/* Card wrapper */}
                <div
                  className="rounded-2xl p-5 space-y-4"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  {/* Name */}
                  <div>
                    <label className="block text-slate-400 text-[11px] font-semibold uppercase tracking-wider mb-1.5">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full bg-slate-800/80 text-white placeholder-slate-500 border border-slate-600 rounded-xl px-4 py-3 text-[16px] focus:outline-none focus:border-sky-500 transition-colors"
                    />
                  </div>

                  {/* Mobile */}
                  <div>
                    <label className="block text-slate-400 text-[11px] font-semibold uppercase tracking-wider mb-1.5">
                      Mobile Number
                    </label>
                    <div className="flex">
                      <span className="flex items-center bg-slate-700 text-slate-300 border border-r-0 border-slate-600 rounded-l-xl px-3 text-[16px] font-medium select-none">
                        +91
                      </span>
                      <input
                        type="tel"
                        inputMode="numeric"
                        value={mobile}
                        onChange={(e) => {
                          const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                          setMobile(digits);
                        }}
                        placeholder="10-digit number"
                        className="flex-1 bg-slate-800/80 text-white placeholder-slate-500 border border-slate-600 rounded-r-xl px-4 py-3 text-[16px] focus:outline-none focus:border-sky-500 transition-colors min-w-0"
                      />
                    </div>
                    {mobile.length > 0 && mobile.length < 10 && (
                      <p className="text-amber-400 text-[11px] mt-1.5 pl-1">
                        {10 - mobile.length} more digit{10 - mobile.length !== 1 ? "s" : ""} needed
                      </p>
                    )}
                    {mobile.length === 10 && (
                      <p className="text-emerald-400 text-[11px] mt-1.5 pl-1">✓ Looks good</p>
                    )}
                  </div>
                </div>

                {submitError && (
                  <p className="text-red-400 text-[12px] mt-2 text-center">{submitError}</p>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={!name.trim() || mobile.length !== 10 || submitting}
                  className="w-full mt-2 py-4 rounded-2xl text-[17px] font-bold tracking-wide transition-all duration-200 active:scale-95 disabled:cursor-not-allowed"
                  style={{
                    background:
                      !name.trim() || mobile.length !== 10 || submitting
                        ? "rgba(255,255,255,0.08)"
                        : "linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)",
                    color:
                      !name.trim() || mobile.length !== 10 || submitting
                        ? "rgba(255,255,255,0.25)"
                        : "#fff",
                    boxShadow:
                      !name.trim() || mobile.length !== 10 || submitting
                        ? "none"
                        : "0 0 24px rgba(99,102,241,0.5), 0 4px 16px rgba(14,165,233,0.4)",
                  }}
                >
                  {submitting ? LOADING_MESSAGES[loadingMsg] : "Enter Lucky Draw 🎉"}
                </button>
              </>
            )}

          </div>
        )}

        {/* Footer — hidden while the back face is showing so it doesn't overlap */}
        <p
          className="float-in float-in-delay-4 text-slate-400 text-xs mt-6 text-center transition-opacity duration-300"
          style={{
            opacity: flipped ? 0 : undefined,
            visibility: flipped ? "hidden" : undefined,
            pointerEvents: flipped ? "none" : undefined,
          }}
        >
          Celebrating Hasan&apos;s first trip around the sun 🌍
        </p>
      </div>
    </>
  );
}
