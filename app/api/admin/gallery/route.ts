import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";
import { noCacheJson } from "@/lib/cache-headers";

type GalleryImageRow = {
  id: string;
  imageUrl: string;
  caption: string;
  order: number;
  createdAt: Date;
};

type PrismaWithGallery = typeof prisma & {
  galleryImage: {
    findMany: (args: {
      orderBy: Array<{ order: "asc" | "desc" } | { createdAt: "asc" | "desc" }>;
    }) => Promise<GalleryImageRow[]>;
    create: (args: {
      data: { imageUrl: string; caption: string; order: number };
    }) => Promise<GalleryImageRow>;
  };
};

const createSchema = z.object({
  imageUrl: z.string().min(1),
  caption: z.string().max(300),
  order: z.number().int().optional(),
});

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = prisma as PrismaWithGallery;
  const images = await db.galleryImage.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  return noCacheJson(images);
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { imageUrl, caption, order } = parsed.data;

  const db = prisma as PrismaWithGallery;
  const image = await db.galleryImage.create({
    data: {
      imageUrl,
      caption,
      order: typeof order === "number" ? order : 0,
    },
  });

  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");

  return NextResponse.json(image);
}

