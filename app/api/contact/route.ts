import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  subject: z.string().max(300).optional(),
  message: z.string().min(1).max(5000),
});

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  try {
    await prisma.contactSubmission.create({ data: parsed.data });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Database not configured or unavailable" },
      { status: 503 }
    );
  }
}
