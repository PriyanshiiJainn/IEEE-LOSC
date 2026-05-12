"use client";

import { useState } from "react";

type GalleryImage = {
  id: string;
  imageUrl: string;
  caption: string;
  order: number;
};

type Props = {
  initialImages: GalleryImage[];
};

export function GalleryManager({ initialImages }: Props) {
  const [images, setImages] = useState<GalleryImage[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [caption, setCaption] = useState("");
  const [order, setOrder] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!file) {
      setError("Please choose an image file");
      return;
    }

    try {
      setUploading(true);
      const fd = new FormData();
      fd.append("image", file);

      const uploadRes = await fetch("/api/upload-image", {
        method: "POST",
        body: fd,
        cache: "no-store",
      });
      const uploadJson = await uploadRes.json();
      if (!uploadRes.ok) {
        throw new Error(uploadJson.error || "Upload failed");
      }

      const imageUrl = uploadJson.url as string;

      setSaving(true);
      const body = {
        imageUrl,
        caption: caption.trim(),
        order: order ? Number(order) : 0,
      };
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Save failed");
      }

      setImages((prev) => [...prev, json]);
      setCaption("");
      setOrder("");
      setFile(null);
      (document.getElementById("gallery-file") as HTMLInputElement | null)?.value && ((document.getElementById("gallery-file") as HTMLInputElement).value = "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setUploading(false);
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this image from gallery?")) return;
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error("Delete failed");
      }
      setImages((prev) => prev.filter((img) => img.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  }

  async function handleCaptionChange(id: string, nextCaption: string) {
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption: nextCaption.trim() }),
      });
      if (!res.ok) {
        throw new Error("Failed to update caption");
      }
      const updated = await res.json();
      setImages((prev) => prev.map((img) => (img.id === id ? updated : img)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update caption");
    }
  }

  async function handleOrderChange(id: string, value: string) {
    const num = Number(value);
    if (Number.isNaN(num)) return;
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: num }),
      });
      if (!res.ok) {
        throw new Error("Failed to update order");
      }
      const updated = await res.json();
      setImages((prev) =>
        prev
          .map((img) => (img.id === id ? updated : img))
          .sort((a, b) => a.order - b.order || a.caption.localeCompare(b.caption))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update order");
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-ieee-navy">Add gallery image</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="gallery-file">
            Image file
          </label>
          <input
            id="gallery-file"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-700"
          />
          <p className="mt-1 text-xs text-gray-500">Max size 15MB. JPG/PNG/WebP recommended.</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Caption (optional)</label>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            placeholder="Short description of the image (or leave blank)"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Order (optional)</label>
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            className="w-32 rounded border border-gray-300 px-3 py-2 text-sm"
            placeholder="0"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={uploading || saving}
          className="rounded bg-ieee-red px-3 py-2 text-sm font-medium text-white hover:bg-ieee-red/90 disabled:opacity-50"
        >
          {uploading || saving ? "Uploading…" : "Add to gallery"}
        </button>
      </form>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-ieee-navy">Existing images</h2>
        {images.length === 0 && (
          <p className="text-sm text-gray-500">No gallery images yet. Add some using the form above.</p>
        )}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img) => (
            <div key={img.id} className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm flex flex-col gap-2">
              <img
                src={img.imageUrl}
                alt={img.caption}
                className="h-40 w-full rounded-md object-cover"
              />
              <label className="block text-xs font-medium text-gray-600" htmlFor={`gallery-caption-${img.id}`}>
                Caption
              </label>
              <input
                key={`${img.id}:${img.caption}`}
                id={`gallery-caption-${img.id}`}
                type="text"
                defaultValue={img.caption}
                onBlur={(e) => {
                  const v = e.target.value;
                  if (v !== img.caption) handleCaptionChange(img.id, v);
                }}
                className="w-full rounded border border-gray-300 px-2 py-1 text-sm text-gray-900"
                placeholder="Short description"
                maxLength={300}
              />
              <div className="flex items-center justify-between gap-2">
                <label className="flex items-center gap-1 text-xs text-gray-600">
                  <span>Order:</span>
                  <input
                    type="number"
                    defaultValue={img.order}
                    onBlur={(e) => handleOrderChange(img.id, e.target.value)}
                    className="w-16 rounded border border-gray-300 px-1 py-0.5 text-xs"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => handleDelete(img.id)}
                  className="text-xs text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

