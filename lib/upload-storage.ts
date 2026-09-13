import fs from "fs/promises";
import path from "path";

export type UploadFolder = "pdfs" | "gallery" | "team";

/** Folders the image upload endpoint will write to. */
export const IMAGE_UPLOAD_FOLDERS = ["gallery", "team"] as const;

export type ImageUploadFolder = (typeof IMAGE_UPLOAD_FOLDERS)[number];

export function isImageUploadFolder(value: unknown): value is ImageUploadFolder {
  return typeof value === "string" && (IMAGE_UPLOAD_FOLDERS as readonly string[]).includes(value);
}

export const MAX_PDF_BYTES = 25 * 1024 * 1024; // 25MB

export function sanitizeUploadFilename(name: string): string {
  const base = path.basename(name).replace(/[^a-zA-Z0-9.\-_]/g, "_");
  return base.length > 0 ? base : "file";
}

export function buildUploadFilename(originalName: string): string {
  return `${Date.now()}-${sanitizeUploadFilename(originalName)}`;
}

/**
 * A real PDF, judged by its contents rather than its name.
 *
 * The declared type and the .pdf extension are both trivially wrong — renaming
 * notes.txt to notes.pdf used to be enough to get it stored and then embedded
 * in the viewer on the public page, where it simply fails to display. The
 * "%PDF" signature is the thing that actually decides it; a few bytes of
 * leading junk are tolerated the way PDF readers do.
 */
export function isPdfUpload(_file: File, buffer: Buffer): boolean {
  return buffer.subarray(0, 1024).includes("%PDF");
}

export function isImageUpload(file: File): boolean {
  if (file.type.startsWith("image/")) return true;
  return /\.(jpe?g|png|gif|webp|avif|svg)$/i.test(file.name);
}

async function saveToFilesystem(
  folder: UploadFolder,
  filename: string,
  buffer: Buffer,
): Promise<string> {
  const uploadDir = path.resolve(process.cwd(), "public", folder);
  await fs.mkdir(uploadDir, { recursive: true });

  const filepath = path.resolve(uploadDir, filename);
  const relative = path.relative(uploadDir, filepath);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error("Invalid upload path");
  }

  await fs.writeFile(filepath, buffer);
  return `/${folder}/${filename}`;
}

async function saveToBlob(
  folder: UploadFolder,
  filename: string,
  buffer: Buffer,
  contentType: string | undefined,
): Promise<string> {
  const { put } = await import("@vercel/blob");
  const pathname = `${folder}/${filename}`;
  const blob = await put(pathname, buffer, {
    access: "public",
    contentType: contentType || undefined,
  });
  return blob.url;
}

/** Persist upload to Vercel Blob when configured, else public/{folder} (local / VPS). */
export async function saveUploadedFile(
  folder: UploadFolder,
  buffer: Buffer,
  originalName: string,
  contentType?: string,
): Promise<{ url: string }> {
  const filename = buildUploadFilename(originalName);

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const url = await saveToBlob(folder, filename, buffer, contentType);
    return { url };
  }

  const url = await saveToFilesystem(folder, filename, buffer);
  return { url };
}
