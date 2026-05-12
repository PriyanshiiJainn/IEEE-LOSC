"use client";

import { useState } from "react";

type Member = {
  id: string;
  name: string;
  classification: string;
  post: string | null;
  imageUrl: string | null;
  email: string | null;
  phone: string | null;
  linkedin: string | null;
  order: number;
};

type Props = {
  initialMembers: Member[];
  classifications: { value: string; label: string }[];
};

const emptyForm = {
  name: "",
  classification: "CORE",
  post: "",
  imageUrl: "",
  email: "",
  phone: "",
  linkedin: "",
  order: 0,
};

function formSignature(form: typeof emptyForm) {
  return JSON.stringify(form);
}

export function TeamManager({ initialMembers, classifications }: Props) {
  const [members, setMembers] = useState(initialMembers);
  const [editing, setEditing] = useState<Member | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [savedSignature, setSavedSignature] = useState(formSignature(emptyForm));
  const [savedOnce, setSavedOnce] = useState(false);

  function openAdd() {
    setEditing(null);
    setForm(emptyForm);
    setSavedSignature(formSignature(emptyForm));
    setSavedOnce(false);
    setError("");
    setOpen(true);
  }
  function openEdit(m: Member) {
    const nextForm = {
      name: m.name,
      classification: m.classification,
      post: m.post ?? "",
      imageUrl: m.imageUrl ?? "",
      email: m.email ?? "",
      phone: m.phone ?? "",
      linkedin: m.linkedin ?? "",
      order: m.order,
    };
    setEditing(m);
    setForm(nextForm);
    setSavedSignature(formSignature(nextForm));
    setSavedOnce(false);
    setError("");
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const body = {
        name: form.name,
        classification: form.classification,
        post: form.post || null,
        imageUrl: form.imageUrl || null,
        email: form.email || null,
        phone: form.phone || null,
        linkedin: form.linkedin || null,
        order: form.order,
      };
      if (editing) {
        const res = await fetch(`/api/admin/team/${editing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error(await res.text());
        const updated = await res.json();
        setMembers((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        const nextForm = {
          name: updated.name,
          classification: updated.classification,
          post: updated.post ?? "",
          imageUrl: updated.imageUrl ?? "",
          email: updated.email ?? "",
          phone: updated.phone ?? "",
          linkedin: updated.linkedin ?? "",
          order: updated.order ?? 0,
        };
        setForm(nextForm);
        setSavedSignature(formSignature(nextForm));
        setSavedOnce(true);
      } else {
        const res = await fetch("/api/admin/team", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error(await res.text());
        const created = await res.json();
        setMembers((prev) => [...prev, created].sort((a, b) => a.order - b.order));
        const nextForm = {
          name: created.name,
          classification: created.classification,
          post: created.post ?? "",
          imageUrl: created.imageUrl ?? "",
          email: created.email ?? "",
          phone: created.phone ?? "",
          linkedin: created.linkedin ?? "",
          order: created.order ?? 0,
        };
        setEditing(created);
        setForm(nextForm);
        setSavedSignature(formSignature(nextForm));
        setSavedOnce(true);
      }
      setError("");
    } catch (err) {
      if (err instanceof Error) {
        try {
          const parsed = JSON.parse(err.message);
          const details = parsed.details;
          if (details) {
            const msgs = Object.entries(details)
              .map(([k, v]) => `${k}: ${(v as string[])[0]}`)
              .join(", ");
            setError(msgs || parsed.error || "Failed");
          } else {
            setError(parsed.error || err.message);
          }
        } catch {
          setError(err.message);
        }
      } else {
        setError("Failed");
      }
    } finally {
      setLoading(false);
    }
  }

  const isDirty = formSignature(form) !== savedSignature;
  const showSavedState = savedOnce && !isDirty && !loading;

  async function handleDelete(id: string) {
    if (!confirm("Delete this member?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/team/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setMembers((prev) => prev.filter((p) => p.id !== id));
    } catch {
      setError("Delete failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button type="button" onClick={openAdd} className="mb-4 rounded bg-ieee-red px-3 py-2 text-sm font-medium text-white hover:bg-ieee-red/90">
        Add member
      </button>
      <div className="space-y-2">
        {members.map((m) => (
          <div key={m.id} className="flex items-center justify-between rounded border border-gray-200 bg-white px-4 py-3">
            <div>
              <span className="font-medium">{m.name}</span>
              <span className="ml-2 text-sm text-gray-500">{m.post ?? m.classification}</span>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => openEdit(m)} className="text-sm text-ieee-red hover:underline">Edit</button>
              <button type="button" onClick={() => handleDelete(m.id)} className="text-sm text-red-600 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">{editing ? "Edit member" : "Add member"}</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <textarea value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required rows={2} className="w-full rounded border border-gray-300 px-3 py-2 text-sm" />
                <p className="mt-1 text-xs text-gray-400">Press Enter to split the name across lines on the card</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Classification</label>
                <select value={form.classification} onChange={(e) => setForm((f) => ({ ...f, classification: e.target.value }))} className="w-full rounded border border-gray-300 px-3 py-2 text-sm">
                  {classifications.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Post</label>
                <textarea value={form.post} onChange={(e) => setForm((f) => ({ ...f, post: e.target.value }))} placeholder="e.g. Chair" rows={2} className="w-full rounded border border-gray-300 px-3 py-2 text-sm" />
                <p className="mt-1 text-xs text-gray-400">Supports markdown: **bold**, - bullets, blank line for new paragraph, Enter for line break</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input value={form.imageUrl} onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))} placeholder="/cropped-image.png or https://example.com/photo.jpg" className="w-full rounded border border-gray-300 px-3 py-2 text-sm" />
                <p className="mt-1 text-xs text-gray-400">For files in public, use root paths like /cropped-image.png</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="w-full rounded border border-gray-300 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="w-full rounded border border-gray-300 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                <input value={form.linkedin} onChange={(e) => setForm((f) => ({ ...f, linkedin: e.target.value }))} placeholder="https://linkedin.com/in/username" className="w-full rounded border border-gray-300 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                <input type="number" value={form.order} onChange={(e) => setForm((f) => ({ ...f, order: parseInt(e.target.value, 10) || 0 }))} className="w-full rounded border border-gray-300 px-3 py-2 text-sm" />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={loading || !isDirty}
                  className="rounded bg-ieee-red px-3 py-2 text-sm font-medium text-white hover:bg-ieee-red/90 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:hover:bg-gray-400"
                >
                  {loading ? "Saving…" : showSavedState ? "Saved" : "Save"}
                </button>
                <button type="button" onClick={() => setOpen(false)} className="rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
                {showSavedState && (
                  <button
                    type="button"
                    aria-label="Close editor"
                    onClick={() => setOpen(false)}
                    className="rounded border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
                  >
                    ×
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
