"use client";

import { useState } from "react";

type About = { id: string; aboutUs: string; aboutOptica: string } | null;

type Props = { initial: About };

export function AboutEditor({ initial }: Props) {
  const [aboutUs, setAboutUs] = useState(initial?.aboutUs ?? "");
  const [aboutOptica, setAboutOptica] = useState(initial?.aboutOptica ?? "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<"success" | "error" | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aboutUs, aboutOptica }),
      });
      if (!res.ok) throw new Error();
      setMessage("success");
    } catch {
      setMessage("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">About us</label>
        <textarea
          value={aboutUs}
          onChange={(e) => setAboutUs(e.target.value)}
          required
          rows={6}
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
        />
        <p className="mt-1 text-xs text-gray-400">Supports markdown: **bold**, - bullets, blank line for new paragraph, Enter for line break</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">About Optica</label>
        <textarea
          value={aboutOptica}
          onChange={(e) => setAboutOptica(e.target.value)}
          required
          rows={6}
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
        />
        <p className="mt-1 text-xs text-gray-400">Supports markdown: **bold**, - bullets, blank line for new paragraph, Enter for line break</p>
      </div>
      {message === "success" && <p className="text-sm text-green-600">Saved.</p>}
      {message === "error" && <p className="text-sm text-red-600">Save failed.</p>}
      <button
        type="submit"
        disabled={loading}
        className="rounded bg-ieee-red px-4 py-2 text-sm font-medium text-white hover:bg-ieee-red/90 disabled:opacity-50"
      >
        {loading ? "Saving…" : "Save"}
      </button>
    </form>
  );
}
