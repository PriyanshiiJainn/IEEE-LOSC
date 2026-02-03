"use client";

import { useState } from "react";

type Event = {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string | null;
  venue: string | null;
  category: string;
  brochureUrl: string | null;
  isFeatured: boolean;
  registrationClosed: boolean;
};

type Props = {
  initialEvents: Event[];
  categories: { value: string; label: string }[];
};

export function EventsManager({ initialEvents, categories }: Props) {
  const [events, setEvents] = useState(initialEvents);
  const [editing, setEditing] = useState<Event | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const empty: Partial<Event> = {
    title: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    category: "WORKSHOP",
    brochureUrl: "",
    isFeatured: false,
    registrationClosed: false,
  };
  const [form, setForm] = useState<Record<string, string | boolean>>(empty as Record<string, string | boolean>);

  function openAdd() {
    setEditing(null);
    setForm(empty as Record<string, string | boolean>);
    setOpen(true);
  }
  function openEdit(e: Event) {
    setEditing(e);
    setForm({
      title: e.title,
      description: e.description,
      date: e.date instanceof Date ? e.date.toISOString().slice(0, 10) : String(e.date).slice(0, 10),
      time: e.time ?? "",
      venue: e.venue ?? "",
      category: e.category,
      brochureUrl: e.brochureUrl ?? "",
      isFeatured: e.isFeatured,
      registrationClosed: e.registrationClosed ?? false,
    });
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const body = {
        title: form.title,
        description: form.description,
        date: form.date,
        time: form.time || undefined,
        venue: form.venue || undefined,
        category: form.category,
        brochureUrl: form.brochureUrl || undefined,
        isFeatured: form.isFeatured === true,
        registrationClosed: form.registrationClosed === true,
      };
      if (editing) {
        const res = await fetch(`/api/admin/events/${editing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error(await res.text());
        const updated = await res.json();
        setEvents((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      } else {
        const res = await fetch("/api/admin/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error(await res.text());
        const created = await res.json();
        setEvents((prev) => [created, ...prev]);
      }
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this event?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setEvents((prev) => prev.filter((p) => p.id !== id));
    } catch {
      setError("Delete failed");
    } finally {
      setLoading(false);
    }
  }

  const dateStr = (d: Date) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div>
      <button
        type="button"
        onClick={openAdd}
        className="mb-4 rounded bg-ieee-red px-3 py-2 text-sm font-medium text-white hover:bg-ieee-red/90"
      >
        Add event
      </button>

      <div className="space-y-2">
        {events.map((ev) => (
          <div
            key={ev.id}
            className="flex items-center justify-between rounded border border-gray-200 bg-white px-4 py-3"
          >
            <div>
              <span className="font-medium">{ev.title}</span>
              <span className="ml-2 text-sm text-gray-500">{dateStr(ev.date)}</span>
              {ev.isFeatured && <span className="ml-2 text-xs text-ieee-red">Featured</span>}
              {ev.registrationClosed && <span className="ml-2 text-xs text-amber-600">Registration closed</span>}
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => openEdit(ev)} className="text-sm text-ieee-red hover:underline">
                Edit
              </button>
              <button type="button" onClick={() => handleDelete(ev.id)} className="text-sm text-red-600 hover:underline">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">{editing ? "Edit event" : "Add event"}</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  value={form.title as string}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  required
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={form.description as string}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  required
                  rows={3}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={form.date as string}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    required
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    value={form.time as string}
                    onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                    placeholder="10:00 AM"
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                <input
                  value={form.venue as string}
                  onChange={(e) => setForm((f) => ({ ...f, venue: e.target.value }))}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={form.category as string}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                >
                  {categories.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brochure URL</label>
                <input
                  type="url"
                  value={form.brochureUrl as string}
                  onChange={(e) => setForm((f) => ({ ...f, brochureUrl: e.target.value }))}
                  placeholder="https://..."
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.isFeatured === true}
                  onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))}
                />
                <span className="text-sm">Featured</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.registrationClosed === true}
                  onChange={(e) => setForm((f) => ({ ...f, registrationClosed: e.target.checked }))}
                />
                <span className="text-sm">Registration closed</span>
              </label>
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
