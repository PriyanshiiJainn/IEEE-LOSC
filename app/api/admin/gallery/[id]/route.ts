import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";

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
  caption: z.string().min(1).max(300).optional(),
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

  return NextResponse.json(image);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const db = prisma as PrismaWithGallery;
  await db.galleryImage.delete({
    where: { id },
  });

  return NextResponse.json({ ok: true });
}

