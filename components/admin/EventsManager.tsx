"use client";

import { useState } from "react";
import { MarkdownField } from "@/components/admin/MarkdownField";

type Event = {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string | null;
  venue: string | null;
  category: string;
  brochureUrl: string | null;
  imageUrl: string | null;
  isFeatured: boolean;
  registrationClosed: boolean;
  registrationStatus: string;
};

type Props = {
  initialEvents: Event[];
  categories: { value: string; label: string }[];
};

type Form = {
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: string;
  brochureUrl: string;
  imageUrl: string;
  isFeatured: boolean;
  registrationClosed: boolean;
  registrationStatus: string;
};

const MAX_IMAGE_BYTES = 15 * 1024 * 1024;

function makeEmpty(): Form {
  return {
    title: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    category: "WORKSHOP",
    brochureUrl: "",
    imageUrl: "",
    isFeatured: false,
    registrationClosed: false,
    registrationStatus: "OPEN",
  };
}

function toForm(e: Event): Form {
  return {
    title: e.title,
    description: e.description,
    date: e.date instanceof Date ? e.date.toISOString().slice(0, 10) : String(e.date).slice(0, 10),
    time: e.time ?? "",
    venue: e.venue ?? "",
    category: e.category,
    brochureUrl: e.brochureUrl ?? "",
    imageUrl: e.imageUrl ?? "",
    isFeatured: e.isFeatured,
    registrationClosed: e.registrationClosed ?? false,
    registrationStatus: e.registrationStatus ?? "OPEN",
  };
}

