import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";
import { optionalMediaUrlSchema } from "@/lib/media-url";
import { noCacheJson } from "@/lib/cache-headers";

const createSchema = z.object({
  title: z.string().min(1).max(191),
  content: z.string(),
  pdfUrl: optionalMediaUrlSchema,
  publishedAt: z.string().optional().nullable(),
});

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const notices = await prisma.notice.findMany({ orderBy: { publishedAt: "desc" } });
  return noCacheJson(notices);
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  try {
    const { publishedAt, pdfUrl, ...rest } = parsed.data;
    const notice = await prisma.notice.create({
      data: {
        ...rest,
        pdfUrl: pdfUrl ?? null,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
      },
    });
    revalidatePath("/notices");
    revalidatePath("/event-reports");
    revalidatePath("/admin/event-reports");
    return NextResponse.json(notice);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to create notice";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
