"use client";

import { useState } from "react";

/**
 * Switching year, adding one and deleting one all navigate with a full page
 * load. The year is a server-rendered URL parameter, so a real navigation is
 * what keeps the pills, the counts and the member list below them in step.
 */
function go(url: string) {
  window.location.assign(url);
}

export function AcademicYearBar({
  years,
  counts,
  selected,
  suggested,
}: {
  years: string[];
  counts: Record<string, number>;
  selected: string;
  /** Prefilled value when adding a year — the one after the newest so far. */
  suggested: string;
}) {
  const [adding, setAdding] = useState(false);
  const [value, setValue] = useState(suggested);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const selectedCount = counts[selected] ?? 0;

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/admin/academic-years", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year: value.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not add that year");
      setAdding(false);
      go(`/admin/team?year=${encodeURIComponent(value.trim())}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add that year");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete the academic year ${selected}?`)) return;
    setError("");
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/academic-years/${encodeURIComponent(selected)}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not delete that year");
      const remaining = years.filter((y) => y !== selected);
      go(remaining[0] ? `/admin/team?year=${encodeURIComponent(remaining[0])}` : "/admin/team");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete that year");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-sm font-medium text-gray-700">Academic year</span>
        {years.map((y) => {
          const isSelected = y === selected;
          return (
            <a
              key={y}
              href={`/admin/team?year=${encodeURIComponent(y)}`}
              aria-current={isSelected ? "page" : undefined}
              className={
                isSelected
                  ? "rounded-full bg-ieee-red px-3 py-1.5 text-sm font-medium text-white"
                  : "rounded-full border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:border-ieee-red hover:text-ieee-red"
              }
            >
              {y}
              <span className={isSelected ? "ml-1.5 text-white/80" : "ml-1.5 text-gray-400"}>
                {counts[y] ?? 0}
              </span>
            </a>
          );
        })}

        {!adding && (
          <button
            type="button"
            onClick={() => {
              setValue(suggested);
              setError("");
              setAdding(true);
            }}
            className="rounded-full border border-dashed border-gray-400 px-3 py-1.5 text-sm text-gray-600 hover:border-ieee-red hover:text-ieee-red"
          >
            + Add year
          </button>
        )}

        {adding && (
          <form onSubmit={handleAdd} className="flex items-center gap-2">
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="2026-27"
              autoFocus
              className="w-28 rounded border border-gray-300 px-2 py-1.5 text-sm"
            />
            <button
              type="submit"
              disabled={busy}
              className="rounded bg-ieee-red px-3 py-1.5 text-sm font-medium text-white hover:bg-ieee-red/90 disabled:opacity-50"
            >
              {busy ? "Adding…" : "Add"}
            </button>
            <button
              type="button"
              onClick={() => {
                setAdding(false);
                setError("");
              }}
              className="rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </form>
        )}

        {selectedCount === 0 && years.length > 1 && !adding && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={busy}
            className="ml-auto text-sm text-red-600 hover:underline disabled:opacity-50"
          >
            Delete {selected}
          </button>
        )}
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <p className="mt-3 text-sm text-gray-500">
        Editing the <span className="font-medium text-gray-700">{selected}</span> team
        {selectedCount > 0 ? ` (${selectedCount} member${selectedCount === 1 ? "" : "s"})` : ""}.
        A year appears in the dropdown on the public team page as soon as you add it here.
      </p>
    </div>
  );
}
