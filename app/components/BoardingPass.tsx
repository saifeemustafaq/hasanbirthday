interface BoardingPassProps {
  type: "winner" | "general";
  number?: number;
  emoji: string;
  headline: string;
  message: string;
}

export default function BoardingPass({
  type,
  number,
  emoji,
  headline,
  message,
}: BoardingPassProps) {
  const isWinner = type === "winner";

  return (
    <div
      className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8"
      style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }}
    >
      {/* Plane + event name */}
      <div className="float-in text-center mb-5">
        <div
          className="text-5xl mb-1 leading-none"
          /* aria-hidden so screen readers skip decorative emoji */
          aria-hidden="true"
        >
          ✈️
        </div>
        <p className="text-sky-300 text-xs font-semibold tracking-[0.18em] uppercase">
          Hasan&apos;s First Birthday
        </p>
      </div>

      {/*
       * winner-glow-wrap provides the glowing ring around the card.
       * The card itself (.boarding-pass) keeps overflow:hidden for
       * rounded corners without clipping the outer glow.
       */}
      <div className={`w-full max-w-sm float-in float-in-delay-1${isWinner ? " winner-glow-wrap" : ""}`}>
        <div className="boarding-pass">

          {/* ── Coloured header ── */}
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
                {/* 2xl on narrow phones is readable without being oversized */}
                <h1 className="text-white text-xl font-bold leading-snug">
                  {headline}
                </h1>
              </div>
              {/* aria-hidden: purely decorative emoji */}
              <span className="text-4xl flex-shrink-0 leading-none" aria-hidden="true">
                {emoji}
              </span>
            </div>
          </div>

          {/* ── Flight strip ── */}
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

          {/* ── Tear-line perforation ── */}
          <div className="relative px-5 py-3 bg-white" aria-hidden="true">
            <div className="circle-cutout-left" />
            <div className="circle-cutout-right" />
            <div className="perforation-line" />
          </div>

          {/* ── Message body ── */}
          <div className="bg-white px-5 pb-6">
            {/* 16px base prevents iOS auto-zoom (no input here, but good practice) */}
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

            {/*
             * CSS-only barcode — zero JS DOM nodes, zero React elements.
             * repeating-linear-gradient produces the bar pattern natively.
             */}
            <div className="barcode-strip mt-5 mx-2" aria-hidden="true" />
            <p className="text-center text-slate-400 text-[10px] mt-1 font-mono tracking-widest">
              HASAN · 2025 · BIRTHDAY
            </p>
          </div>

        </div>{/* /.boarding-pass */}
      </div>{/* /.winner-glow-wrap */}

      {/* Footer */}
      <p className="float-in float-in-delay-4 text-slate-400 text-xs mt-6 text-center">
        Celebrating Hasan&apos;s first trip around the sun 🌍
      </p>
    </div>
  );
}
