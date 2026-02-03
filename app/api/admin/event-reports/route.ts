import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";

const createSchema = z.object({
  eventId: z.string().min(1),
  title: z.string().min(1).max(200),
  content: z.string(),
  coverImageUrl: z.string().url().optional().nullable(),
  publishedAt: z.string().optional().nullable(),
});

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const reports = await prisma.eventReport.findMany({
    include: { event: { select: { id: true, title: true } } },
    orderBy: { publishedAt: "desc" },
  });
  return NextResponse.json(reports);
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const data = {
    ...parsed.data,
    publishedAt: parsed.data.publishedAt ? new Date(parsed.data.publishedAt) : null,
  };
  const report = await prisma.eventReport.create({ data });
  return NextResponse.json(report);
}
