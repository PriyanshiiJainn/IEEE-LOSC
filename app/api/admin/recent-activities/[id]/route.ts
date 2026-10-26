import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";
import { optionalMediaUrlSchema, normalizeMediaUrl } from "@/lib/media-url";

const updateSchema = z.object({
  title: z.string().min(1).max(191).optional(),
  content: z.string().optional(),
  pdfUrl: optionalMediaUrlSchema,
  publishedAt: z.string().optional().nullable(),
  /** When present, fully replaces the activity's image list. */
  imageUrls: z.array(z.string()).optional(),
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
  try {
    const { imageUrls, ...rest } = parsed.data;

    const data: Record<string, unknown> = { ...rest };
    if (rest.publishedAt !== undefined)
      data.publishedAt = rest.publishedAt ? new Date(rest.publishedAt) : null;

    // If imageUrls was sent, replace all images in a transaction
    if (imageUrls !== undefined) {
      const normalized = imageUrls
        .map((url) => normalizeMediaUrl(url))
        .filter((url): url is string => url !== null);

      const activity = await prisma.$transaction(async (tx) => {
        await tx.recentActivityImage.deleteMany({ where: { activityId: id } });
        if (normalized.length > 0) {
          await tx.recentActivityImage.createMany({
            data: normalized.map((imageUrl, idx) => ({ activityId: id, imageUrl, order: idx })),
          });
        }
        return tx.recentActivity.update({
          where: { id },
          data,
          include: { images: { orderBy: { order: "asc" } } },
        });
      });

      revalidatePath("/recent-activity");
      revalidatePath("/admin/recent-activity");
      return NextResponse.json(activity);
    }

    // No imageUrls — just update activity fields
    const activity = await prisma.recentActivity.update({
      where: { id },
      data,
      include: { images: { orderBy: { order: "asc" } } },
    });
    revalidatePath("/recent-activity");
    revalidatePath("/admin/recent-activity");
    return NextResponse.json(activity);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to update activity";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await prisma.recentActivity.delete({ where: { id } });
  revalidatePath("/recent-activity");
  revalidatePath("/admin/recent-activity");
  return NextResponse.json({ ok: true });
}
