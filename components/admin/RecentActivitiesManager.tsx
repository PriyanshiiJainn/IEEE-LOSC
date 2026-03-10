"use client";

import { useState } from "react";

export type Activity = {
  id: string;
  title: string;
  content: string;
  pdfUrl: string | null;
  publishedAt: Date | string | null;
};

type Props = {
  initialActivities: Activity[];
};

export function RecentActivitiesManager({ initialActivities }: Props) {
  const [activities, setActivities] = useState(initialActivities);
  const [editing, setEditing] = useState<Activity | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const empty = { title: "", content: "", pdfUrl: "", publishedAt: "" };
  const [form, setForm] = useState(empty);

  function openAdd() {
    setEditing(null);
    setForm({ ...empty });
    setOpen(true);
  }
  function openEdit(a: Activity) {
    setEditing(a);
    setForm({
      title: a.title,
      content: a.content,
      pdfUrl: a.pdfUrl ?? "",
      publishedAt: a.publishedAt ? new Date(a.publishedAt).toISOString().slice(0, 10) : "",
    });
    setOpen(true);
  }

  async function handlePdfUpload(file: File) {
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("pdf", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setForm((f) => ({ ...f, pdfUrl: data.url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "PDF upload failed");
    } finally {
      setUploading(false);
    }
  }

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
        const res = await fetch(`/api/admin/recent-activities/${editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        if (!res.ok) throw new Error(await res.text());
        const updated = await res.json();
        setActivities((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
      } else {
        const res = await fetch("/api/admin/recent-activities", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        if (!res.ok) throw new Error(await res.text());
        const created = await res.json();
        setActivities((prev) => [created, ...prev]);
      }
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this activity?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/recent-activities/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setActivities((prev) => prev.filter((a) => a.id !== id));
    } catch {
      setError("Delete failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button type="button" onClick={openAdd} className="mb-4 rounded bg-ieee-red px-3 py-2 text-sm font-medium text-white hover:bg-ieee-red/90">Add activity</button>
      <div className="space-y-2">
        {activities.map((a) => (
          <div key={a.id} className="flex items-center justify-between rounded border border-gray-200 bg-white px-4 py-3">
            <div>
              <span className="font-medium">{a.title}</span>
              {a.pdfUrl && <span className="ml-2 text-xs text-green-600">PDF attached</span>}
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => openEdit(a)} className="text-sm text-ieee-red hover:underline">Edit</button>
              <button type="button" onClick={() => handleDelete(a.id)} className="text-sm text-red-600 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">{editing ? "Edit activity" : "Add activity"}</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required className="w-full rounded border border-gray-300 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} required rows={5} className="w-full rounded border border-gray-300 px-3 py-2 text-sm" placeholder="Describe the activity..." />
                <p className="mt-1 text-xs text-gray-400">Supports markdown: **bold**, - bullets, blank line for new paragraph</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PDF</label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handlePdfUpload(file);
                    }}
                    className="text-sm"
                  />
                  {uploading && <span className="text-xs text-gray-500">Uploading…</span>}
                </div>
                {form.pdfUrl && (
                  <p className="mt-1 text-xs text-green-600">
                    Attached: <a href={form.pdfUrl} target="_blank" rel="noopener noreferrer" className="underline">{form.pdfUrl}</a>
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
