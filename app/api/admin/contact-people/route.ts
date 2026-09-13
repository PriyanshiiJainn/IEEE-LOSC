import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";
import { contactPersonSchema, toContactPersonData } from "@/lib/contact-people";
import type { ContactPersonData } from "@/lib/contact-people";

type ContactPersonRow = {
  id: string;
  name: string;
  designation: string | null;
  email: string | null;
  phone: string | null;
  order: number;
};

type PrismaWithContactPerson = typeof prisma & {
  contactPerson: {
    findMany: (args: {
      orderBy: Array<{ order: "asc" | "desc" } | { createdAt: "asc" | "desc" }>;
    }) => Promise<ContactPersonRow[]>;
    create: (args: { data: ContactPersonData }) => Promise<ContactPersonRow>;
  };
};

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = prisma as PrismaWithContactPerson;
  const people = await db.contactPerson.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
  return NextResponse.json(people);
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = contactPersonSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const db = prisma as PrismaWithContactPerson;
  const person = await db.contactPerson.create({ data: toContactPersonData(parsed.data) });

  revalidatePath("/contact");
  revalidatePath("/admin/contact-people");
  return NextResponse.json(person);
}
