"use client";

import { useState } from "react";

export type Flash = {
  id: string;
  eventId: string | null;
  title: string;
  shortMessage: string | null;
  link: string | null;
  active: boolean;
  event: { id: string; title: string } | null;
};

type Props = {
  initialFlash: Flash[];
  events: { id: string; title: string }[];
};

const emptyForm = { eventId: "", title: "", shortMessage: "", link: "", active: false };

export function FlashManager({ initialFlash, events }: Props) {
  const [items, setItems] = useState(initialFlash);
  const [editing, setEditing] = useState<Flash | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);

  function openAdd() {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  }
  function openEdit(f: Flash) {
    setEditing(f);
    setForm({
      eventId: f.eventId ?? "",
      title: f.title,
      shortMessage: f.shortMessage ?? "",
      link: f.link ?? "",
      active: f.active,
    });
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const body = { eventId: form.eventId || null, title: form.title, shortMessage: form.shortMessage || null, link: form.link || null, active: form.active };
      if (editing) {
        const res = await fetch(`/api/admin/flash/${editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        if (!res.ok) throw new Error(await res.text());
        const updated = await res.json();
        setItems((prev) => prev.map((p) => (p.id === updated.id ? { ...updated, event: editing.event } : { ...p, active: updated.active ? false : p.active })));
      } else {
        const res = await fetch("/api/admin/flash", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        if (!res.ok) throw new Error(await res.text());
        const created = await res.json();
        const ev = events.find((e) => e.id === created.eventId);
        setItems((prev) => [{ ...created, event: ev ?? null }, ...prev]);
      }
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this flash?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/flash/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setItems((prev) => prev.filter((p) => p.id !== id));
    } catch {
      setError("Delete failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button type="button" onClick={openAdd} className="mb-4 rounded bg-ieee-red px-3 py-2 text-sm font-medium text-white hover:bg-ieee-red/90">Add flash</button>
      <p className="text-sm text-gray-600 mb-4">Only one flash can be active at a time. It appears on the home page.</p>
      <div className="space-y-2">
        {items.map((f) => (
          <div key={f.id} className="flex items-center justify-between rounded border border-gray-200 bg-white px-4 py-3">
            <div>
              <span className="font-medium">{f.title}</span>
              {f.active && <span className="ml-2 text-xs text-ieee-red font-medium">Active</span>}
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => openEdit(f)} className="text-sm text-ieee-red hover:underline">Edit</button>
              <button type="button" onClick={() => handleDelete(f.id)} className="text-sm text-red-600 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">{editing ? "Edit flash" : "Add flash"}</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required className="w-full rounded border border-gray-300 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short message</label>
                <input value={form.shortMessage} onChange={(e) => setForm((f) => ({ ...f, shortMessage: e.target.value }))} className="w-full rounded border border-gray-300 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link (optional)</label>
                <input type="url" value={form.link} onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))} placeholder="https://..." className="w-full rounded border border-gray-300 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link to event (optional)</label>
                <select value={form.eventId} onChange={(e) => setForm((f) => ({ ...f, eventId: e.target.value }))} className="w-full rounded border border-gray-300 px-3 py-2 text-sm">
                  <option value="">— None —</option>
                  {events.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}
                </select>
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} />
                <span className="text-sm">Set as active (show on home)</span>
              </label>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex gap-2 pt-2">
                <button type="submit" disabled={loading} className="rounded bg-ieee-red px-3 py-2 text-sm font-medium text-white hover:bg-ieee-red/90 disabled:opacity-50">{loading ? "Saving…" : "Save"}</button>
                <button type="button" onClick={() => setOpen(false)} className="rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
