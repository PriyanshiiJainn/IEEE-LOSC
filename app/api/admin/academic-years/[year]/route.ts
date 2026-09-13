import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";

/** Removing a year is only safe while nothing is published under it. */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ year: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { year } = await params;
  const decoded = decodeURIComponent(year);

  const members = await prisma.teamMember.count({ where: { academicYear: decoded } });
  if (members > 0) {
    return NextResponse.json(
      { error: `Remove the ${members} member(s) in ${decoded} before deleting the year.` },
      { status: 409 },
    );
  }

  await prisma.academicYear.deleteMany({ where: { year: decoded } });
  revalidatePath("/team");
  revalidatePath("/contact");
  revalidatePath("/admin/team");
  return NextResponse.json({ ok: true });
}
