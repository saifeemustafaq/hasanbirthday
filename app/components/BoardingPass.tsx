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
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
      {/* Plane silhouette header */}
      <div className="float-in text-white text-opacity-60 mb-6 text-center">
        <div className="text-5xl mb-2">✈️</div>
        <p className="text-sky-300 text-sm font-medium tracking-[0.2em] uppercase">
          Hasan&apos;s First Birthday
        </p>
      </div>

      {/* Main boarding pass card */}
      <div
        className={`boarding-pass w-full max-w-sm float-in float-in-delay-1 ${
          isWinner ? "winner-glow" : ""
        }`}
      >
        {/* Header strip */}
        <div
          className={`px-6 pt-8 pb-5 ${
            isWinner
              ? "bg-gradient-to-br from-amber-500 to-amber-600"
              : "bg-gradient-to-br from-sky-500 to-sky-700"
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white text-opacity-80 text-xs font-semibold tracking-widest uppercase mb-1">
                {isWinner ? "Winner • Boarding Pass" : "Guest • Boarding Pass"}
              </p>
              <h1 className="text-white text-2xl font-bold leading-tight">
                {headline}
              </h1>
            </div>
            <span className="text-4xl ml-3">{emoji}</span>
          </div>
        </div>

        {/* Flight info strip */}
        <div className="bg-slate-800 px-6 py-3 flex items-center justify-between">
          <div className="text-center">
            <p className="text-slate-400 text-xs uppercase tracking-widest">From</p>
            <p className="text-white font-bold text-lg">YOUR</p>
            <p className="text-slate-300 text-xs">Heart</p>
          </div>
          <div className="flex-1 flex items-center px-4">
            <div className="flex-1 border-t border-dashed border-slate-600" />
            <span className="text-slate-400 mx-2 text-xl">✈</span>
            <div className="flex-1 border-t border-dashed border-slate-600" />
          </div>
          <div className="text-center">
            <p className="text-slate-400 text-xs uppercase tracking-widest">To</p>
            <p className="text-white font-bold text-lg">JOY</p>
            <p className="text-slate-300 text-xs">& Celebration</p>
          </div>
        </div>

        {/* Perforation divider */}
        <div className="relative px-6 py-3 bg-white">
          <div className="circle-cutout-left" />
          <div className="circle-cutout-right" />
          <div className="perforation-line" />
        </div>

        {/* Message body */}
        <div className="bg-white px-6 pb-6">
          <p className="text-slate-700 text-base leading-relaxed text-center">
            {message}
          </p>

          {isWinner && number !== undefined && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full border border-amber-300">
                WINNER #{number}
              </span>
              <span className="bg-sky-100 text-sky-700 text-xs font-bold px-3 py-1 rounded-full border border-sky-300">
                PRIZE ENCLOSED 🎁
              </span>
            </div>
          )}

          {/* Barcode-style decoration */}
          <div className="mt-5 flex justify-center gap-0.5 opacity-30">
            {Array.from({ length: 28 }).map((_, i) => (
              <div
                key={i}
                className="bg-slate-800"
                style={{
                  width: i % 3 === 0 ? "3px" : "2px",
                  height: i % 5 === 0 ? "28px" : "20px",
                }}
              />
            ))}
          </div>
          <p className="text-center text-slate-400 text-xs mt-1 font-mono tracking-widest">
            HASAN · 2025 · BIRTHDAY
          </p>
        </div>
      </div>

      {/* Footer */}
      <p className="float-in float-in-delay-4 text-slate-400 text-xs mt-8 text-center">
        Celebrating Hasan&apos;s first trip around the sun 🌍
      </p>
    </div>
  );
}