export function EventsManager({ initialEvents, categories }: Props) {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [editing, setEditing] = useState<Event | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<Form>(makeEmpty());
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  function openAdd() {
    setEditing(null);
    setForm(makeEmpty());
    setError("");
    setUploadError("");
    setOpen(true);
  }

  function openEdit(e: Event) {
    setEditing(e);
    setForm(toForm(e));
    setError("");
    setUploadError("");
    setOpen(true);
  }

  // ── Image upload ─────────────────────────────────────────────────────────────
  async function handleImageUpload(file: File | null | undefined) {
    if (!file) return;
    setUploadError("");
    if (file.size > MAX_IMAGE_BYTES) {
      setUploadError("Image is too large. Max 15 MB.");
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      fd.append("folder", "events");
      const res = await fetch("/api/upload-image", {
        method: "POST",
        body: fd,
        cache: "no-store",
        credentials: "include",
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Upload failed");
      setForm((f) => ({ ...f, imageUrl: json.url as string }));
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  // ── Form submit ──────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    setOpen(false);
    try {
      const body = {
        title: form.title,
        description: form.description,
        date: form.date,
        time: form.time || undefined,
        venue: form.venue || undefined,
        category: form.category,
        brochureUrl: form.brochureUrl || undefined,
        imageUrl: form.imageUrl || undefined,
        isFeatured: form.isFeatured,
        registrationClosed: form.registrationClosed,
        registrationStatus: form.registrationStatus || "OPEN",
      };
      if (editing) {
        const res = await fetch(`/api/admin/events/${editing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error(await res.text());
        const updated: Event = await res.json();
        setEvents((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      } else {
        const res = await fetch("/api/admin/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error(await res.text());
        const created: Event = await res.json();
        setEvents((prev) => [created, ...prev]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  // ── Delete ───────────────────────────────────────────────────────────────────
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

  const dateStr = (d: Date) =>
    new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  const registrationIsOpen =
    form.registrationStatus === "OPEN" && form.registrationClosed !== true;

  return (
    <div>
      <button
        type="button"
        onClick={openAdd}
        className="mb-4 rounded bg-ieee-red px-3 py-2 text-sm font-medium text-white hover:bg-ieee-red/90"
      >
        Add event
      </button>

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      {/* Event list */}
      <div className="space-y-2">
        {events.map((ev) => (
          <div
            key={ev.id}
            className="flex items-center justify-between rounded border border-gray-200 bg-white px-4 py-3"
          >
            <div className="min-w-0 flex-1">
              <span className="font-medium">{ev.title}</span>
              <span className="ml-2 text-sm text-gray-500">{dateStr(ev.date)}</span>
              {ev.isFeatured && <span className="ml-2 text-xs text-ieee-red">Featured</span>}
              {ev.imageUrl && <span className="ml-2 text-xs text-green-600">Image</span>}
              <span className="ml-2 text-xs text-gray-600">
                {ev.registrationStatus === "SOON"
                  ? "Registration soon"
                  : ev.registrationStatus === "CLOSED" || ev.registrationClosed
                    ? "Registration closed"
                    : "Registration open"}
              </span>
            </div>
            <div className="flex shrink-0 gap-2 ml-4">
              <button type="button" onClick={() => openEdit(ev)} className="text-sm text-ieee-red hover:underline">
                Edit
              </button>
              <button type="button" onClick={() => handleDelete(ev.id)} className="text-sm text-red-600 hover:underline">
                Delete
              </button>
            </div>
          </div>
        ))}
        {events.length === 0 && (
          <p className="rounded border border-dashed border-gray-300 bg-white px-4 py-8 text-center text-sm text-gray-500">
            No events yet.
          </p>
        )}
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">{editing ? "Edit event" : "Add event"}</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  required
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              {/* Description */}
              <MarkdownField
                label="Description"
                value={form.description}
                onChange={(v) => setForm((f) => ({ ...f, description: v }))}
                required
                rows={5}
              />

              {/* Date + Time */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    required
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    value={form.time}
                    onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                    placeholder="10:00 AM"
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>

              {/* Venue */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                <input
                  value={form.venue}
                  onChange={(e) => setForm((f) => ({ ...f, venue: e.target.value }))}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                >
                  {categories.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              {/* ── Event image ──────────────────────────────────────────── */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event image (shown on the right side of the card)
                </label>
                <div className="flex items-start gap-3">
                  {form.imageUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={form.imageUrl}
                      alt="Event preview"
                      className="h-24 w-36 shrink-0 rounded border border-gray-200 object-cover"
                    />
                  ) : (
                    <div className="flex h-24 w-36 shrink-0 items-center justify-center rounded border border-dashed border-gray-300 text-xs text-gray-400">
                      No image
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <label
                      className={`cursor-pointer inline-block rounded border border-dashed border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:border-ieee-red hover:text-ieee-red transition ${
                        uploading ? "opacity-50 pointer-events-none" : ""
                      }`}
                    >
                      {uploading ? "Uploading…" : "Upload image"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploading}
                        onChange={(e) => {
                          void handleImageUpload(e.target.files?.[0]);
                          e.target.value = "";
                        }}
                      />
                    </label>
                    <p className="mt-1 text-xs text-gray-400">JPG/PNG/WebP, max 15 MB</p>
                    {form.imageUrl && (
                      <button
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, imageUrl: "" }))}
                        className="mt-1 text-xs text-red-600 hover:underline block"
                      >
                        Remove image
                      </button>
                    )}
                  </div>
                </div>
                {uploadError && <p className="mt-1 text-xs text-red-600">{uploadError}</p>}
                {/* Manual URL fallback */}
                <input
                  value={form.imageUrl}
                  onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                  placeholder="Or paste an image URL / path"
                  className="mt-2 w-full rounded border border-gray-300 px-3 py-2 text-xs text-gray-600"
                />
              </div>

              {/* Brochure URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brochure URL</label>
                <input
                  type="url"
                  value={form.brochureUrl}
                  onChange={(e) => setForm((f) => ({ ...f, brochureUrl: e.target.value }))}
                  placeholder="https://..."
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              {/* Featured */}
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))}
                />
                <span className="text-sm">Featured</span>
              </label>

              {/* Registration status */}
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={registrationIsOpen}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setForm((f) => {
                      if (checked) return { ...f, registrationClosed: false, registrationStatus: "OPEN" };
                      const next = f.registrationStatus === "OPEN" ? "SOON" : f.registrationStatus;
                      return { ...f, registrationClosed: true, registrationStatus: next };
                    });
                  }}
                />
                <span className="text-sm">Registration open</span>
              </label>
              {!registrationIsOpen && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Registration unavailable</label>
                  <select
                    value={form.registrationStatus === "OPEN" ? "SOON" : form.registrationStatus}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, registrationClosed: true, registrationStatus: e.target.value }))
                    }
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                  >
                    <option value="SOON">Registration soon</option>
                    <option value="CLOSED">Registration closed</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-400">
                    When unavailable, the register button is disabled.
                  </p>
                </div>
              )}

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={loading || uploading}
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
