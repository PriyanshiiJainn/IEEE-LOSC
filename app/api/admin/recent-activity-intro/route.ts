import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";

const updateSchema = z.object({
  content: z.string(),
});

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const row = await (prisma as any).recentActivityIntro.findFirst();
  return NextResponse.json(row);
}

export async function PUT(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const existing = await (prisma as any).recentActivityIntro.findFirst();
  if (existing) {
    const updated = await (prisma as any).recentActivityIntro.update({
      where: { id: existing.id },
      data: parsed.data,
    });
    return NextResponse.json(updated);
  }
  const created = await (prisma as any).recentActivityIntro.create({ data: parsed.data });
  return NextResponse.json(created);
}

