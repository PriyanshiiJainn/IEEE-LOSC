import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import type { ImageUploadFolder } from "@/lib/upload-storage";

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
};

/**
 * Stream an uploaded image from public/{folder}.
 *
 * `next start` only serves files that were in public/ at build time, so images
 * uploaded on the server afterwards 404 unless a route like this serves them.
 */
export function serveUploadedImage(folder: ImageUploadFolder, segments: string[] | undefined) {
  if (!segments?.length || segments.some((s) => s.includes(".."))) {
    return new NextResponse("Not found", { status: 404 });
  }

  const filePath = path.join(process.cwd(), "public", folder, ...segments);
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    return new NextResponse("Not found", { status: 404 });
  }

  const stat = fs.statSync(filePath);
  const filename = segments[segments.length - 1];
  const ext = path.extname(filename).toLowerCase();
  const contentType = MIME[ext] ?? "application/octet-stream";

  const stream = fs.createReadStream(filePath);
  const webStream = new ReadableStream({
    start(controller) {
      stream.on("data", (chunk) => controller.enqueue(chunk));
      stream.on("end", () => controller.close());
      stream.on("error", (err) => controller.error(err));
    },
  });

  return new NextResponse(webStream, {
    headers: {
      "Content-Type": contentType,
      "Content-Length": String(stat.size),
      "Content-Disposition": `inline; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
