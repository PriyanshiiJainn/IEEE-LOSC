import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({
  eventId: z.string().min(1),
  name: z.string().min(1).max(200),
  rollNo: z.string().min(1).max(50),
  email: z.string().email(),
  phone: z.string().min(1).max(20),
});

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  try {
    await prisma.eventRegistration.create({ data: parsed.data });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Database not configured or unavailable" },
      { status: 503 }
    );
  }
}
