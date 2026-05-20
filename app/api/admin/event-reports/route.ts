import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";
import { optionalMediaUrlSchema } from "@/lib/media-url";

const createSchema = z.object({
  eventId: z.string().min(1),
  title: z.string().min(1).max(200),
  content: z.string(),
  coverImageUrl: optionalMediaUrlSchema,
  pdfUrl: optionalMediaUrlSchema,
  isMom: z.boolean().optional(),
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
  try {
    const data = {
      ...parsed.data,
      publishedAt: parsed.data.publishedAt ? new Date(parsed.data.publishedAt) : null,
    };
    // One report per event (eventId is unique). Upsert so MOM PDF can be added to an existing entry.
    const report = await prisma.eventReport.upsert({
      where: { eventId: parsed.data.eventId },
      create: data,
      update: data,
    });
    revalidatePath("/event-reports");
    revalidatePath("/admin/event-reports");
    return NextResponse.json(report);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to create report";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
