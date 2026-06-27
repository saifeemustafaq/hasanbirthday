"use client";

import { useState, useEffect, useCallback } from "react";

// SHA-256 of "Mustafa@123" — computed offline, never the plaintext.
// Verify: node -e "require('crypto').createHash('sha256').update('Mustafa@123').digest('hex')" | cat
const PW_HASH =
  "4627b5e8a301ba8fadc607ba587deeaf0bdfc3f5cd2957004b23be4fd391f082";

const SESSION_KEY = "ff_authed";

// ─── All feature flags live here ─────────────────────────────────────────────
const FLAGS = [
  {
    key: "ff_flight_animation",
    label: "Flight Animation",
    description: "Animated planes flying across winner pages",
  },
  {
    key: "ff_star_field",
    label: "Twinkling Star Field",
    description: "Animated twinkling stars across the night-sky background",
  },
] as const;

type FlagKey = (typeof FLAGS)[number]["key"];

// ─── SHA-256 via Web Crypto API (no Node, works in any browser) ──────────────
async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(text),
  );
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// ─── Toggle switch ────────────────────────────────────────────────────────────
function Toggle({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      role="switch"
      aria-checked={enabled}
      onClick={onToggle}
      className="relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-900"
      style={{ backgroundColor: enabled ? "#f59e0b" : "#334155" }}
    >
      <span
        className="pointer-events-none inline-block h-6 w-6 rounded-full bg-white shadow-lg transition-transform duration-200"
        style={{ transform: enabled ? "translateX(20px)" : "translateX(0)" }}
      />
    </button>
  );
}

// ─── Password gate ────────────────────────────────────────────────────────────
function PasswordGate({ onSuccess }: { onSuccess: () => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setChecking(true);
    setError("");
    const hash = await sha256(value);
    if (hash === PW_HASH) {
      sessionStorage.setItem(SESSION_KEY, "1");
      onSuccess();
    } else {
      setError("Incorrect password.");
    }
    setValue("");
    setChecking(false);
  };

  return (
    <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-xs">
        {/* Icon */}
        <div className="mb-6 text-center">
          <span className="text-4xl" aria-hidden="true">🔒</span>
          <p className="mt-2 text-sky-300 text-xs font-semibold tracking-[0.18em] uppercase">
            Feature Flags · Admin
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            required
            className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
          />
          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}
          <button
            type="submit"
            disabled={checking || !value}
            className="w-full rounded-xl bg-amber-500 px-4 py-3 font-semibold text-white transition-colors hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {checking ? "Checking…" : "Enter"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Flag dashboard ───────────────────────────────────────────────────────────
function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [flagState, setFlagState] = useState<Record<FlagKey, boolean>>(() => {
    // Initialise from localStorage; default everything to ON
    const initial = {} as Record<FlagKey, boolean>;
    for (const f of FLAGS) {
      const stored = localStorage.getItem(f.key);
      initial[f.key] = stored === null ? true : stored === "1";
    }
    return initial;
  });

  const toggle = useCallback((key: FlagKey) => {
    setFlagState((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem(key, next[key] ? "1" : "0");
      return next;
    });
  }, []);

  return (
    <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="text-4xl mb-1" aria-hidden="true">✈️</div>
        <p className="text-sky-300 text-xs font-semibold tracking-[0.18em] uppercase">
          Hasan&apos;s Birthday · Feature Flags
        </p>
      </div>

      {/* Flag cards */}
      <div className="w-full max-w-sm space-y-3">
        {FLAGS.map((flag) => (
          <div
            key={flag.key}
            className="flex items-center justify-between gap-4 rounded-2xl border border-slate-700 bg-slate-800/70 px-5 py-4 backdrop-blur-sm"
          >
            <div className="min-w-0">
              <p className="text-white font-semibold text-sm">{flag.label}</p>
              <p className="text-slate-400 text-xs mt-0.5 leading-snug">
                {flag.description}
              </p>
              <p className="mt-1 font-mono text-[10px] text-slate-600 tracking-wide">
                {flag.key}
              </p>
            </div>
            <Toggle
              enabled={flagState[flag.key]}
              onToggle={() => toggle(flag.key)}
            />
          </div>
        ))}
      </div>

      <p className="mt-6 text-slate-600 text-xs text-center">
        Changes apply on next page load.
      </p>

      {/* Logout */}
      <button
        onClick={onLogout}
        className="mt-8 text-slate-500 text-xs hover:text-slate-300 transition-colors"
      >
        Lock session
      </button>
    </div>
  );
}

// ─── Root component ───────────────────────────────────────────────────────────
export default function FeatureFlagPage() {
  const [authed, setAuthed] = useState(false);
  const [ready, setReady] = useState(false);

  // Read session on client only (avoids SSR mismatch)
  useEffect(() => {
    setAuthed(sessionStorage.getItem(SESSION_KEY) === "1");
    setReady(true);
  }, []);

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
  };

  if (!ready) return null; // avoid flash before session is read

  return authed ? (
    <Dashboard onLogout={logout} />
  ) : (
    <PasswordGate onSuccess={() => setAuthed(true)} />
  );
}
