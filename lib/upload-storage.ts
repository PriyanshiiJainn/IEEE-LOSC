import fs from "fs/promises";
import path from "path";

export type UploadFolder = "pdfs" | "gallery";

export const MAX_PDF_BYTES = 25 * 1024 * 1024; // 25MB

export function sanitizeUploadFilename(name: string): string {
  const base = path.basename(name).replace(/[^a-zA-Z0-9.\-_]/g, "_");
  return base.length > 0 ? base : "file";
}

export function buildUploadFilename(originalName: string): string {
  return `${Date.now()}-${sanitizeUploadFilename(originalName)}`;
}

export function isPdfUpload(file: File, buffer: Buffer): boolean {
  if (file.type === "application/pdf") return true;
  if (file.name.toLowerCase().endsWith(".pdf")) return true;
  return buffer.length >= 4 && buffer.subarray(0, 4).toString("utf8") === "%PDF";
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
