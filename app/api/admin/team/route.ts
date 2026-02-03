import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";

const createSchema = z.object({
  name: z.string().min(1).max(200),
  classification: z.enum(["FACULTY_ADVISOR", "CORE", "FUNCTIONAL"]),
  post: z.string().max(100).optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  email: z.string().email().optional().nullable(),
  phone: z.string().max(30).optional().nullable(),
  linkedin: z.string().url().optional().nullable(),
  order: z.number().int().optional(),
});

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const members = await prisma.teamMember.findMany({
    orderBy: [{ classification: "asc" }, { order: "asc" }],
  });
  return NextResponse.json(members);
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const member = await prisma.teamMember.create({ data: parsed.data });
  return NextResponse.json(member);
}
