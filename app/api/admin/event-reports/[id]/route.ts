import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";
import { optionalMediaUrlSchema } from "@/lib/media-url";

const updateSchema = z.object({
  eventId: z.string().min(1).optional().nullable(),
  title: z.string().min(1).max(200).optional(),
  content: z.string().optional(),
  coverImageUrl: optionalMediaUrlSchema,
  pdfUrl: optionalMediaUrlSchema,
  isMom: z.boolean().optional(),
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
    const data: Record<string, unknown> = {
      ...parsed.data,
      ...(parsed.data.eventId !== undefined && {
        eventId: parsed.data.eventId || null,
      }),
    };
    if (parsed.data.publishedAt !== undefined)
      data.publishedAt = parsed.data.publishedAt ? new Date(parsed.data.publishedAt) : null;
    const report = await prisma.eventReport.update({
      where: { id },
      data,
    });
    revalidatePath("/event-reports");
    revalidatePath("/admin/event-reports");
    return NextResponse.json(report);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to update report";
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
  await prisma.eventReport.delete({ where: { id } });
  revalidatePath("/event-reports");
  revalidatePath("/admin/event-reports");
  return NextResponse.json({ ok: true });
}
