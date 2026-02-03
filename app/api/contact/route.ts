import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactFormSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = contactFormSchema.safeParse(body);
  if (!parsed.success) {
    const raw = parsed.error.flatten().fieldErrors;
    const errors: Record<string, string> = {};
    for (const [k, v] of Object.entries(raw)) {
      const msg = Array.isArray(v) ? v[0] : v;
      if (msg) errors[k] = msg;
    }
    const first = Object.values(errors)[0] ?? "Invalid input";
    return NextResponse.json({ error: first, errors }, { status: 400 });
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
