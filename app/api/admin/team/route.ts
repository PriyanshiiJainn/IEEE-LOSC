import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";

const emptyToNull = (v: unknown) => (typeof v === "string" && v.trim() === "" ? null : v);

const createSchema = z.object({
  name: z.string().min(1).max(200),
  classification: z.enum(["FACULTY_ADVISOR", "CORE", "FUNCTIONAL"]),
  post: z.preprocess(emptyToNull, z.string().max(100).nullable()).optional(),
  imageUrl: z.preprocess(emptyToNull, z.string().nullable()).optional(),
  email: z.preprocess(emptyToNull, z.string().email().nullable()).optional(),
  phone: z.preprocess(emptyToNull, z.string().max(30).nullable()).optional(),
  linkedin: z.preprocess(emptyToNull, z.string().nullable()).optional(),
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
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  const member = await prisma.teamMember.create({ data: parsed.data });
  return NextResponse.json(member);
}
