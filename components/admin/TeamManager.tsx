"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MarkdownField } from "@/components/admin/MarkdownField";

type Member = {
  id: string;
  name: string;
  classification: string;
  academicYear: string;
  category: string | null;
  post: string | null;
  imageUrl: string | null;
  email: string | null;
  phone: string | null;
  linkedin: string | null;
  order: number;
};

type Props = {
  /** Members of `academicYear` only — the page filters by year on the server. */
  initialMembers: Member[];
  classifications: { value: string; label: string }[];
  years: string[];
  academicYear: string;
  /** Existing category names per classification, offered while typing. */
  categorySuggestions: Record<string, string[]>;
};

function makeEmptyForm(academicYear: string) {
  return {
    name: "",
    classification: "CORE",
    academicYear,
    category: "",
    post: "",
    imageUrl: "",
    email: "",
    phone: "",
    linkedin: "",
    order: 0,
  };
}

type Form = ReturnType<typeof makeEmptyForm>;

const MAX_IMAGE_BYTES = 15 * 1024 * 1024;

function toForm(m: Member): Form {
  return {
    name: m.name,
    classification: m.classification,
    academicYear: m.academicYear,
    category: m.category ?? "",
    post: m.post ?? "",
    imageUrl: m.imageUrl ?? "",
    email: m.email ?? "",
    phone: m.phone ?? "",
    linkedin: m.linkedin ?? "",
    order: m.order ?? 0,
  };
}

function formSignature(form: Form) {
  return JSON.stringify(form);
}

/** Mirrors how the public team page groups members, so the admin list matches it. */
function groupMembers(members: Member[], classifications: { value: string; label: string }[]) {
  return classifications
    .map((c) => {
      const inClass = members.filter((m) => m.classification === c.value);
      const byCategory = new Map<string, Member[]>();
      for (const m of inClass) {
        const category = m.category?.trim();
        if (!category) continue;
        const existing = byCategory.get(category);
        if (existing) existing.push(m);
        else byCategory.set(category, [m]);
      }
      return {
        label: c.label,
        total: inClass.length,
        uncategorized: inClass.filter((m) => !m.category?.trim()),
        categories: [...byCategory.entries()]
          .map(([name, list]) => ({ name, members: list }))
          .sort(
            (a, b) =>
              Math.min(...a.members.map((m) => m.order)) -
                Math.min(...b.members.map((m) => m.order)) || a.name.localeCompare(b.name),
          ),
      };
    })
    .filter((group) => group.total > 0);
}

