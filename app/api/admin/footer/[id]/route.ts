import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";

const updateSchema = z.object({
  label: z.string().min(1).max(100).optional(),
  url: z.string().url().optional(),
  order: z.number().int().optional(),
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
  const link = await prisma.footerLink.update({
    where: { id },
    data: parsed.data,
  });
  revalidatePath("/", "layout");
  revalidatePath("/admin/footer");
  return NextResponse.json(link);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await prisma.footerLink.delete({ where: { id } });
  revalidatePath("/", "layout");
  revalidatePath("/admin/footer");
  return NextResponse.json({ ok: true });
}
