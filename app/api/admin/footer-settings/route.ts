import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";

type FooterSettingsRow = {
  id: string;
  copyrightText: string;
  linksHeading: string;
};

type FooterSettingsData = {
  copyrightText: string;
  linksHeading: string;
};

type PrismaWithFooterSettings = typeof prisma & {
  footerSettings: {
    findFirst: () => Promise<FooterSettingsRow | null>;
    update: (args: {
      where: { id: string };
      data: FooterSettingsData;
    }) => Promise<FooterSettingsRow>;
    create: (args: { data: FooterSettingsData }) => Promise<FooterSettingsRow>;
  };
};

const updateSchema = z.object({
  copyrightText: z.string().min(1).max(300),
  linksHeading: z.string().max(100),
});

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = prisma as PrismaWithFooterSettings;
  const row = await db.footerSettings.findFirst();
  return NextResponse.json(row);
}

export async function PUT(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const db = prisma as PrismaWithFooterSettings;
  const existing = await db.footerSettings.findFirst();
  const row = existing
    ? await db.footerSettings.update({ where: { id: existing.id }, data: parsed.data })
    : await db.footerSettings.create({ data: parsed.data });

  revalidatePath("/", "layout");
  revalidatePath("/admin/footer");
  return NextResponse.json(row);
}
