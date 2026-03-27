import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { eventRegistrationSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = eventRegistrationSchema.safeParse(body);
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
    const eventRow = await prisma.event.findUnique({
      where: { id: parsed.data.eventId },
      select: { id: true, registrationClosed: true, registrationStatus: true },
    });
    if (!eventRow) {
      return NextResponse.json(
        {
          error:
            "This event doesn't exist in the database. Add events via Admin → Events.",
        },
        { status: 400 }
      );
    }
    const status = (eventRow.registrationStatus ?? "").toUpperCase();
    const isClosed =
      eventRow.registrationClosed ||
      status === "CLOSED" ||
      status === "SOON";

    if (isClosed) {
      return NextResponse.json(
        {
          error:
            status === "SOON"
              ? "Registration for this event has not opened yet."
              : "Registration for this event is closed.",
        },
        { status: 400 }
      );
    }
    await prisma.eventRegistration.create({ data: parsed.data });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const isPrisma = e && typeof e === "object" && "code" in e;
    const code = isPrisma ? (e as { code?: string }).code : undefined;

    if (code === "P2003") {
      return NextResponse.json(
        { error: "This event is no longer available. Try another event." },
        { status: 400 }
      );
    }
    if (code === "P1001" || code === "P1017" || code === "P2024") {
      return NextResponse.json(
      {
        error:
          "Database is not reachable. Check DATABASE_URL in .env, run migrations, and if using Neon, resume the project in the dashboard.",
      },
      { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error:
          "Registration could not be saved. Check that the database is set up and migrations have been run.",
      },
      { status: 503 }
    );
  }
}
