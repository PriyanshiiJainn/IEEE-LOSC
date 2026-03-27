import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";

const createSchema = z.object({
  imageUrl: z.string().min(1),
  caption: z.string().max(300),
  order: z.number().int().optional(),
});

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const images = await (prisma as any).galleryImage.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(images);
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

  const image = await (prisma as any).galleryImage.create({
    data: {
      imageUrl,
      caption,
      order: typeof order === "number" ? order : 0,
    },
  });

  return NextResponse.json(image);
}

