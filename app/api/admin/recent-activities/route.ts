import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";
import { optionalMediaUrlSchema } from "@/lib/media-url";

type RecentActivityRow = {
  id: string;
  title: string;
  content: string;
  pdfUrl: string | null;
  publishedAt: Date | null;
};

type PrismaWithRecentActivities = typeof prisma & {
  recentActivity: {
    findMany: (args: { orderBy: { publishedAt: "asc" | "desc" } }) => Promise<RecentActivityRow[]>;
    create: (args: {
      data: {
        title: string;
        content: string;
        pdfUrl?: string | null;
        publishedAt: Date | null;
      };
    }) => Promise<RecentActivityRow>;
  };
};

const createSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string(),
  pdfUrl: optionalMediaUrlSchema,
  publishedAt: z.string().optional().nullable(),
});

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = prisma as PrismaWithRecentActivities;
  const activities = await db.recentActivity.findMany({
    orderBy: { publishedAt: "desc" },
  });
  return NextResponse.json(activities);
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
    const db = prisma as PrismaWithRecentActivities;
    const activity = await db.recentActivity.create({ data });
    revalidatePath("/recent-activity");
    revalidatePath("/admin/recent-activity");
    return NextResponse.json(activity);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to create activity";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
