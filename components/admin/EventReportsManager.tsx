"use client";

import { useState } from "react";
import { MarkdownField } from "@/components/admin/MarkdownField";

// ── Types ────────────────────────────────────────────────────────────────────

export type Report = {
  id: string;
  eventId: string | null;
  title: string;
  content: string;
  coverImageUrl: string | null;
  pdfUrl: string | null;
  isMom: boolean;
  publishedAt: Date | string | null;
  event: { id: string; title: string } | null;
};

export type Notice = {
  id: string;
  title: string;
  content: string;
  pdfUrl: string | null;
  publishedAt: Date | string | null;
};

type Mode = "EVENT" | "MOM" | "NOTICE";

type Props = {
  initialReports: Report[];
  initialNotices: Notice[];
  events: { id: string; title: string }[];
};

// ── Helpers ──────────────────────────────────────────────────────────────────

const emptyForm = {
  eventId: "",
  title: "",
  content: "",
  coverImageUrl: "",
  pdfUrl: "",
  publishedAt: "",
};

function modalTitle(mode: Mode, isEditing: boolean): string {
  if (mode === "NOTICE") return isEditing ? "Edit Notice" : "Add Notice";
  if (mode === "MOM") return isEditing ? "Edit MOM" : "Add MOM";
  return isEditing ? "Edit Event Report" : "Add Event Report";
}

function pdfLabel(mode: Mode): string {
  if (mode === "MOM") return "PDF (required for MOM)";
  if (mode === "NOTICE") return "PDF (optional for notice)";
  return "PDF (optional for event report)";
}

function contentPlaceholder(mode: Mode): string {
  if (mode === "MOM") return "Write the meeting summary...";
  if (mode === "NOTICE") return "Write the notice content...";
  return "Write the event report summary...";
}

