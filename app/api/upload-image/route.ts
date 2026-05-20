import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-utils";
import { noCacheJson } from "@/lib/cache-headers";
import { isImageUpload, saveUploadedFile } from "@/lib/upload-storage";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

const MAX_SIZE_BYTES = 15 * 1024 * 1024; // 15MB

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!isImageUpload(file)) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: "Image is too large. Max size is 15MB." },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const { url } = await saveUploadedFile("gallery", buffer, file.name, file.type || undefined);

    return noCacheJson({
      message: "Upload successful",
      url,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 500 },
    );
  }
}
