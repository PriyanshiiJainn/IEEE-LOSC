"use client";

import { useState } from "react";

type Person = {
  id: string;
  name: string;
  designation: string | null;
  email: string | null;
  phone: string | null;
  order: number;
};

type Props = { initialPeople: Person[] };

const EMPTY = { name: "", designation: "", email: "", phone: "", order: 0 };

export function ContactPeopleManager({ initialPeople }: Props) {
  const [people, setPeople] = useState(initialPeople);
  const [editing, setEditing] = useState<Person | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(EMPTY);

  function byOrder(a: Person, b: Person) {
    return a.order - b.order;
  }

  function openAdd() {
    setEditing(null);
    setError("");
    setForm({ ...EMPTY, order: people.length });
    setOpen(true);
  }

  function openEdit(p: Person) {
    setEditing(p);
    setError("");
    setForm({
      name: p.name,
      designation: p.designation ?? "",
      email: p.email ?? "",
      phone: p.phone ?? "",
      order: p.order,
    });
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const url = editing
        ? `/api/admin/contact-people/${editing.id}`
        : "/api/admin/contact-people";
      const res = await fetch(url, {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await res.text());
      const saved: Person = await res.json();

      setPeople((prev) =>
        (editing ? prev.map((p) => (p.id === saved.id ? saved : p)) : [...prev, saved]).sort(
          byOrder,
        ),
      );
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(p: Person) {
    if (!confirm(`Remove ${p.name} from the contact page?`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/contact-people/${p.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setPeople((prev) => prev.filter((x) => x.id !== p.id));
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
        Add person
      </button>

      {error && !open && <p className="mb-3 text-sm text-red-600">{error}</p>}

      {people.length === 0 ? (
        <p className="rounded border border-dashed border-gray-300 px-4 py-6 text-center text-sm text-gray-500">
          No contact people yet. Anyone you add here appears on the public contact page.
        </p>
      ) : (
        <div className="space-y-2">
          {people.map((p) => (
            <div
              key={p.id}
              className="flex items-start justify-between gap-4 rounded border border-gray-200 bg-white px-4 py-3"
            >
              <div className="min-w-0">
                <span className="font-medium text-gray-900">{p.name}</span>
                {p.designation && (
                  <span className="ml-2 text-sm text-gray-600">{p.designation}</span>
                )}
                <div className="mt-1 flex flex-wrap gap-x-4 text-sm text-gray-500">
                  {p.email && <span className="break-all">{p.email}</span>}
                  {p.phone && <span>{p.phone}</span>}
                </div>
              </div>
              <div className="flex shrink-0 gap-3">
                <button
                  type="button"
                  onClick={() => openEdit(p)}
                  className="text-sm text-ieee-red hover:underline"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(p)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-full w-full max-w-md overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">
              {editing ? "Edit person" : "Add person"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                  maxLength={200}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Designation
                </label>
                <input
                  value={form.designation}
                  onChange={(e) => setForm((f) => ({ ...f, designation: e.target.value }))}
                  maxLength={200}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  maxLength={200}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Contact number
                </label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  maxLength={200}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Order</label>
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, order: parseInt(e.target.value, 10) || 0 }))
                  }
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                />
                <p className="mt-1 text-xs text-gray-400">
                  Lower numbers appear first on the contact page.
                </p>
              </div>

              <p className="text-xs text-gray-400">
                Only the name is required. Anything you leave blank is simply left off the
                public page.
              </p>

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
