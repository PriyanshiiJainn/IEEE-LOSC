import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";

type GalleryImageRow = {
  id: string;
  imageUrl: string;
  caption: string;
  order: number;
  createdAt: Date;
};

type PrismaWithGallery = typeof prisma & {
  galleryImage: {
    update: (args: {
      where: { id: string };
      data: { caption?: string; order?: number };
    }) => Promise<GalleryImageRow>;
    delete: (args: { where: { id: string } }) => Promise<GalleryImageRow>;
  };
};

const updateSchema = z.object({
  caption: z.string().max(300).optional(),
  order: z.number().int().optional(),
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
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const db = prisma as PrismaWithGallery;
  const image = await db.galleryImage.update({
    where: { id },
    data: parsed.data,
  });

  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");

  return NextResponse.json(image);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  if (!id?.trim()) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const db = prisma as PrismaWithGallery;
  const removed = await db.galleryImage.deleteMany({
    where: { id },
  });

  if (removed.count === 0) {
    return NextResponse.json(
      { error: "Gallery image not found. Refresh the page if it still appears." },
      { status: 404 }
    );
  }

  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");

  return NextResponse.json({ ok: true });
}

