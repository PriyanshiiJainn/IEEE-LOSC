import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";

const updateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().optional(),
  pdfUrl: z.string().optional().nullable(),
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
    const activity = await (prisma as any).recentActivity.update({
      where: { id },
      data,
    });
    return NextResponse.json(activity);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to update activity";
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
  await (prisma as any).recentActivity.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
