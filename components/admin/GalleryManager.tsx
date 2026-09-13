"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type GalleryImage = {
  id: string;
  imageUrl: string;
  caption: string;
  order: number;
};

type Props = {
  initialImages: GalleryImage[];
};

const MAX_GALLERY_BATCH = 8;
const MAX_IMAGE_BYTES = 15 * 1024 * 1024;

export function GalleryManager({ initialImages }: Props) {
  const router = useRouter();
  const [images, setImages] = useState<GalleryImage[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [caption, setCaption] = useState("");
  const [order, setOrder] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [uploadStep, setUploadStep] = useState<{ current: number; total: number } | null>(null);

  function validateAndSetFiles(list: FileList | null) {
    setError("");
    if (!list?.length) {
      setFiles([]);
      return;
    }
    const picked = Array.from(list).slice(0, MAX_GALLERY_BATCH);
    if (list.length > MAX_GALLERY_BATCH) {
      setError(`You can add at most ${MAX_GALLERY_BATCH} images at once. Only the first ${MAX_GALLERY_BATCH} were kept.`);
    }
    const oversize = picked.filter((f) => f.size > MAX_IMAGE_BYTES);
    if (oversize.length > 0) {
      setError(
        `Each image must be 15MB or smaller. Over limit: ${oversize.map((f) => f.name).join(", ")}`
      );
      setFiles([]);
      return;
    }
    setFiles(picked);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (files.length === 0) {
      setError("Please choose one or more image files");
      return;
    }

    const baseOrder = order.trim() === "" ? 0 : Number(order);
    if (order.trim() !== "" && Number.isNaN(baseOrder)) {
      setError("Order must be a valid number");
      return;
    }

    try {
      setUploading(true);
      setUploadStep({ current: 0, total: files.length });

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadStep({ current: i + 1, total: files.length });

        const fd = new FormData();
        fd.append("image", file);

        const uploadRes = await fetch("/api/upload-image", {
          method: "POST",
          body: fd,
          cache: "no-store",
          credentials: "include",
        });
        const uploadJson = await uploadRes.json();
        if (!uploadRes.ok) {
          throw new Error(uploadJson.error || `Upload failed for “${file.name}”`);
        }

        const imageUrl = uploadJson.url as string;

        setSaving(true);
        const body = {
          imageUrl,
          caption: caption.trim(),
          order: baseOrder + i,
        };
        const res = await fetch("/api/admin/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.error || `Save failed for “${file.name}”`);
        }

        setImages((prev) => [...prev, json]);
      }

      setCaption("");
      setOrder("");
      setFiles([]);
      const input = document.getElementById("gallery-file") as HTMLInputElement | null;
      if (input) input.value = "";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setUploading(false);
      setSaving(false);
      setUploadStep(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this image from gallery?")) return;
    try {
      const res = await fetch(`/api/admin/gallery/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };

      if (res.status === 404) {
        setImages((prev) => prev.filter((img) => img.id !== id));
        router.refresh();
        return;
      }

      if (!res.ok) {
        throw new Error(json.error || "Delete failed");
      }

      setImages((prev) => prev.filter((img) => img.id !== id));
      router.refresh();
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
        <h2 className="text-lg font-semibold text-ieee-navy">Add gallery images</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="gallery-file">
            Image files
          </label>
          <input
            id="gallery-file"
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => validateAndSetFiles(e.target.files)}
            className="block w-full text-sm text-gray-700"
          />
          <p className="mt-1 text-xs text-gray-500">
            Up to {MAX_GALLERY_BATCH} images at once; each file at most 15MB. JPG/PNG/WebP recommended.
            {files.length > 0 ? ` ${files.length} file${files.length === 1 ? "" : "s"} selected.` : ""}
          </p>
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
          <p className="mt-1 text-xs text-gray-500">
            With multiple images, order increases by 1 for each file (e.g. 10 → 10, 11, 12…).
          </p>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={uploading || saving}
          className="rounded bg-ieee-red px-3 py-2 text-sm font-medium text-white hover:bg-ieee-red/90 disabled:opacity-50"
        >
          {uploading || saving
            ? uploadStep
              ? `Uploading ${uploadStep.current} of ${uploadStep.total}…`
              : "Uploading…"
            : files.length > 1
              ? `Add ${files.length} to gallery`
              : "Add to gallery"}
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
                loading="lazy"
                decoding="async"
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

