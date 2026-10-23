import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";
import { optionalMediaUrlSchema } from "@/lib/media-url";

const updateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().optional(),
  pdfUrl: optionalMediaUrlSchema,
  publishedAt: z.string().optional().nullable(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await request.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  try {
    const data: Record<string, unknown> = { ...parsed.data };
    if (parsed.data.publishedAt !== undefined)
      data.publishedAt = parsed.data.publishedAt ? new Date(parsed.data.publishedAt) : null;
    const notice = await prisma.notice.update({ where: { id }, data });
    revalidatePath("/notices");
    revalidatePath("/admin/notices");
    return NextResponse.json(notice);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to update notice";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await prisma.notice.delete({ where: { id } });
  revalidatePath("/notices");
  revalidatePath("/admin/notices");
  return NextResponse.json({ ok: true });
}
