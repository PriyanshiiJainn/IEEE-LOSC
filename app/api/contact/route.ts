import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";
import { contactFormSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_MAX = 8;

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limited = checkRateLimit(`contact:${ip}`, RATE_MAX, RATE_WINDOW_MS);
  if (!limited.ok) {
    return rateLimitResponse(limited.retryAfterSec);
  }

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
      { status: 503 },
    );
  }
}
