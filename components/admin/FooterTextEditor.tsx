"use client";

import { useState } from "react";

type Props = {
  initialCopyrightText: string;
  initialLinksHeading: string;
};

export function FooterTextEditor({ initialCopyrightText, initialLinksHeading }: Props) {
  const [copyrightText, setCopyrightText] = useState(initialCopyrightText);
  const [linksHeading, setLinksHeading] = useState(initialLinksHeading);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<"success" | "error" | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/footer-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ copyrightText, linksHeading }),
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
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Footer text</label>
        <input
          value={copyrightText}
          onChange={(e) => setCopyrightText(e.target.value)}
          required
          maxLength={300}
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
        />
        <p className="mt-1 text-xs text-gray-500">
          Shown on the left of the footer, e.g. &ldquo;LNMIIT Optica Student Chapter &copy; LNMIIT 2026&rdquo;.
          Type &copy; directly for the copyright symbol.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Links heading</label>
        <input
          value={linksHeading}
          onChange={(e) => setLinksHeading(e.target.value)}
          maxLength={100}
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
        />
        <p className="mt-1 text-xs text-gray-500">
          Label shown before the links below. Leave empty to hide it.
        </p>
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
