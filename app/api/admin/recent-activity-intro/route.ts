import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";
import { noCacheJson } from "@/lib/cache-headers";

type RecentActivityIntroRow = {
  id: string;
  content: string;
};

type PrismaWithRecentActivityIntro = typeof prisma & {
  recentActivityIntro: {
    findFirst: () => Promise<RecentActivityIntroRow | null>;
    update: (args: {
      where: { id: string };
      data: { content: string };
    }) => Promise<RecentActivityIntroRow>;
    create: (args: { data: { content: string } }) => Promise<RecentActivityIntroRow>;
  };
};

const updateSchema = z.object({
  content: z.string(),
});

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = prisma as PrismaWithRecentActivityIntro;
  const row = await db.recentActivityIntro.findFirst();
  return noCacheJson(row);
}

export async function PUT(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const db = prisma as PrismaWithRecentActivityIntro;
  const existing = await db.recentActivityIntro.findFirst();
  if (existing) {
    const updated = await db.recentActivityIntro.update({
      where: { id: existing.id },
      data: parsed.data,
    });
    revalidatePath("/recent-activity");
    revalidatePath("/admin/recent-activity");
    return NextResponse.json(updated);
  }
  const created = await db.recentActivityIntro.create({ data: parsed.data });
  revalidatePath("/recent-activity");
  revalidatePath("/admin/recent-activity");
  return NextResponse.json(created);
}

