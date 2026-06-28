"use client";

import { useState, useCallback } from "react";

interface Attendee {
  mobile: string;
  name: string;
  token: number;
}

function pad(n: number) {
  return String(n).padStart(3, "0");
}

export default function AdminPage() {
  const [key, setKey] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState("");
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(false);

  // per-row edit state: mobile -> draft values
  const [editing, setEditing] = useState<Record<string, { name: string; mobile: string }>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [deleting, setDeleting] = useState<Record<string, boolean>>({});

  const fetchAttendees = useCallback(async (adminKey: string) => {
    setLoading(true);
    setAuthError("");
    try {
      const res = await fetch(`/api/attendees?key=${encodeURIComponent(adminKey)}`);
      if (res.status === 401) {
        setAuthError("Wrong password.");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setAttendees(data.attendees ?? []);
      setAuthed(true);
    } catch {
      setAuthError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  async function handleDelete(mobile: string) {
    if (!confirm(`Remove this attendee? This cannot be undone.`)) return;
    setDeleting((d) => ({ ...d, [mobile]: true }));
    try {
      await fetch(`/api/attendees/${mobile}?key=${encodeURIComponent(key)}`, {
        method: "DELETE",
      });
      setAttendees((prev) => prev.filter((a) => a.mobile !== mobile));
    } finally {
      setDeleting((d) => ({ ...d, [mobile]: false }));
    }
  }

  function startEdit(a: Attendee) {
    setEditing((e) => ({ ...e, [a.mobile]: { name: a.name, mobile: a.mobile } }));
  }

  function cancelEdit(mobile: string) {
    setEditing((e) => {
      const next = { ...e };
      delete next[mobile];
      return next;
    });
  }

  async function saveEdit(originalMobile: string) {
    const draft = editing[originalMobile];
    if (!draft) return;
    setSaving((s) => ({ ...s, [originalMobile]: true }));
    try {
      const res = await fetch(
        `/api/attendees/${originalMobile}?key=${encodeURIComponent(key)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: draft.name, mobile: draft.mobile }),
        }
      );
      if (res.ok) {
        setAttendees((prev) =>
          prev.map((a) =>
            a.mobile === originalMobile
              ? { ...a, name: draft.name, mobile: draft.mobile }
              : a
          )
        );
        cancelEdit(originalMobile);
      }
    } finally {
      setSaving((s) => ({ ...s, [originalMobile]: false }));
    }
  }

  if (!authed) {
    return (
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div
          className="w-full max-w-sm rounded-2xl p-7"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}
        >
          <div className="text-center mb-6">
            <div className="text-3xl mb-2" aria-hidden="true">🔐</div>
            <h1 className="text-white text-xl font-bold">Admin Access</h1>
            <p className="text-slate-400 text-sm mt-1">Enter your admin password</p>
          </div>

          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchAttendees(key)}
            placeholder="Password"
            className="w-full bg-slate-800 text-white placeholder-slate-500 border border-slate-600 rounded-xl px-4 py-3 text-[16px] focus:outline-none focus:border-sky-500 transition-colors mb-3"
            autoFocus
          />

          {authError && (
            <p className="text-red-400 text-[12px] mb-3 text-center">{authError}</p>
          )}

          <button
            onClick={() => fetchAttendees(key)}
            disabled={!key || loading}
            className="w-full py-3 rounded-xl text-[16px] font-bold transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)",
              color: "#fff",
            }}
          >
            {loading ? "Checking…" : "Enter"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 min-h-screen px-4 py-10">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-white text-xl font-bold">Admin · Attendees</h1>
            <p className="text-slate-400 text-sm mt-0.5">{attendees.length} entries</p>
          </div>
          <button
            onClick={() => fetchAttendees(key)}
            className="text-sky-400 text-sm font-medium hover:text-sky-300 transition-colors"
          >
            Refresh ↻
          </button>
        </div>

        {attendees.length === 0 ? (
          <p className="text-center text-slate-500 text-sm mt-16">No entries yet.</p>
        ) : (
          <div className="space-y-2">
            {attendees.map((a) => {
              const isEditing = !!editing[a.mobile];
              const draft = editing[a.mobile];
              const isSaving = saving[a.mobile];
              const isDeleting = deleting[a.mobile];

              return (
                <div
                  key={a.mobile}
                  className="rounded-xl px-4 py-3"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {isEditing ? (
                    /* ── Edit row ── */
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-xs font-bold font-mono w-10 text-center py-1 rounded-lg flex-shrink-0"
                          style={{
                            background: "rgba(14,165,233,0.15)",
                            color: "#38bdf8",
                            border: "1px solid rgba(14,165,233,0.3)",
                          }}
                        >
                          #{pad(a.token)}
                        </span>
                        <input
                          value={draft.name}
                          onChange={(e) =>
                            setEditing((ed) => ({
                              ...ed,
                              [a.mobile]: { ...draft, name: e.target.value },
                            }))
                          }
                          placeholder="Name"
                          className="flex-1 bg-slate-700 text-white placeholder-slate-400 border border-slate-600 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-sky-500 transition-colors min-w-0"
                        />
                      </div>
                      <div className="flex items-center gap-2 pl-12">
                        <span className="text-slate-400 text-sm flex-shrink-0">+91</span>
                        <input
                          value={draft.mobile}
                          onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                            setEditing((ed) => ({
                              ...ed,
                              [a.mobile]: { ...draft, mobile: digits },
                            }));
                          }}
                          placeholder="10-digit mobile"
                          inputMode="numeric"
                          className="flex-1 bg-slate-700 text-white placeholder-slate-400 border border-slate-600 rounded-lg px-3 py-1.5 text-sm font-mono focus:outline-none focus:border-sky-500 transition-colors min-w-0"
                        />
                      </div>
                      <div className="flex gap-2 pl-12">
                        <button
                          onClick={() => saveEdit(a.mobile)}
                          disabled={isSaving || !draft.name.trim() || draft.mobile.length !== 10}
                          className="px-4 py-1.5 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-40"
                          style={{ background: "#0ea5e9" }}
                        >
                          {isSaving ? "Saving…" : "Save"}
                        </button>
                        <button
                          onClick={() => cancelEdit(a.mobile)}
                          className="px-4 py-1.5 rounded-lg text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                          style={{ background: "rgba(255,255,255,0.08)" }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* ── Display row ── */
                    <div className="flex items-center gap-3">
                      <span
                        className="text-xs font-bold font-mono w-10 text-center py-1 rounded-lg flex-shrink-0"
                        style={{
                          background: "rgba(14,165,233,0.15)",
                          color: "#38bdf8",
                          border: "1px solid rgba(14,165,233,0.3)",
                        }}
                      >
                        #{pad(a.token)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{a.name}</p>
                        <p className="text-slate-500 text-xs font-mono">+91 {a.mobile}</p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => startEdit(a)}
                          className="text-slate-400 hover:text-sky-400 text-sm transition-colors px-2 py-1"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(a.mobile)}
                          disabled={isDeleting}
                          className="text-slate-400 hover:text-red-400 text-sm transition-colors px-2 py-1 disabled:opacity-40"
                        >
                          {isDeleting ? "…" : "Remove"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
