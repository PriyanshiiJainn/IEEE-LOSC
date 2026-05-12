import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";

const updateSchema = z.object({
  eventId: z.string().optional().nullable(),
  title: z.string().min(1).max(200).optional(),
  shortMessage: z.string().max(500).optional().nullable(),
  link: z.string().url().optional().nullable(),
  active: z.boolean().optional(),
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
  if (parsed.data.active === true) {
    await prisma.flashAnnouncement.updateMany({
      where: { id: { not: id } },
      data: { active: false },
    });
  }
  const flash = await prisma.flashAnnouncement.update({
    where: { id },
    data: parsed.data,
  });
  revalidatePath("/", "layout");
  revalidatePath("/admin/flash");
  return NextResponse.json(flash);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await prisma.flashAnnouncement.delete({ where: { id } });
  revalidatePath("/", "layout");
  revalidatePath("/admin/flash");
  return NextResponse.json({ ok: true });
}
