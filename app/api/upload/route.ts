import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-utils";
import { noCacheJson } from "@/lib/cache-headers";
import {
  isPdfUpload,
  MAX_PDF_BYTES,
  saveUploadedFile,
} from "@/lib/upload-storage";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("pdf") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (file.size > MAX_PDF_BYTES) {
      return NextResponse.json(
        { error: "PDF is too large. Max size is 25MB." },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (!isPdfUpload(file, buffer)) {
      return NextResponse.json({ error: "Only PDF allowed" }, { status: 400 });
    }

    const { url } = await saveUploadedFile("pdfs", buffer, file.name, "application/pdf");

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
