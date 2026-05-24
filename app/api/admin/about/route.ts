import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";
import { noCacheJson } from "@/lib/cache-headers";

const updateSchema = z.object({
  aboutUs: z.string(),
  aboutOptica: z.string(),
  recentUpdates: z.string(),
});

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const row = await prisma.aboutContent.findFirst();
  return noCacheJson(row);
}

export async function PUT(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const existing = await prisma.aboutContent.findFirst();
  if (existing) {
    const updated = await prisma.aboutContent.update({
      where: { id: existing.id },
      data: parsed.data,
    });
    revalidatePath("/");
    revalidatePath("/admin/about");
    return NextResponse.json(updated);
  }
  const created = await prisma.aboutContent.create({ data: parsed.data });
  revalidatePath("/");
  revalidatePath("/admin/about");
  return NextResponse.json(created);
}