export function TeamManager({
  initialMembers,
  classifications,
  years,
  academicYear,
  categorySuggestions,
}: Props) {
  const router = useRouter();
  const [members, setMembers] = useState(initialMembers);
  const [editing, setEditing] = useState<Member | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<Form>(() => makeEmptyForm(academicYear));
  const [savedSignature, setSavedSignature] = useState(() =>
    formSignature(makeEmptyForm(academicYear)),
  );
  const [savedOnce, setSavedOnce] = useState(false);
  const [uploading, setUploading] = useState(false);

  const groups = groupMembers(members, classifications);
  const suggestions = categorySuggestions[form.classification] ?? [];
  const classificationLabel =
    classifications.find((c) => c.value === form.classification)?.label ?? "this section";

  function openAdd() {
    const nextForm = makeEmptyForm(academicYear);
    setEditing(null);
    setForm(nextForm);
    setSavedSignature(formSignature(nextForm));
    setSavedOnce(false);
    setError("");
    setOpen(true);
  }

  function openEdit(m: Member) {
    const nextForm = toForm(m);
    setEditing(m);
    setForm(nextForm);
    setSavedSignature(formSignature(nextForm));
    setSavedOnce(false);
    setError("");
    setOpen(true);
  }

  /** Upload a photo and point the Image URL field at the stored file. */
  async function handleImageUpload(file: File | null | undefined) {
    if (!file) return;
    setError("");
    if (file.size > MAX_IMAGE_BYTES) {
      setError("Image is too large. Max size is 15MB.");
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      fd.append("folder", "team");
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
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  /** Keep the list showing only the year this page is editing. */
  function syncMembers(updater: (prev: Member[]) => Member[]) {
    setMembers((prev) =>
      updater(prev)
        .filter((m) => m.academicYear === academicYear)
        .sort((a, b) => a.order - b.order),
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const body = {
        name: form.name,
        classification: form.classification,
        academicYear: form.academicYear,
        category: form.category.trim() || null,
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
        const updated: Member = await res.json();
        syncMembers((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        setForm(toForm(updated));
        setSavedSignature(formSignature(toForm(updated)));
        setSavedOnce(true);
      } else {
        const res = await fetch("/api/admin/team", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error(await res.text());
        const created: Member = await res.json();
        syncMembers((prev) => [...prev, created]);
        setEditing(created);
        setForm(toForm(created));
        setSavedSignature(formSignature(toForm(created)));
        setSavedOnce(true);
      }
      setError("");
      // Refresh the year counts and category suggestions rendered on the server.
      router.refresh();
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
      syncMembers((prev) => prev.filter((p) => p.id !== id));
      router.refresh();
    } catch {
      setError("Delete failed");
    } finally {
      setLoading(false);
    }
  }

  function memberRow(m: Member) {
    return (
      <div
        key={m.id}
        className="flex items-center justify-between rounded border border-gray-200 bg-white px-4 py-3"
      >
        <div>
          <span className="font-medium">{m.name}</span>
          <span className="ml-2 text-sm text-gray-500">{m.post ?? m.classification}</span>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => openEdit(m)} className="text-sm text-ieee-red hover:underline">Edit</button>
          <button type="button" onClick={() => handleDelete(m.id)} className="text-sm text-red-600 hover:underline">Delete</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button type="button" onClick={openAdd} className="mb-4 rounded bg-ieee-red px-3 py-2 text-sm font-medium text-white hover:bg-ieee-red/90">
        Add member to {academicYear}
      </button>

      {members.length === 0 ? (
        <p className="rounded border border-dashed border-gray-300 bg-white px-4 py-8 text-center text-sm text-gray-500">
          No members yet for {academicYear}. Add one to start building this year&apos;s team.
        </p>
      ) : (
        <div className="space-y-8">
          {groups.map((group) => (
            <div key={group.label}>
              <h2 className="mb-3 border-b border-gray-200 pb-2 text-sm font-semibold uppercase tracking-wide text-gray-600">
                {group.label}
              </h2>
              <div className="space-y-2">{group.uncategorized.map(memberRow)}</div>
              {group.categories.map((category) => (
                <div key={category.name} className="mt-4">
                  <h3 className="mb-2 text-sm font-medium text-ieee-navy">{category.name}</h3>
                  <div className="space-y-2">{category.members.map(memberRow)}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

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
                <label className="block text-sm font-medium text-gray-700 mb-1">Academic year</label>
                <select value={form.academicYear} onChange={(e) => setForm((f) => ({ ...f, academicYear: e.target.value }))} className="w-full rounded border border-gray-300 px-3 py-2 text-sm">
                  {years.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
                <p className="mt-1 text-xs text-gray-400">Which year&apos;s team this member appears in</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Classification</label>
                <select value={form.classification} onChange={(e) => setForm((f) => ({ ...f, classification: e.target.value }))} className="w-full rounded border border-gray-300 px-3 py-2 text-sm">
                  {classifications.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category (optional)</label>
                <input
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  list="team-category-suggestions"
                  placeholder="e.g. Sponsorship Team"
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                />
                <datalist id="team-category-suggestions">
                  {suggestions.map((c) => <option key={c} value={c} />)}
                </datalist>
                <p className="mt-1 text-xs text-gray-400">
                  Sub-heading under {classificationLabel} on the team page. Pick an existing one or type a new
                  name to create it for {form.academicYear}. Leave blank to list the member directly under the
                  section heading.
                </p>
              </div>
              <MarkdownField
                label="Post"
                value={form.post}
                onChange={(v) => setForm((f) => ({ ...f, post: v }))}
                placeholder="e.g. Chair"
                rows={2}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
                <div className="flex items-start gap-3">
                  {form.imageUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={form.imageUrl}
                      alt=""
                      className="h-20 w-20 shrink-0 rounded-full border border-gray-300 object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-dashed border-gray-300 text-xs text-gray-400">
                      No photo
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploading}
                      onChange={(e) => {
                        void handleImageUpload(e.target.files?.[0]);
                        e.target.value = "";
                      }}
                      className="block w-full text-sm text-gray-700"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      {uploading
                        ? "Uploading…"
                        : "Upload a photo (max 15MB, JPG/PNG/WebP). It is stored with the site's other images."}
                    </p>
                    {form.imageUrl && !uploading && (
                      <button
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, imageUrl: "" }))}
                        className="mt-1 text-xs text-red-600 hover:underline"
                      >
                        Remove photo
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input value={form.imageUrl} onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))} placeholder="/cropped-image.png or https://example.com/photo.jpg" className="w-full rounded border border-gray-300 px-3 py-2 text-sm" />
                <p className="mt-1 text-xs text-gray-400">Filled in automatically when you upload. You can still paste a path or link by hand — for files in public, use root paths like /cropped-image.png</p>
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
                <p className="mt-1 text-xs text-gray-400">Also orders the categories — the lowest order in a category comes first</p>
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={loading || uploading || !isDirty}
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
