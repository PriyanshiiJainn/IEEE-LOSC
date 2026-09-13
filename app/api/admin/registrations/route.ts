import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";
import { noCacheJson } from "@/lib/cache-headers";

export async function GET(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get("eventId");
  const registrations = await prisma.eventRegistration.findMany({
    where: eventId ? { eventId } : undefined,
    include: { event: { select: { id: true, title: true } } },
    orderBy: { createdAt: "desc" },
  });
  return noCacheJson(registrations);
}
