import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { noCacheJson } from "@/lib/cache-headers";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";

const emptyToNull = (v: unknown) => (typeof v === "string" && v.trim() === "" ? null : v);
const normalizeImageUrl = (v: unknown) => {
  if (typeof v !== "string") return v;
  const trimmed = v.trim();
  if (!trimmed) return trimmed;

  const forward = trimmed.replace(/\\/g, "/");
  if (/^(https?:)?\/\//i.test(forward) || forward.startsWith("data:")) {
    return forward;
  }

  const publicIdx = forward.toLowerCase().lastIndexOf("/public/");
  if (publicIdx >= 0) {
    return forward.slice(publicIdx + "/public".length);
  }

  if (forward.toLowerCase().startsWith("public/")) {
    return `/${forward.slice("public/".length)}`;
  }

  if (!forward.startsWith("/")) {
    return `/${forward}`;
  }

  return forward;
};

const createSchema = z.object({
  name: z.string().min(1).max(200),
  classification: z.enum(["FACULTY_ADVISOR", "CORE", "FUNCTIONAL"]),
  post: z.preprocess(emptyToNull, z.string().max(100).nullable()).optional(),
  imageUrl: z.preprocess((v) => normalizeImageUrl(emptyToNull(v)), z.string().nullable()).optional(),
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
  return noCacheJson(members);
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
  try {
    const member = await prisma.teamMember.create({ data: parsed.data });
    revalidatePath("/team");
    revalidatePath("/contact");
    revalidatePath("/admin/team");
    return NextResponse.json(member);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2000") {
      return NextResponse.json(
        { error: "One of the values is too long. Please shorten the URL/text and try again." },
        { status: 400 }
      );
    }
    throw error;
  }
}
