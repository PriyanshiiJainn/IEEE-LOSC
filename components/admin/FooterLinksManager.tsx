"use client";

import { useState } from "react";

type LinkItem = { id: string; label: string; url: string; order: number };

type Props = { initialLinks: LinkItem[] };

export function FooterLinksManager({ initialLinks }: Props) {
  const [links, setLinks] = useState(initialLinks);
  const [editing, setEditing] = useState<LinkItem | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({ label: "", url: "", order: 0 });

  function openAdd() {
    setEditing(null);
    setForm({ label: "", url: "", order: links.length });
    setOpen(true);
  }
  function openEdit(l: LinkItem) {
    setEditing(l);
    setForm({ label: l.label, url: l.url, order: l.order });
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const body = { label: form.label, url: form.url, order: form.order };
      if (editing) {
        const res = await fetch(`/api/admin/footer/${editing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error(await res.text());
        const updated = await res.json();
        setLinks((prev) => prev.map((p) => (p.id === updated.id ? updated : p)).sort((a, b) => a.order - b.order));
      } else {
        const res = await fetch("/api/admin/footer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error(await res.text());
        const created = await res.json();
        setLinks((prev) => [...prev, created].sort((a, b) => a.order - b.order));
      }
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this link?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/footer/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setLinks((prev) => prev.filter((p) => p.id !== id));
    } catch {
      setError("Delete failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={openAdd}
        className="mb-4 rounded bg-ieee-red px-3 py-2 text-sm font-medium text-white hover:bg-ieee-red/90"
      >
        Add link
      </button>

      <div className="space-y-2">
        {links.map((l) => (
          <div
            key={l.id}
            className="flex items-center justify-between rounded border border-gray-200 bg-white px-4 py-3"
          >
            <div>
              <span className="font-medium">{l.label}</span>
              <span className="ml-2 text-sm text-gray-500">{l.url}</span>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => openEdit(l)} className="text-sm text-ieee-red hover:underline">
                Edit
              </button>
              <button type="button" onClick={() => handleDelete(l.id)} className="text-sm text-red-600 hover:underline">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">{editing ? "Edit link" : "Add link"}</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                <input
                  value={form.label}
                  onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                  required
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                <input
                  type="url"
                  value={form.url}
                  onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                  required
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm((f) => ({ ...f, order: parseInt(e.target.value, 10) || 0 }))}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded bg-ieee-red px-3 py-2 text-sm font-medium text-white hover:bg-ieee-red/90 disabled:opacity-50"
                >
                  {loading ? "Saving…" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
