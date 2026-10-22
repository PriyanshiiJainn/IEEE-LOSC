import { serveUploadedImage } from "@/lib/serve-upload";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await params;
  return serveUploadedImage("event-images", segments);
}
