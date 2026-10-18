import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { noCacheJson } from "@/lib/cache-headers";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";
import { optionalMediaUrlSchema, normalizeMediaUrl } from "@/lib/media-url";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const activities = await prisma.recentActivity.findMany({
    orderBy: { publishedAt: "desc" },
    include: { images: { orderBy: { order: "asc" } } },
  });
  return noCacheJson(activities);
}

const createSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string(),
  pdfUrl: optionalMediaUrlSchema,
  publishedAt: z.string().optional().nullable(),
  imageUrls: z.array(z.string()).optional().default([]),
});

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  try {
    const { imageUrls, ...rest } = parsed.data;
    const activity = await prisma.recentActivity.create({
      data: {
        ...rest,
        publishedAt: rest.publishedAt ? new Date(rest.publishedAt) : null,
        images: {
          create: imageUrls
            .map((url) => normalizeMediaUrl(url))
            .filter((url): url is string => url !== null)
            .map((imageUrl, idx) => ({ imageUrl, order: idx })),
        },
      },
      include: { images: { orderBy: { order: "asc" } } },
    });
    revalidatePath("/recent-activity");
    revalidatePath("/admin/recent-activity");
    return NextResponse.json(activity);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to create activity";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
