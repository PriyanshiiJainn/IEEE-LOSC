"use client";

import { useState } from "react";
import { MarkdownField } from "@/components/admin/MarkdownField";

type About = { id: string; aboutUs: string; aboutOptica: string; recentUpdates: string } | null;

type Props = { initial: About };

export function AboutEditor({ initial }: Props) {
  const [aboutUs, setAboutUs] = useState(initial?.aboutUs ?? "");
  const [aboutOptica, setAboutOptica] = useState(initial?.aboutOptica ?? "");
  const [recentUpdates, setRecentUpdates] = useState(initial?.recentUpdates ?? "");
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
        body: JSON.stringify({ aboutUs, aboutOptica, recentUpdates }),
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
      <MarkdownField label="About us" value={aboutUs} onChange={setAboutUs} required rows={8} />
      <MarkdownField label="About Optica" value={aboutOptica} onChange={setAboutOptica} required rows={8} />
      <MarkdownField
        label="Recent Updates"
        value={recentUpdates}
        onChange={setRecentUpdates}
        required
        rows={8}
        hint="Start a line with &quot;- &quot; if you want it to show as a bullet."
      />
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
