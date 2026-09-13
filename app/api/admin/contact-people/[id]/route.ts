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
    update: (args: {
      where: { id: string };
      data: ContactPersonData;
    }) => Promise<ContactPersonRow>;
    delete: (args: { where: { id: string } }) => Promise<ContactPersonRow>;
  };
};

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const parsed = contactPersonSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const db = prisma as PrismaWithContactPerson;
  const person = await db.contactPerson.update({
    where: { id },
    data: toContactPersonData(parsed.data),
  });

  revalidatePath("/contact");
  revalidatePath("/admin/contact-people");
  return NextResponse.json(person);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const db = prisma as PrismaWithContactPerson;
  await db.contactPerson.delete({ where: { id } });

  revalidatePath("/contact");
  revalidatePath("/admin/contact-people");
  return NextResponse.json({ ok: true });
}
