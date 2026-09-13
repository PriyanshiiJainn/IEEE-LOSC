import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";
import { noCacheJson } from "@/lib/cache-headers";

const createSchema = z.object({
  label: z.string().min(1).max(100),
  url: z.string().url(),
  order: z.number().int().optional(),
});

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const links = await prisma.footerLink.findMany({ orderBy: { order: "asc" } });
  return noCacheJson(links);
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const link = await prisma.footerLink.create({ data: parsed.data });
  revalidatePath("/", "layout");
  revalidatePath("/admin/footer");
  return NextResponse.json(link);
}
