"use client";

import { useState } from "react";

export type Report = {
  id: string;
  eventId: string;
  title: string;
  content: string;
  coverImageUrl: string | null;
  pdfUrl: string | null;
  publishedAt: Date | string | null;
  event: { id: string; title: string };
};

type Props = {
  initialReports: Report[];
  events: { id: string; title: string }[];
};

export function EventReportsManager({ initialReports, events }: Props) {
  const [reports, setReports] = useState(initialReports);
  const [editing, setEditing] = useState<Report | null>(null);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"EVENT" | "MOM">("MOM");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedPdfName, setSelectedPdfName] = useState("");
  const empty = { eventId: events[0]?.id ?? "", title: "", content: "", coverImageUrl: "", pdfUrl: "", publishedAt: "" };
  const [form, setForm] = useState(empty);

  function openAddMom() {
    setMode("MOM");
    setEditing(null);
    setForm({ ...empty, eventId: events[0]?.id ?? "" });
    setError("");
    setOpen(true);
  }

  function openAddEventReport() {
    setMode("EVENT");
    setEditing(null);
    setForm({ ...empty, eventId: events[0]?.id ?? "", pdfUrl: "" });
    setError("");
    setOpen(true);
  }
  function openEdit(r: Report) {
    setMode(r.pdfUrl ? "MOM" : "EVENT");
    setEditing(r);
    setForm({
      eventId: r.eventId,
      title: r.title,
      content: r.content,
      coverImageUrl: r.coverImageUrl ?? "",
      pdfUrl: r.pdfUrl ?? "",
      publishedAt: r.publishedAt ? new Date(r.publishedAt).toISOString().slice(0, 10) : "",
    });
    setOpen(true);
  }

  async function handlePdfUpload(file: File) {
    setUploading(true);
    setError("");
    setSelectedPdfName(file.name);
    try {
      const formData = new FormData();
      formData.append("pdf", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Upload failed");
      setForm((f) => ({ ...f, pdfUrl: data.url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "PDF upload failed");
      setSelectedPdfName("");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const normalizedPdfUrl = mode === "MOM" ? (form.pdfUrl || null) : null;
      if (mode === "MOM" && !normalizedPdfUrl) {
        setError("Please upload a MOM PDF before saving.");
        return;
      }
      const body = {
        eventId: form.eventId,
        title: form.title,
        content: form.content,
        coverImageUrl: form.coverImageUrl || null,
        pdfUrl: normalizedPdfUrl,
        publishedAt: form.publishedAt || null,
      };
      if (editing) {
        const res = await fetch(`/api/admin/event-reports/${editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        if (!res.ok) throw new Error(await res.text());
        const updated = await res.json();
        setReports((prev) => prev.map((p) => (p.id === updated.id ? { ...updated, event: editing.event } : p)));
      } else {
        const res = await fetch("/api/admin/event-reports", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        if (!res.ok) throw new Error(await res.text());
        const created = await res.json();
        const ev = events.find((e) => e.id === created.eventId);
        setReports((prev) => [{ ...created, event: ev ?? { id: created.eventId, title: "" } }, ...prev]);
      }
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this report entry?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/event-reports/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setReports((prev) => prev.filter((p) => p.id !== id));
    } catch {
      setError("Delete failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <button type="button" onClick={openAddEventReport} className="rounded bg-ieee-navy px-3 py-2 text-sm font-medium text-white hover:bg-ieee-navy/90">Add Event</button>
        <button type="button" onClick={openAddMom} className="rounded bg-ieee-red px-3 py-2 text-sm font-medium text-white hover:bg-ieee-red/90">Add MOM</button>
      </div>
      <div className="space-y-2">
        {reports.map((r) => (
          <div key={r.id} className="flex items-center justify-between rounded border border-gray-200 bg-white px-4 py-3">
            <div>
              <span className="font-medium">{r.title}</span>
              <span className="ml-2 text-sm text-gray-500">{r.event?.title}</span>
              <span className="ml-2 text-xs text-gray-500">{r.pdfUrl ? "MOM" : "Event Report"}</span>
              {r.pdfUrl && <span className="ml-2 text-xs text-green-600">PDF attached</span>}
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => openEdit(r)} className="text-sm text-ieee-red hover:underline">Edit</button>
              <button type="button" onClick={() => handleDelete(r.id)} className="text-sm text-red-600 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              {editing ? `Edit ${mode === "MOM" ? "MOM" : "Event Report"}` : mode === "MOM" ? "Add MOM" : "Add Event Report"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event</label>
                <select value={form.eventId} onChange={(e) => setForm((f) => ({ ...f, eventId: e.target.value }))} required className="w-full rounded border border-gray-300 px-3 py-2 text-sm">
                  {events.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required className="w-full rounded border border-gray-300 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} required rows={5} className="w-full rounded border border-gray-300 px-3 py-2 text-sm" placeholder={mode === "MOM" ? "Write the meeting summary..." : "Write the event report summary..."} />
                <p className="mt-1 text-xs text-gray-400">Supports markdown: **bold**, - bullets, blank line for new paragraph</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PDF {mode === "MOM" ? "(required for MOM)" : "(optional)"}
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    id="mom-pdf-file"
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handlePdfUpload(file);
                    }}
                    className="text-sm"
                  />
                  {uploading && <span className="text-xs text-gray-500">Uploading...</span>}
                  {form.pdfUrl && !uploading && (
                    <button
                      type="button"
                      onClick={() => {
                        setForm((f) => ({ ...f, pdfUrl: "" }));
                        setSelectedPdfName("");
                        const input = document.getElementById("mom-pdf-file") as HTMLInputElement | null;
                        if (input) input.value = "";
                      }}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Remove PDF
                    </button>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500">Upload a PDF to attach with this entry.</p>
                {selectedPdfName && (
                  <p className="mt-1 text-xs text-gray-600">Selected: {selectedPdfName}</p>
                )}
                {form.pdfUrl && (
                  <p className="mt-1 text-xs text-green-600">
                    Attached:{" "}
                    <a href={form.pdfUrl} target="_blank" rel="noopener noreferrer" className="underline">
                      {form.pdfUrl}
                    </a>
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Published date</label>
                <input type="date" value={form.publishedAt} onChange={(e) => setForm((f) => ({ ...f, publishedAt: e.target.value }))} className="w-full rounded border border-gray-300 px-3 py-2 text-sm" />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex gap-2 pt-2">
                <button type="submit" disabled={loading || uploading} className="rounded bg-ieee-red px-3 py-2 text-sm font-medium text-white hover:bg-ieee-red/90 disabled:opacity-50">{loading ? "Saving…" : "Save"}</button>
                <button type="button" onClick={() => setOpen(false)} className="rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
