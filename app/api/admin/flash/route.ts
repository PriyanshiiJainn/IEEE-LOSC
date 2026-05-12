import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";

const createSchema = z.object({
  eventId: z.string().optional().nullable(),
  title: z.string().min(1).max(200),
  shortMessage: z.string().max(500).optional().nullable(),
  link: z.string().url().optional().nullable(),
  active: z.boolean().optional(),
});

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const items = await prisma.flashAnnouncement.findMany({
    include: { event: { select: { id: true, title: true } } },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  if (parsed.data.active) {
    await prisma.flashAnnouncement.updateMany({ data: { active: false } });
  }
  const flash = await prisma.flashAnnouncement.create({ data: parsed.data });
  revalidatePath("/", "layout");
  revalidatePath("/admin/flash");
  return NextResponse.json(flash);
}
