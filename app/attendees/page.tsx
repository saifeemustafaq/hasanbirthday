import { listAttendees } from "../lib/attendees";

export const dynamic = "force-dynamic";

function pad(n: number) {
  return String(n).padStart(3, "0");
}

export default async function AttendeesPage() {
  const attendees = await listAttendees();

  return (
    <div className="relative z-10 min-h-screen px-4 py-10">
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-2" aria-hidden="true">🎟️</div>
          <h1 className="text-white text-2xl font-bold">Lucky Draw Entries</h1>
          <p className="text-slate-400 text-sm mt-1">
            Hasan&apos;s First Birthday · {attendees.length} registered
          </p>
        </div>

        {attendees.length === 0 ? (
          <p className="text-center text-slate-500 text-sm mt-16">
            No entries yet. Be the first! 🎉
          </p>
        ) : (
          <div className="space-y-2">
            {attendees.map((a) => (
              <div
                key={a.mobile}
                className="flex items-center gap-4 rounded-xl px-4 py-3"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {/* Token badge */}
                <span
                  className="text-xs font-bold font-mono flex-shrink-0 w-10 text-center py-1 rounded-lg"
                  style={{
                    background: "rgba(14,165,233,0.15)",
                    color: "#38bdf8",
                    border: "1px solid rgba(14,165,233,0.3)",
                  }}
                >
                  #{pad(a.token)}
                </span>

                {/* Name */}
                <span className="text-white text-sm font-medium flex-1 truncate">
                  {a.name}
                </span>

                {/* Masked mobile */}
                <span className="text-slate-500 text-xs font-mono flex-shrink-0">
                  +91 {a.mobile.slice(0, 3)}•••{a.mobile.slice(-3)}
                </span>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
