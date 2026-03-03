import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";

const emptyToNull = (v: unknown) => (typeof v === "string" && v.trim() === "" ? null : v);

const updateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  classification: z.enum(["FACULTY_ADVISOR", "CORE", "FUNCTIONAL"]).optional(),
  post: z.preprocess(emptyToNull, z.string().max(100).nullable()).optional(),
  imageUrl: z.preprocess(emptyToNull, z.string().nullable()).optional(),
  email: z.preprocess(emptyToNull, z.string().email().nullable()).optional(),
  phone: z.preprocess(emptyToNull, z.string().max(30).nullable()).optional(),
  linkedin: z.preprocess(emptyToNull, z.string().nullable()).optional(),
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
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  const member = await prisma.teamMember.update({
    where: { id },
    data: parsed.data,
  });
  return NextResponse.json(member);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await prisma.teamMember.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