function fmtDate(d: Date | string | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ── Component ────────────────────────────────────────────────────────────────

export function EventReportsManager({ initialReports, initialNotices, events }: Props) {
  // ── State ──────────────────────────────────────────────────────────────────
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [notices, setNotices] = useState<Notice[]>(initialNotices);

  const [mode, setMode] = useState<Mode>("MOM");
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedPdfName, setSelectedPdfName] = useState("");
  const [form, setForm] = useState(emptyForm);

  // ── Open helpers ───────────────────────────────────────────────────────────
  function openAdd(m: Mode) {
    setMode(m);
    setEditingReport(null);
    setEditingNotice(null);
    setForm(emptyForm);
    setSelectedPdfName("");
    setError("");
    setOpen(true);
  }

  function openEditReport(r: Report) {
    setMode(r.isMom ? "MOM" : "EVENT");
    setEditingReport(r);
    setEditingNotice(null);
    setForm({
      eventId: r.eventId ?? "",
      title: r.title,
      content: r.content,
      coverImageUrl: r.coverImageUrl ?? "",
      pdfUrl: r.pdfUrl ?? "",
      publishedAt: r.publishedAt ? new Date(r.publishedAt).toISOString().slice(0, 10) : "",
    });
    setSelectedPdfName("");
    setError("");
    setOpen(true);
  }

  function openEditNotice(n: Notice) {
    setMode("NOTICE");
    setEditingNotice(n);
    setEditingReport(null);
    setForm({
      eventId: "",
      title: n.title,
      content: n.content,
      coverImageUrl: "",
      pdfUrl: n.pdfUrl ?? "",
      publishedAt: n.publishedAt ? new Date(n.publishedAt).toISOString().slice(0, 10) : "",
    });
    setSelectedPdfName("");
    setError("");
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
    setError("");
  }

  // ── PDF upload ─────────────────────────────────────────────────────────────
  async function handlePdfUpload(file: File) {
    setUploading(true);
    setError("");
    setSelectedPdfName(file.name);
    try {
      const fd = new FormData();
      fd.append("pdf", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
        cache: "no-store",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Upload failed");
      setForm((f) => ({ ...f, pdfUrl: data.url as string }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "PDF upload failed");
      setSelectedPdfName("");
    } finally {
      setUploading(false);
    }
  }

  // ── Submit ─────────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "NOTICE") {
        // ── Notice CRUD ──────────────────────────────────────────────────────
        const body = {
          title: form.title,
          content: form.content,
          pdfUrl: form.pdfUrl || null,
          publishedAt: form.publishedAt || null,
        };
        if (editingNotice) {
          const res = await fetch(`/api/admin/notices/${editingNotice.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
          if (!res.ok) throw new Error(await res.text());
          const updated: Notice = await res.json();
          setNotices((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
        } else {
          const res = await fetch("/api/admin/notices", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
          if (!res.ok) throw new Error(await res.text());
          const created: Notice = await res.json();
          setNotices((prev) => [created, ...prev]);
        }
      } else {
        // ── Report (MOM / Event) CRUD ────────────────────────────────────────
        const isMom = mode === "MOM";
        const normalizedPdfUrl = form.pdfUrl || null;
        if (isMom && !normalizedPdfUrl) {
          setError("Please upload a MOM PDF before saving.");
          setLoading(false);
          return;
        }
        const body = {
          eventId: form.eventId || null,
          title: form.title,
          content: form.content,
          coverImageUrl: form.coverImageUrl || null,
          pdfUrl: normalizedPdfUrl,
          isMom,
          publishedAt: form.publishedAt || null,
        };
        if (editingReport) {
          const res = await fetch(`/api/admin/event-reports/${editingReport.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
          if (!res.ok) throw new Error(await res.text());
          const updated = await res.json();
          const ev = updated.eventId ? events.find((e) => e.id === updated.eventId) : null;
          setReports((prev) =>
            prev.map((p) => (p.id === updated.id ? { ...updated, event: ev ?? null } : p)),
          );
        } else {
          const res = await fetch("/api/admin/event-reports", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
          if (!res.ok) throw new Error(await res.text());
          const created = await res.json();
          const ev = created.eventId ? events.find((e) => e.id === created.eventId) : null;
          setReports((prev) => [{ ...created, event: ev ?? null }, ...prev]);
        }
      }

      closeModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  // ── Delete helpers ─────────────────────────────────────────────────────────
  async function handleDeleteReport(id: string) {
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

  async function handleDeleteNotice(id: string) {
    if (!confirm("Delete this notice?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/notices/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setNotices((prev) => prev.filter((n) => n.id !== id));
    } catch {
      setError("Delete failed");
    } finally {
      setLoading(false);
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Action buttons */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => openAdd("EVENT")}
          className="rounded bg-ieee-navy px-3 py-2 text-sm font-medium text-white hover:bg-ieee-navy/90"
        >
          Add Event
        </button>
        <button
          type="button"
          onClick={() => openAdd("MOM")}
          className="rounded bg-ieee-red px-3 py-2 text-sm font-medium text-white hover:bg-ieee-red/90"
        >
          Add MOM
        </button>
        <button
          type="button"
          onClick={() => openAdd("NOTICE")}
          className="rounded bg-ieee-navy px-3 py-2 text-sm font-medium text-white hover:bg-ieee-navy/90"
        >
          Add Notice
        </button>
      </div>

      {error && !open && <p className="mb-3 text-sm text-red-600">{error}</p>}

      {/* ── Event Reports & MOMs list ──────────────────────────────────────── */}
      <div className="space-y-2">
        {reports.map((r) => (
          <div
            key={r.id}
            className="flex items-center justify-between rounded border border-gray-200 bg-white px-4 py-3"
          >
            <div className="min-w-0 flex-1">
              <span className="font-medium">{r.title}</span>
              {r.event?.title && (
                <span className="ml-2 text-sm text-gray-500">{r.event.title}</span>
              )}
              <span className="ml-2 text-xs text-gray-500">{r.isMom ? "MOM" : "Event Report"}</span>
              {r.pdfUrl && <span className="ml-2 text-xs text-green-600">PDF attached</span>}
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2 ml-4">
              {r.pdfUrl && (
                <>
                  <a
                    href={r.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-ieee-navy hover:underline"
                  >
                    View PDF
                  </a>
                  <a href={r.pdfUrl} download className="text-sm text-ieee-red hover:underline">
                    Download
                  </a>
                </>
              )}
              <button
                type="button"
                onClick={() => openEditReport(r)}
                className="text-sm text-ieee-red hover:underline"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDeleteReport(r.id)}
                className="text-sm text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Notices list ──────────────────────────────────────────────────── */}
      {notices.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Notices
          </h3>
          <div className="space-y-2">
            {notices.map((n) => (
              <div
                key={n.id}
                className="flex items-center justify-between rounded border border-gray-200 bg-white px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <span className="font-medium">{n.title}</span>
                  {n.publishedAt && (
                    <span className="ml-2 text-sm text-gray-500">{fmtDate(n.publishedAt)}</span>
                  )}
                  <span className="ml-2 text-xs text-gray-500">Notice</span>
                  {n.pdfUrl && <span className="ml-2 text-xs text-green-600">PDF attached</span>}
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2 ml-4">
                  {n.pdfUrl && (
                    <>
                      <a
                        href={n.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-ieee-navy hover:underline"
                      >
                        View PDF
                      </a>
                      <a href={n.pdfUrl} download className="text-sm text-ieee-red hover:underline">
                        Download
                      </a>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => openEditNotice(n)}
                    className="text-sm text-ieee-red hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteNotice(n.id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Modal ─────────────────────────────────────────────────────────── */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              {modalTitle(mode, mode === "NOTICE" ? !!editingNotice : !!editingReport)}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Link to event — only for MOM / Event Report */}
              {mode !== "NOTICE" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link to event{" "}
                    <span className="font-normal text-gray-500">(optional)</span>
                  </label>
                  <select
                    value={form.eventId}
                    onChange={(e) => setForm((f) => ({ ...f, eventId: e.target.value }))}
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                  >
                    <option value="">None — standalone entry</option>
                    {events.map((ev) => (
                      <option key={ev.id} value={ev.id}>
                        {ev.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

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

              {/* Content */}
              <MarkdownField
                label="Content"
                value={form.content}
                onChange={(v) => setForm((f) => ({ ...f, content: v }))}
                required
                rows={6}
                placeholder={contentPlaceholder(mode)}
              />

              {/* PDF */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {pdfLabel(mode)}
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    id="report-pdf-file"
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void handlePdfUpload(file);
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
                        const input = document.getElementById(
                          "report-pdf-file",
                        ) as HTMLInputElement | null;
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
                  <div className="mt-3 space-y-2">
                    <p className="text-xs text-green-600">PDF attached</p>
                    <div className="rounded border border-gray-200 overflow-hidden bg-gray-50">
                      <iframe
                        src={form.pdfUrl}
                        title="PDF preview"
                        className="w-full h-48 border-0"
                      />
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={form.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-ieee-navy underline"
                      >
                        Open
                      </a>
                      <a href={form.pdfUrl} download className="text-xs text-ieee-red underline">
                        Download
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Published date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Published date
                </label>
                <input
                  type="date"
                  value={form.publishedAt}
                  onChange={(e) => setForm((f) => ({ ...f, publishedAt: e.target.value }))}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

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
                  onClick={closeModal}
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
