import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";
import { isValidAcademicYear, sortAcademicYearsDesc } from "@/lib/utils";

const createSchema = z.object({
  year: z
    .string()
    .trim()
    .refine(isValidAcademicYear, "Use two consecutive years, e.g. 2026-27"),
});

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const rows = await prisma.academicYear.findMany({ select: { year: true } });
  return NextResponse.json(sortAcademicYearsDesc(rows.map((r) => r.year)));
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }
  try {
    const created = await prisma.academicYear.create({ data: { year: parsed.data.year } });
    revalidatePath("/team");
    revalidatePath("/contact");
    revalidatePath("/admin/team");
    return NextResponse.json(created);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "That academic year already exists." }, { status: 409 });
    }
    throw error;
  }
}
