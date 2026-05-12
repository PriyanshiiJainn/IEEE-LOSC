import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";

const updateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  date: z.string().optional(),
  time: z.string().max(50).optional().nullable(),
  venue: z.string().max(200).optional().nullable(),
  category: z.enum(["WORKSHOP", "HACKATHON", "QUIZ", "WEBINAR", "INVITED_TALK"]).optional(),
  brochureUrl: z.string().url().optional().nullable(),
  isFeatured: z.boolean().optional(),
  registrationClosed: z.boolean().optional(),
  registrationStatus: z.enum(["OPEN", "SOON", "CLOSED"]).optional(),
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
  const raw = parsed.data;
  const data = {
    ...raw,
    ...(raw.date && { date: new Date(raw.date) }),
  };
  const event = await prisma.event.update({ where: { id }, data });
  revalidatePath("/events");
  revalidatePath("/admin/events");
  return NextResponse.json(event);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await prisma.event.delete({ where: { id } });
  revalidatePath("/events");
  revalidatePath("/admin/events");
  return NextResponse.json({ ok: true });
}
