import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";

const createSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string(),
  date: z.string(), // ISO date
  time: z.string().max(50).optional(),
  venue: z.string().max(200).optional(),
  category: z.enum(["WORKSHOP", "HACKATHON", "QUIZ", "WEBINAR", "INVITED_TALK"]),
  brochureUrl: z.string().url().optional().nullable(),
  isFeatured: z.boolean().optional(),
  registrationClosed: z.boolean().optional(),
  registrationStatus: z.enum(["OPEN", "SOON", "CLOSED"]).optional(),
});

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const events = await prisma.event.findMany({ orderBy: { date: "desc" } });
  return NextResponse.json(events);
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const { date, ...rest } = parsed.data;
  const event = await prisma.event.create({
    data: {
      ...rest,
      date: new Date(date),
      registrationClosed: rest.registrationClosed ?? false,
      registrationStatus: rest.registrationStatus ?? "OPEN",
    },
  });
  return NextResponse.json(event);
}
