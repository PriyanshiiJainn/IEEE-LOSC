"use client";

import { useState } from "react";
import { MarkdownField } from "@/components/admin/MarkdownField";

export type Notice = {
  id: string;
  title: string;
  content: string;
  pdfUrl: string | null;
  publishedAt: Date | string | null;
};

type Props = {
  initialNotices: Notice[];
};

type Form = {
  title: string;
  content: string;
  pdfUrl: string;
  publishedAt: string;
};

function makeEmpty(): Form {
  return { title: "", content: "", pdfUrl: "", publishedAt: "" };
}

function toForm(n: Notice): Form {
  return {
    title: n.title,
    content: n.content,
    pdfUrl: n.pdfUrl ?? "",
    publishedAt: n.publishedAt ? new Date(n.publishedAt).toISOString().slice(0, 10) : "",
  };
}

export function NoticesManager({ initialNotices }: Props) {
  const [notices, setNotices] = useState<Notice[]>(initialNotices);
  const [editing, setEditing] = useState<Notice | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedPdfName, setSelectedPdfName] = useState("");
  const [form, setForm] = useState<Form>(makeEmpty());

  function openAdd() {
    setEditing(null);
    setForm(makeEmpty());
    setSelectedPdfName("");
    setError("");
    setOpen(true);
  }

  function openEdit(n: Notice) {
    setEditing(n);
    setForm(toForm(n));
    setSelectedPdfName("");
    setError("");
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
    setError("");
  }

  // ── PDF upload ───────────────────────────────────────────────────────────────
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

  // ── Form submit ──────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const body = {
        title: form.title,
        content: form.content,
        pdfUrl: form.pdfUrl || null,
        publishedAt: form.publishedAt || null,
      };
      if (editing) {
        const res = await fetch(`/api/admin/notices/${editing.id}`, {
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
      closeModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  // ── Delete ───────────────────────────────────────────────────────────────────
  async function handleDelete(id: string) {
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

  const dateStr = (d: Date | string | null) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "";

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div>
      <button
        type="button"
        onClick={openAdd}
        className="mb-4 rounded bg-ieee-red px-3 py-2 text-sm font-medium text-white hover:bg-ieee-red/90"
      >
        Add Notice
      </button>

      {error && !open && <p className="mb-3 text-sm text-red-600">{error}</p>}

      {/* Notice list */}
      <div className="space-y-2">
        {notices.map((n) => (
          <div
            key={n.id}
            className="flex items-center justify-between rounded border border-gray-200 bg-white px-4 py-3"
          >
            <div className="min-w-0 flex-1">
              <span className="font-medium">{n.title}</span>
              <span className="ml-2 text-sm text-gray-500">{dateStr(n.publishedAt)}</span>
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
                onClick={() => openEdit(n)}
                className="text-sm text-ieee-red hover:underline"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(n.id)}
                className="text-sm text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {notices.length === 0 && (
          <p className="rounded border border-dashed border-gray-300 bg-white px-4 py-8 text-center text-sm text-gray-500">
            No notices yet. Add one to get started.
          </p>
        )}
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              {editing ? "Edit Notice" : "Add Notice"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  required
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Notice title"
                />
              </div>

              {/* Content */}
              <MarkdownField
                label="Content"
                value={form.content}
                onChange={(v) => setForm((f) => ({ ...f, content: v }))}
                required
                rows={6}
                placeholder="Write the notice content..."
              />

              {/* PDF upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PDF <span className="font-normal text-gray-500">(optional)</span>
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    id="notice-pdf-file"
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
                        const input = document.getElementById("notice-pdf-file") as HTMLInputElement | null;
                        if (input) input.value = "";
                      }}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Remove PDF
                    </button>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500">Upload a PDF to attach with this notice.</p>
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
                      <a href={form.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-ieee-navy underline">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Published date</label>
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
